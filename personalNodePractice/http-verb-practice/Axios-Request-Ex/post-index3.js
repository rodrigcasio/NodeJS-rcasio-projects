// Example of using Axios to make a POST request 

const axios = require('axios');

const data = {
    name: 'Rodrig',
    age: 26,
    userId: 1,
};

axios.post('https://jsonplaceholder.typicode.com/posts', data)
    .then((response) => {
        console.log('Post created successfully ✅');
        console.log('Status:', response.status);
        console.log('Response from server:', response.data);
    })
    .catch((err) => {
        console.log('Error creating post', err);
        
        if(err.response){   // request was made and the server responded with a status code 
            console.error('Server responded with status', err.response.status);
            console.error('Server response data', err.response.data);
        }else if (err.request) {
            console.error('No response received:', err.request);    // request made but no response received
        } else {
            console.err('Error message: ', err.message);
        }
    });
