// 2nd example of using Axios to handle HTTP GET request

const axios = require('axios');

axios.get('https://jsonplaceholder.typicode.com/users')
    .then((response) => {
        console.log(response.data);
    })
    .catch((err) => {
        console.error('Error fetching data', err);
    });