// Here is an example of dealing with a HTTP request with Axios and async/await 

const axios = require('axios');

const postData = async () => {
    try {
        const response = await axios.post('https://jsonplaceholder.typicode.com/posts', { name: 'Rodrigo', age: 26, userId: 1});
        
        console.log(`Post Created successfully ✅`);
        console.log('Response Data:', response.data); 
        console.log('Response Status:', response.status);
   } catch (err) {
        console.error('Error Posting Data ❌', err);
   }
}

// calling function async/await
postData();