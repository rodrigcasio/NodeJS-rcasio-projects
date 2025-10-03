// Example practicing of using async/await for a http request 
// turning the orginal get-usersJsonplaceholder.js request with using 
//  async/await, and Promise using ( Promisification ) // wrapping the callback-based https.request 
// Code converted to use the async/await funtion and a Promise 

const https = require('https');

const option = {
    hostname: 'jsonplaceholder.typicode.com',
    path: '/users',
    method: 'GET'
};

const asyncFunc = async () => {
    return new Promise((resolve, reject) => {
        const req = https.request(option, (res) => {
            let rawData = '';
            if(res){
                res.on('data', (chunk) => {
                    rawData += chunk;
                });
                res.on('end', () => {
                    try {
                        const users = JSON.parse(rawData);
                        resolve(users);
                    } catch (err) {
                        reject(console.error(err.message));
                    }
                });
            }

            res.on('error', (e) => {
                reject(e);
            });
        });
        req.end();
    });
}

const runnerAsync = async () => {
    try {
        const result = await asyncFunc();
        console.log(result[0]);
    } catch (err) {
        console.log(err.message);
    }
}

runnerAsync();