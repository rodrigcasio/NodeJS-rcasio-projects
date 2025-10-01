// Example of using Axios
// Explanation in file 'READMEExplanation.md' file 

const axios = require('axios');

console.log('1. Start the script (sync)');

const connectURL = (url) => {
                                                console.log(`2. Calling axious.get for url (sync)`);
    const req = axios.get(url);             // promise created 
                                                console.log(`3. After axious.get for url (sync)`);
    console.log(req);
    req.then((resp) =>{
        console.log('4. Fulfilled! for : url (async)');
        console.log(resp.data);
    })
    .catch((err) => {
        console.log('5. Rejected for: url (async)');
    });
}


connectURL('https://jsonplaceholder.typicode.com/posts/1');
console.log('6. end of script (sync) ');

