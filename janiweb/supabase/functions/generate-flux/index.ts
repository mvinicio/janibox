import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { prompt, fluxKey, imagePrompt, imagePromptStrength = 0.5 } = await req.json();

        if (!fluxKey || !prompt) {
            throw new Error('fluxKey and prompt are required');
        }

        const body: any = {
            prompt: prompt, // Use the user's prompt directly without forcing brand identity
            width: 1024,
            height: 1024,
            safety_tolerance: 2,
            output_format: "jpeg"
        };

        if (imagePrompt) {
            body.image_prompt = imagePrompt;
        }

        // Using flux-pro-1.1 for better quality and features
        const startResponse = await fetch('https://api.bfl.ai/v1/flux-pro-1.1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Key': fluxKey,
            },
            body: JSON.stringify(body),
        });

        if (!startResponse.ok) {
            const errorData = await startResponse.json().catch(() => ({}));
            return new Response(JSON.stringify(errorData), {
                status: startResponse.status,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const { id } = await startResponse.json();

        let imageUrl = '';
        let status = 'Pending';
        let attempts = 0;

        while (status !== 'Ready' && attempts < 30) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            attempts++;

            const pollResponse = await fetch(`https://api.bfl.ai/v1/get_result?id=${id}`, {
                headers: { 'X-Key': fluxKey },
            });

            if (pollResponse.ok) {
                const resultData = await pollResponse.json();
                status = resultData.status;
                if (status === 'Ready') {
                    imageUrl = resultData.result?.sample;
                } else if (status === 'Failed') {
                    throw new Error('BFL generation failed');
                }
            }
        }

        if (!imageUrl) {
            throw new Error('Timeout');
        }

        return new Response(JSON.stringify({ imageUrl }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error) {
        let msg = 'Unknown error';
        if (error instanceof Error) msg = error.message;
        return new Response(JSON.stringify({ error: msg }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
