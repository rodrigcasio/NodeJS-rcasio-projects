// HTTP request example: Fetching a JSON forecast from api.weather.gov

const https = require('https');           // NOTE: We must use the 'https' module for this modern API.

const options = {
    hostname: 'api.weather.gov',
    path: '/points/38.90,-77.03/forecast', 
    method: 'GET'
    /* * IMPORTANT FIX FOR FUTURE REFERENCE: 
     * The previous "Access Denied" error occurred because the server required a User-Agent header.
     * To successfully access this API, you MUST add a headers block like this:
     * * headers: {
     * 'User-Agent': 'NodeJS Practice Script, rcasio@example.com' 
     * }
     */
};

const req = https.request(options, (res) => {
    let buffer = '';

    res.on('data', (chunk) => {                             // Asynchronously collect data chunks as they arrive
        buffer += chunk;
    });

    res.on('end', () => {                                   // Asynchronously run this code when all data is received
        console.log('--- Final Asynchronous Response ---');
        console.log(buffer);
        console.log('-----------------------------------');
    });
});

req.on('error', (e) => {
    console.error(`Error during request: ${e.message}`);
});

// CRUCIAL: Send the request to the network
req.end();

// This line executes immediately, demonstrating non-blocking I/O 
console.log('*** Request sent! Node.js is NOT waiting for the server. ***');