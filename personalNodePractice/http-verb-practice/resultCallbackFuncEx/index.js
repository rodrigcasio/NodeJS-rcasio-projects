
let weather = require('./get-weather2');
let location = 'KSFO';

weather.current(location, (temp_f_) => {
    console.log(`the current temperature at ${location} is ${temp_f}F`);
});