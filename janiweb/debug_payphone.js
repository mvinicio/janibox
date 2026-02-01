
// import fetch from 'node-fetch'; // Native in Node 18+
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env manually
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const STATIC_TOKEN = env.VITE_PAYPHONE_TOKEN;

console.log('--- PayPhone Debug ---');
console.log('StaticToken:', STATIC_TOKEN ? STATIC_TOKEN.substring(0, 10) + '...' : 'Missing');

// 2. Try /api/Links
async function testLinks() {
    console.log('\n--- Test 2: /api/Links Endpoint (Production) ---');
    const payload = {
        amount: 500,
        amountWithoutTax: 500,
        currency: "USD",
        clientTransactionId: 'link-' + Date.now(),
        reference: "Test Order",
        expireIn: 60 // minutes
    };

    try {
        const res = await fetch('https://pay.payphonetodoesposible.com/api/Links', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${STATIC_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        console.log('Status:', res.status);
        if (!res.ok) {
            console.log('Body:', await res.text());
        } else {
            console.log('Success!', await res.json());
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
}

async function testButtons() {
    console.log('\n--- Test 1: /api/button/Prepare Endpoint (Production) ---');
    const payload = {
        amount: 500,
        amountWithoutTax: 500,
        clientTransactionId: 'test-' + Date.now(),
        email: 'test@example.com',
        responseUrl: 'http://localhost',
        cancellationUrl: 'http://localhost'
        // storeId removed
    };

    try {
        const res = await fetch('https://pay.payphonetodoesposible.com/api/button/Prepare', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${STATIC_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        console.log('Status:', res.status);
        if (!res.ok) {
            console.log('Body:', await res.text());
        } else {
            console.log('Success!', await res.json());
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
}

await testButtons();
await testLinks();
