// Main application 

let weather = require('./get-weather2');
let location = 'KSFO';

weather.current(location, (err, temp_f) => {
    
    // 1. handle err : (if error exists, log failure and stop)
    if(err){
        console.error(`ERROR: Could not fetch weather for ${location}.`)
        console.error(`Details: ${err.message}`);
        return;
    }

    // Step 2. handle success --- (if no error, proceed to use the temperature data)
    console.log(`the current temperature at ${location} is ${temp_f}F`);
});


/*  ANOTHER WAY TO HANDLE ERROR,
    LOGGIN THE ENTIRE OBJECT ERROR 
    
    // handle err : (if error exists, log object error)
    if(err){
        console.log(err);
        return;
    }

    output: 
    {
        errno: -3008,
        code: 'ENOTFOUND',
        syscall: 'getaddrinfo',
        hostname: 'w1.weather.gov'
    }

*/