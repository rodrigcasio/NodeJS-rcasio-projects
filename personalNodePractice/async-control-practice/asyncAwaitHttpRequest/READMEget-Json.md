## Implementing async/await function with Promise in a HTTP request.
- about file `get-JasonPlaceholder.js`

In `getJsonPlaceholder.js`, We made use of `async/await` function to handle a **Promise** that wraps a HTTP request.
- This example showcases a **proper and common pattern** for modern JavaScript/Node.js to handle asynchronous operations like HTTP request that are originally on **callbacks** (like http.request)

## Objective
I mainly wanted to make use of and `async/await` function for a HTTP request that I previously made with **callback-based**, named `get-usersJsonplaceholder.js` that is located in the the directory `http-request-practice/`. 

## Approach 
1. **Bridging Callbacks to Promises**. In the first function `asyncFunc()` which can identified as `(Promisifier)` uses the **Promise** constructor to 'wrap' the callback-based `https.request`. I found out that this technique called **promisification**, and it is the standard way to convert older asynchronous functions into a Promise-based form.

```js
const https = require('https');

const option = {
    hostname: 'jsonplaceholder.typicode.com',
    path: '/users',
    method: 'GET'
};
const asyncFunc = async () => {
    return new Promise((resolve, reject) => {
        const req = https.request(option, (res) => {
```

2. **resolve & reject**. In this approach we call `resolve(users)` when the data is successfully received and parsed, and within the `req` it rejects the promise with `reject(e)` when a network error, or a parsing error (`catch(err)`) occurs.

```js
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
```
3. **Simplified consumption**. The `runnerAsync()` function, shows the core benefit if `async/await`.
    - Within, `await asyncFunc()` pauses execution until the **Promise** *resolves* with the **data** (or *rejects* with an **error**).
    
    - Using the `try/catch` **block** provides a clean, synchronous-looking error handling for any rejection from the **Promise**.

```js
const runnerAsync = async () => {
    try {
        const result = await asyncFunc();
        console.log(result[0]);
    } catch (err) {
        console.log(err.message);
    }
}

runnerAsync();      
```

## Last thougths 
This script was done for practice and trying out if it would work using async/await function and a Promise.
I'm happy that in fact.. it did optain the data correctly, handling the **data** and **errors** with a `Promise`.

## output

```json
{
  id: 1,
  name: 'Leanne Graham',
  username: 'Bret',
  email: 'Sincere@april.biz',
  address: {
    street: 'Kulas Light',
    suite: 'Apt. 556',
    city: 'Gwenborough',
    zipcode: '92998-3874',
    geo: { lat: '-37.3159', lng: '81.1496' }
  },
  phone: '1-770-736-8031 x56442',
  website: 'hildegard.org',
  company: {
    name: 'Romaguera-Crona',
    catchPhrase: 'Multi-layered client-server neural-net',
    bs: 'harness real-time e-markets'
  }
}
```

@rodrigcasio