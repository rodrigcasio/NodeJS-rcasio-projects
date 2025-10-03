# 𝑓 Using `fetch()` for the file `get-JsonPlaceholder.js`
In file `fetch-JsonPlaceholder.js`, the script simplifies the process of an HTTP request. 

Using `fetch` is an standard for modern asynchronous HTTP request in JavaScript.

## 🤞 Promises in function `runnerAsync()`
In this `runnerAsync` it handles **2 Promises** in a `fetch` request

- **First Promise**: **The Network Promise**
This promise is returned direclty by `fetch(url)` call. It represents the time taken for the inital network communication.

|Code | `const response = await fetch(url)`|
| :--- | :--- |
|**Promise Location**|The `fetch()` function itself|
|**When it resolves**| When the client **successfully contacts the server** and receives the **response headers** (including the HTTP status code, e.g., 200, 404, 500)|
|**When it returns**| The `Response` object (`response`).|
|**When it rejects**|**Only** in the case of a **network failure** (e.g., no internet connection, DNS failure)|

*The `await` keyword on this line **pauses** your function until network connection is stablished and the `Response` object ready.*

- **Second Promise**: **The Data Extraction** *(body reading)*
This **Promise** is returned by the `response.json()` method. It represents the time taken to download the body content and convert it to a **JavaScript object**.

|Code| `const users = await response.json()` | 
| :--- | :--- |
|**Promise Location**| The `.json()` **method** of the `Response` object|
|**When it Resolves**| When the entire response body has been **downloaded, read from the stream, sucessfully parsed** as a JavaScript object by `JSON.parse()`.|
|**What it Returns**|The **parsed JavaScript object/array `(users)`**|
|**When it Rejects**| If the **data stream fails** during download, or if the downloaded content is **not valid JSON**.|

*The second `await` keyword pauses your function *again* untilthe full data body is processed and the final JavaScript `users` object is available*

##  🤓 Simple terms of order of execution

|Step|Code Line Executing the Step|Asynchronous Task|
| :--- | :--- | :----|
|1. **Request/Header Wait**| `const response = await fetch(url)`| Wait for the server to reply with headers|
|2. **Status Check**|`if(!response.ok){ ... }`| Synchronous check of the status code **(After Promise 1 resolves)**|
|3. **Body Download**|`const users = await response.json()`| Wait for the entire body to download and be parsed by `JSON.parse()`.|
|4. **Assignment**| `const users = ...`| Synchronous assignment of the final JavaScript object|



## fetch used in `fetch-JsonPlaceholder.js`
The process inside the `async` function involves two mandatory `await` statements because `fetch()` is a **two-stage process**.

1. The initial `fetch` call.
```js
const response = await fetch('https://jsonplaceholder.typicode.com/users');      
```
- **What it does**: Sends the HTTP GET request to the specified URL.

- **What it returns**: A **Promise** that resolves with a **Response object** once the initial headers of the response are received. **It does not** wait for the entire data body to download.

- **Important Note**:  The **Promise** returned by `fetch()` only rejects on network failures (like no internet connection). It **resolves** even if the HTTP status is a client or server **error** (e.g., 404 Not Found, 500 Internal Server Error). that is why the code: `if (!response.ok){ ... }` is imporant... 

2. **Checking status**

```js
    if(!response.ok){
        throw new Error(`HTTP error, status: ${response.status}`);
    }
```
- **What it does**: The `.ok` property on the `Response` object is a boolean that is `true` if the HTTP status is in the range of **200-299**(success), and `false` otherwise.

- **Role in `try...catch`**: By manually checking `.ok` and throwing an `Error`, you ensure that bad HTTP response are correctly routed to the `catch` block, giving you proper error handling.


3. **Reading the body** `response.json()`

```js
const users = await response.json();
```
- **What it does**: This method reads the entire response body body, waits for it to finish downloading, and then attempts to **parse the body as JSON**

- **What it returns**: A **second Promise** the resolves with the final JavaScript object (or array) represented by the JSON data.

- **Need for `await`**: Since `response.json()` is also asyncrhonous (it waits for the data stream), you must use `await` again to pause execution until the final `users` array is ready.

## Steps 

1.  Send the request and wait for the initial response headers.
```js
    try {
        const response = await fetch('url');
    }
```

2. Check for a successful HTTP status (e.g., 200- 299).
    - Throw an error if the status code indicatesa problem (e.g, 404, 500)
```js
if (!response.ok){
    throw new Error(`HTTP error, status: ${response.status}`);
}
```

***IMPORTANT**: For HTTP status codes like **404 (Not Found)** or **500 (Server Error)**, the fetch promise still resolves(it successfully talked to the server). So the `response.ok` **property** is designed to handle this: it's only `true` for status codes in the 200-299 range.*


3. Wait for the response body to be fully downloaded and parsed as JSON

```js
const users = await response.json();
```

4. Logging into the console the first user
```js
console.log(users[0]);
```

5. Completing the `try/catch` and catch any errors: network issues `(Step 1)`, non-200 status `(Step 2)`, or JSON parsing failure `(Step 3)`
```js
} catch (err) {
    console.error('Error fetching data:', err.message);
}
```

After doing some research, `fetch()` is a **web API**.

**My Code**: We use `fetch(url)`

**The interface**: `fetch()` is standardized, pre-written functon that alows to interact with a system (the browser) that knows how to handle the job of network request.

**The underlying system**: The browser takes the URL, resolves the DNS, opens a TCP/IP socket, constructs the HTTP request, and sends the request over the internet.

*`fetch()` is the **interface** that abstracts all the complexity away, providing a simple and structured method (an API) for us to use..*

So here we are using the `fetch` **API** in the code (a programming interface) to make a call to a **Web API** (the remote service) to extract data 

2. The `fetch` API defines:
    -  **A function name**: `fetch`.
    
    - **Input Parameters**: It needs a URL `(fetch(url))`, and optionally an `options` object (for method, headers... and more).

    - **Output**: It always returns a **Promise** that resolves to a **Response Object**.

These consistent set of rules (function name, input parameters, outputs) is wat it defines an **API** in the context of a library, module, or programming interface.

## Examples of API with analogy

| Term | What is the API ? | Analogy |
| :--- | :--- | :--- | 
|**JSONPlaceholder** | The entire remote service you call | The entire **Restaurant**|
|**The `fetch()` function** | A local JavaScript function that lets you access the network | The `Doorknob` that lets you walk into the restaurant|

## Code

```js
const runnerFunc = async () => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');      
        if(!response.ok){
            throw new Error(`HTTP error, status: ${response.status}`);
        }

        const users = await response.json();
        console.log(users[0]);
    } catch (err) {
        console.error('Error fetching data:', err.message);
    }
}
runnerFunc();
```

### Output

*What `console.log(users[0])` returns:*

% node fetch-JsonPlaceholder.js 
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