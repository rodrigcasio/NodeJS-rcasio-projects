
const parseString = (data, callback) => {
    callback(null, {current_observation: { temp_f: [data] } });
}

const http = require('http');

exports.current = (location, resultCallback) => {
    let options = {
        host: 'w1.weather.gov',
        path: '/xml/current_obs/' + location + '.xml'
    };

    const req = http.request(options, (res) => {
        let buffer = '';

        res.on('data', (chunk) => {     // 1. Async..response is COMPLETE. Now, parse the data 
            buffer += chunk;
        });

        res.on('end', () => {
            parseString(buffer, (err, result) => {      // APLICATION/PARSING Error handling (res level)
                if(err){                        // 2. ERROR CHECKING: if parsing failed, pass the error back to the main app.
                    resultCallback(err);        // here pass error to the main app callback
                    return;
                }
                resultCallback(null, result.current_observation.temp_f[0]);      // if not error : 3. SUCCESS: Pass the final temperature result back to the main app
            });
        });
    });     // the http.request call ends here <---

    // Attach error listener to request object (req) NETWORK ERROR HANDLING (req level)
    req.on('error', (err) => {
        resultCallback(err);            // catching the ENOTFOUND error and sends it back to the main app   (./index.js)
    });

    req.end();      // .end() sends the request !
}

