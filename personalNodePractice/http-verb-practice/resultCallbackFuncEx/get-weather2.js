const http = require('http');

exports.current = (location, resultCallback) => {
    let options = {
        host: 'w1.weather.gov',
        path: '/xml/current_obs/' + location + '.xml'
    };

    http.request(options, (res) => {
        let buffer = '';

        res.on('data', (chunk) => {
            buffer += chunk;
        });

        res.on('end', () => {
            parseString(buffer, (err, result) => {
                if (err){
                    resultCallback(err);
                    return;
                }
                
                resultCallback(null, result.current_observation.temp_f[0]);
            });
        });
    }).end();
}
