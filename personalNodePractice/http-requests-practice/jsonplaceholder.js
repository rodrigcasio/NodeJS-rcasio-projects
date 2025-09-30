// Fetching fake user data

const https = require('https');

const options = {
    hostname: 'jsonplaceholder.typicode.com',
    path: '/users',
    method: 'GET'
};

const req = https.request(options, (res) => {
    let rawData = '';

    res.on('data', (chunk) => {
        rawData += chunk;
    });

    res.on('end', () => {
        try {
            // convert the JSON string response into a JS object
            const users = JSON.parse(rawData);
            
            console.log(`--- ASYNCHRONOUS RESPONSE RECEIVED ---`);
            console.log(`Successfully fetched ${users.length} users.`);
            console.log(`First name:`, users[0].name);
            console.log(`--------------------------------------`);
        } catch (e) {
            console.error('Error parsing JSON: ', e.message);
        }
    });
});

req.on('error', (e) => {
    console.error(`Network Error: ${e.message}`);
});

req.end();

// This line confirms non-blocking behavior
console.log(`*** Request sent to JSONPlaceholder. Waiting for the callback... ***`);

