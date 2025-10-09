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
|4 | Run the server with: `node get-index1.js`. The server will start and listen on port `3000`. A confirmation in the console will show `Express server listening at **http://localhost:3000`|

## API endpoints 🔺

This server provides three endpoints which are accessible via a `GET` request

| **Type** | **URL**| **Method**| **Description**|
| :--- | :--- | :--- | :--- |
|1. **Root Endpoint**| `http:://localhost:3000/`|`GET`| Returns a string welcome to confirm that the server is running |
|2. **Basic Fetch Endpoint**| `http://localhost:3000/fetch-users`| |`GET`| Fetches users from the external **API** with the endpoint `jsonplaceholder.typicode.com/users` and returns the data as a JSON **Resolved Promise** response. The server uses `res.json(response.data)` to send the data|
|3.**Middleware Example Endpoint (logger)**|`http://localhost:3000/fetch-users2`| `GET`| This route demonstrates the **middleware chain** pattern. 1. It executes the `logger` **middleware** (prints a log to the server console). 2. Then proceeds to fetch and return the user **data**|

## Tech used    

| Tech | Role in this project |
|:---|:---|
|**Node.js** | The runtime enviroment for executing the server code |
|**Express** | The minimal framework used to handle routing and server logic |
|**Axos**| A Promised-based  HTTP client used to **fetch external data** (making the outbound API call)|


## 