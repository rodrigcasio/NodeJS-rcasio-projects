## Using `fetch()` for the file `get-JsonPlaceholder.js`
In file `fetch-JsonPlaceholder.js`, the script simplifies the process of an HTTP request. 

Using `fetch` is an standard for modern asynchronous HTTP request in JavaScript.

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













1. After doing some research, `fetch()` is a **web API**.

    - **My Code**: We use `fetch(url)`
    - **The interface**: `fetch()` is standardized, pre-written functon that alows to interact with a system (the browser) that knows how to handle the job of network request.

    - **The underlying system**: The browser takes the URL, resolves the DNS, opens a TCP/IP socket, constructs the HTTP request, and sends the request over the internet.

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
