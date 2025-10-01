// Example of using Axios
// Explanation at the bottom of the code 

const axios = require('axios');

console.log('1. Start the script (sync)');

const connectURL = (url) => {
                                                console.log(`2. Calling axious.get for url (sync)`);
    const req = axios.get(url);             // promise created 
                                                console.log(`3. After axious.get for url (sync)`);
    console.log(req);
    req.then((resp) =>{
        console.log('4. Fulfilled! for : url (async');
        console.log(resp.data);
    })
    .catch((err) => {
        console.log('5. Rejected for: url (async)');
    });
}


connectURL('lol');
connectURL('jsonplaceholder.typicode.com');

console.log('6. end of script ');


// All the (sync) operations (yout numbered logs and Promise creation) run first, in order.
// The asynchronous operations (inside .then() and .catch() only run after the HTTP request finish,
//     so they appeaer later in the output)

// Synchronous code runs top-to-bottom, immediately. 
// Asynchronous code (like network requests) runs later, after the sync code is done

// OUTPUT :

// 1. Start the script (sync)
// 2. Calling axious.get for url (sync)
// 3. After axious.get for url (sync)
// Promise { <pending> }
// 2. Calling axious.get for url (sync)
// 3. After axious.get for url (sync)
// Promise { <pending> }
// 6. end of script 
// 5. Rejected for: url (async)
// 5. Rejected for: url (async)