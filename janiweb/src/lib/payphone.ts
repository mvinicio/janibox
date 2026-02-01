import { supabase } from './supabaseClient';

export interface PayPhoneResponse {
    paymentId: number;
    payWithCard: string; // URL to redirect
}

export const preparePayment = async (amount: number, txId: string, email: string) => {
    // 1. Fetch Credentials from DB
    const { data: settings, error: settingsError } = await supabase
        .from('store_settings')
        .select('*')
        .single();

    if (settingsError || !settings) {
        console.error("Failed to load PayPhone settings", settingsError);
        throw new Error("Error de configuración de pagos. Contacte al administrador.");
    }

    const token = settings.payphone_token;
    const storeId = settings.payphone_store_id;

    if (!token || !storeId) {
        throw new Error("PayPhone no está configurado. Revise el panel de administración.");
    }

    const amountInCents = Math.round(amount * 100);

    const data = {
        amount: amountInCents,
        amountWithoutTax: amountInCents,
        amountWithTax: 0,
        tax: 0,
        service: 0,
        tip: 0,
        currency: "USD",
        clientTransactionId: txId.replace(/-/g, '').substring(0, 12), // Max 15 chars, 12 is safe
        storeId: storeId,
        reference: `JaniBox Order ${txId.substring(0, 8)}`,
        email: email,
        // responseUrl might not be supported here, usually configured in Store Profile
    };

    console.log('PayPhone Links Payload:', data);

    // Use Proxy to /api/Links
    const response = await fetch('/api/payphone/Links', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error('PayPhone Status:', response.status);
        console.error('PayPhone Error Body:', errorBody);
        throw new Error(`PayPhone API Error: ${response.status} ${errorBody}`);
    }

    // Response from Links API might be a direct string (URL) or Object
    const responseData = await response.json();
    console.log('Raw PayPhone Response:', responseData);

    let payWithCardUrl = '';
    let paymentId = 0;

    if (typeof responseData === 'string') {
        payWithCardUrl = responseData;
    } else if (responseData && responseData.payWithCard) {
        payWithCardUrl = responseData.payWithCard;
        paymentId = responseData.paymentId;
    }

    return {
        paymentId,
        payWithCard: payWithCardUrl
    } as PayPhoneResponse;
};
