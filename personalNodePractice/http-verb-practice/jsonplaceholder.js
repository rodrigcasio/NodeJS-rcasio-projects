// Fetching fake user data
// Demonstrates basic Asynchronous, Non-blocking I/O in Node.js by performing 
// an ongoing HTTPS GET request to a third-party API (JSONPlaceholder).

// using GET request to retrieve data from JSONPlaceholder server

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
        try {    // protect this code 
            // convert the JSON string response into a JS object
            const users = JSON.parse(rawData);
            
            console.log(`--- ASYNCHRONOUS RESPONSE RECEIVED ---`);
            console.log(`Successfully fetched ${users.length} users.`);
            console.log(`First name: ${users[0].name}`);
            console.log(`--------------------------------------`);
        } catch (e) {   // if JSON.parse fails, catch the syntaxError here
            console.error('Error parsing JSON: ', e.message);
        }
    });
});

req.on('error', (e) => {
    console.error(`Network Error: ${e.message}`);
});

req.end();     // sending request

// This line confirms non-blocking behavior
console.log(`*** Request sent to JSONPlaceholder. Waiting for the callback... ***`);


/*
    1. Non-blocking: Show that the program executes the final console.log() BEFORE the network response is received 
    2. Asynchronous Callback: Use the 'data' and 'end' event listeners inside the main callback function to handle the response stream
    3. Error handling: Use the try...catch block to safely parse the JSON data, preventing a crash if data is corrupted

    ORDER OF EXECUTION:
    -- NON-Blocking flow
    1. (sync): Code runs options block and prepares the request object (req)
    2. (sync): req.on('error', ...) listener is registered.
    3. (sync): req.end() sends the request over the network.
    4. (sync): console.log(*** Reuqest sent..) executes IMMEDIATELY

    -- NETWORK wait time (Asynchronous) -- 
    5. (async): Server response arrives. The main callback function (res) is triggered.
    6. (async): res.on('data', ...) executes repeatedly to collect chunks into 'rawData' variable.
    7. (async): res.on('end', ...)  executes once all data is collected.
    8. (async): JSON.parse() and final console.log() output the result.

*/