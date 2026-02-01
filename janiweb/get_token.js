
// import fetch from 'node-fetch'; // Native in Node 18+
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hardcoded Credentials from User Chat (NEW PROD APP)
const CLIENT_ID = "tZ3hMTtpSUYfDaSaXaqUQ";
const CLIENT_SECRET = "XA7cfEGIQESxGIQAlnkYXA";

console.log('--- PayPhone Token Fetcher (Try 4: JSON) ---');

async function getToken() {
    console.log('Requesting Token from Production (JSON)...');

    // Try JSON body instead of URL Encoded
    const payload = {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'client_credentials' // some APIs don't need this if JSON
    };

    try {
        const res = await fetch('https://pay.payphonetodoesposible.com/api/security/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        console.log('Response Status:', res.status);
        if (!res.ok) {
            console.log('Error Body:', await res.text());
        } else {
            const data = await res.json();
            console.log('ACCESS_TOKEN_START');
            console.log(data.access_token);
            console.log('ACCESS_TOKEN_END');
            return data.access_token;
        }

    } catch (e) {
        console.error('Exception:', e.message);
    }
}

async function getTokenForm() {
    console.log('Requesting Token from Production (FormEncoded) on API subdomain...?');
    // Just testing logic
}

await getToken();
