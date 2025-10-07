# Using **Axios** with **async/await** function to generate `HTTP POST` request

## Approach
In file `post-index4AsyncAwait.js`. We demonstrate an example of using **Axios** with **async/await** function to handle the HTTP POST request efficiently, `await` **pauses** `postData()` function execution for POST request, and the result is handle within the `try/` code block.

## Code Description
| **Code** | **What It Does**| 
| :--- | :--- |
|`const postData = async () => { ... }` | Creating the asynchronous function to **post** data to an **API**|
| `const response = await axios.post('https://jsonplaceholder.typicode.com/posts, { name: 'Rodrig', age: 26, userId: 1 });`| Using `await` for the response from the **Axios** POST request, and using as second argument the data we want to **post**. In this case it return a resolved **Promise** to the response object if request was succesfull|
|`console.log('Post Created successfully ✅'); console.log(response.data);console.log('Response Status:', response.status);` | Logging into the console the `response.data`, `response.status` and a messsage that request was successfully created|
|` } catch (err) { console.error('Error posting data.', err)}` | If there was an error, log the error message to the console.|

## Code

```js
const axios = require('axios');

const postData = async () => {
    try {
        const response = await axios.post('https://jsonplaceholder.typicode.com/posts', { name: 'Rodrig', age: 26, userId: 1 });

        console.log('Post Created Successfully ✅');
        console.log('Response data:', response.data);
        console.log('Response Status:', response.status);
    } catch (err) {
        console.error('Error posting data ❌', err);
    }
}

// calling the async function
postData();
```

## Output
`node post-index4AsyncAwait.js`
```zsh
Post Created successfully ✅
Response Data { name: 'Rodrigo', age: 26, userId: 1, id: 101 }
Response Status: 201
```
@rodrigcasio