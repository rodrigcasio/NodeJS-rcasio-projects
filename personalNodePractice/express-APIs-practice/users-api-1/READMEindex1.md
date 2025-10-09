# First Express RESTful API **Users API Example**

In file `get-index1.js` it demonstrates the creation of a **back-end** application. This is a minimal **Node.js** server built with **Express** that acts as a proxy for fetching data from an external **RESTful API** (Jsonplaceholder).

## Project Overview
- Setting up a basic **Express Server**.

- Defining RESTful **endpoints** using app.get()
- Utilizing **Axios** to generate a request **HTTP GET** from the server 
- Demonstrating the difference between **Route Handler** and a **Middleware function**
- Finally, showcasing the concept of **middleware chain** using `next()`.

## Setup and Installation 

In order to run this API locally:

| **Step** | **What need to do** |
| :--- | :--- |
| 1 | **Clone the repo** or navigate to the folder project `express-APIs-practice/users-api-1`|
| 2 | **Install dependencies with**: `npm install`, this server **API** requires **Axios** and **express**|
|3 | Run the server with: `node get-index1.js`. The server will start and listen on port `3000`. A confirmation in the console will show `Express server listening at **http://localhost:3000`|

## API endpoints 🔺

This server provides three endpoints which are accessible via a `GET` request

| **Type** | **URL**| **Method**| **Description**|
| :--- | :--- | :--- | :--- |
|1. **Root Endpoint**| `http:://localhost:3000/`|`GET`| Returns a string welcome to confirm that the server is running |
|2. **Basic Fetch Endpoint**| `http://localhost:3000/fetch-users`| |`GET`| Fetches users from the external **API** with the endpoint `jsonplaceholder.typicode.com/users` and returns the data as a **JSON response** (the promise having been resolved by `await`). The server uses `res.json(response.data)` to send the data|
|3.**Middleware Example Endpoint (logger)**|`http://localhost:3000/fetch-users2`| `GET`| This route demonstrates the **middleware chain** pattern. 1. It executes the `logger` **middleware** (prints a log to the server console). 2. Then proceeds to fetch and return the user **data**|

## Tech used    

| Tech | Role in this project |
|:---|:---|
|**Node.js** | The runtime enviroment for executing the server code |
|**Express** | The minimal framework used to handle routing and server logic |
|**Axios**| A Promised-based  HTTP client used to **fetch external data** (making the outbound API call)|


## Code details 

1. Server setup

| **Code** | **Key Concept** | Explain |
| :--- | :--- | :--- |
|`const express = require('express');`| **Importing the Module**| Importing the **Express framework** within the file|
|`const app = express()`| **App instantiation**| Creating the *Express Application Instance** in `app`. This object is the main server which will handle **routing**, **runs middleware**, and manages the lifecyle of the server app|
|`const port = 3000`| **Defining Port**| Definning the network port on which the server will **listen** for incoming client requests|
|`const axios = require('axios')`| **External Client** | Importing the **Axios Library** which will handle *within* the server make **outbound HTTP requests** to external services, in this case an external API `Jsonplaceholder`|

2. Base route

| **Code** | **Key Concept** | Explain |
| :--- | :--- | :--- |
|`app.get('/', (req, res) => { ... })`| Route Definition | Defines a **Route Handler** for incoming `GET` requests sent to the server's root path `/`|
|`(req, res) => { ... }`| **Route Handle Function** | Anonymous function is executed when the route is matched. It receives the **Request Object** (req) and the **Response Object** (res)|
|`res.send(' ... ')`| **Response Termination** |Sending a simple `HTML/plain-text` response back to the client and **ends the request-response cycle**|

3. *Middelware function*

| **Code** | **Key Concept** | Explain |
| :--- | :--- | :--- |
|`const logger = (req, res, next) => { ... }`| **Middleware signature**| Defining the standard Express middleware function. It is important to include the `next` argument |
|`console.log('Request...')`| **Middleware Task** | Executes a specific task **before** the request reaches the final handler (task: logging the URL)|
|`next();`| **Passing Control** | **IMPORTANT**: Passes control of the request to the **next function** (the route handler) in the processing chain|

4. Fetch route with middleware function

| **Code** | **Key Concept** | Explain |
| :--- | :--- | :--- |
|`app.get('/fetch-users2', logger, async (req, res) => { ... });`| **Middleware chain**| **Defines the route and the middleware chain** that first executes the `logger` **middleware** and then proceeds to the **Route Handler**|
|`async (req, res) => { ... }`| **Async Route Handler**| Declaring `async` because it contains `await` keyword, which it is used to pause execution until the **Promise** from the network call resolves..|
|`await axios.get('https://jsonplaceholder.typicode.com/users');`| **Outbound Request**| Makes an asynchronouse  `GET` request to the external API (in this case Jsonplaceholder). `await` pauses the function until the response is received.
|`res.json(response.data);`| **Data Transformation**| Sends the JavaScript object (response.data) back to the client. Express automatically runs `JSON.stringify()` and sets the correct HTTP headers|

5. Server Initialization

| **Code** | **Key Concept** | Explain |
| :--- | :--- | :--- |
|`app.listen(port, () => { ... })`| **Start server**| **Initializes and starts the server. It binds the application to specified port `3000` and begins listening for connections|
|`() => { ... }`| **callback function** | A function that executes once the server is successfully running. In here.. it is used to confirm the port address in the console. `(console.log('Express server listening at http://localhost${port}'))`|


# Code
```js
// This is an example of creating an Express API which follows REST architecural style and becomes a RESTful API
// 2. Added a middleware chain example

const express = require('express');
const app = express();
const port = 3000;

const axios = require('axios');

app.get('/', (req, res) => {
    res.send('Hello everyone!, This is an Express Server!');
})

app.get('/fetch-users', async (req , res) => {
    try {
        const response = await axios.get('http://jsonplaceholder.typicode.com/users');        // Axios automatically runs JSON.parse() on the received text
        console.log(`Data fetched successfully ✅`);
        res.json(response.data);              // here is not necessary to use  JSON.parse(response.data)
    } catch (err) {
        res.status(500).send('Error fetching data');
    }
});

// middleware function
const logger = (req, res, next) => {        
    console.log(`Request received for ${req.url}`);
    next();     // passes control to the next function
}

app.get('/fetch-users2', logger, async (req, res) => {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        res.json(response.data);
    } catch (err) {
        res.status(500).send('Error fetching data');
    }
})

app.listen(port, () => {
    console.log(`Express server listening at http://localhost:${port}`);
});

```

## Output 
```zsh
rodcasio@Rodrigos-MacBook-Air users-api-1 % node get-index1.js 

Express server listening at http://localhost:3000    
Data fetched successfully ✅                        // when using route /fetch-users
Request received for /fetch-users2                  // when using route /fetch-users2

```

@rodrigcasio