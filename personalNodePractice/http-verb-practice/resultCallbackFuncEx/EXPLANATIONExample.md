# Mastering Asynchronous Callbacks and Modularity
- This example demonstrates the core **Node.js asynchronous callback pattern** by separating the responsabilities of making HTTP request
(I/O operation) from processing the result in the main application. This shows *modularity* and robust *multi-level error handling*

## 📂 File strucure
- This example uses two-file modular structure

- **index.js** : Main application (defines what to do with the result or error)
- **get-weather2.js**: Custom Module (Defines *how* to fetch the data and when to call the main application's callback)

## 🧠 Key concept: the nested callback flow
This pattern involves two layers of asynchronous callbacks to pass the final result from the network back to the main application (index.js)

1. The Module Internal Callback (`http.request`)
    - **Job**: This is the first callback defined in `get-weather2.js`. It handles asynchronous response stream from the external server
    - **Trigger**: It runs only *after* the network request is fully sent and the server begins responding

2. The Application's Callback (`resultCallback`)
    - **Job**: This is the function the main application (`index.js`) passes into the module. It contains the final `console.log()` logic.
    -- **Trigger**: It is called by the module (`get-weather2.js`) only *after* the raw data has been fully collected, parsed and checked for errors.

## 🔴 Multi-Level Error Handling

| Error Type | Originating Code (File: get-weather2.js) | Handler Code Location |
| :--- | :--- | :--- |
| **1. Network/Setup Errors** (e.g., ENOTFOUND) | Occurs during `http.request()` setup. | Handled by `req.on('error', ...)` |
| **2. Application/Parsing Errors** (e.g., corrupted data) | Occurs inside the `res.on('end', ...)` callback (e.g., inside `parseString`). | Handled by `if(err)` inside the `parseString` callback. |

- In both failures cases, the module ensures the error is passed out via `resultCallback(err)` so the main application never crashes.

## 📝 Code Breakdown 

### A. The Module (`get-weather2.js`)
| Key Line | Purpose |
| :--- | :---|
| `exports.current = (location, resultCallback) => { ... }` | Defines the module's public function, accepting the **Application Callback** as the final argument. |
| `const req = http.request(...)` | Initializes the request and saves the Request Object (`req`) to attach the high-level error listener. |
| `req.on('error', (err) => { resultCallback(err); });` | **Catches network/DNS errors** and returns them immediately to the main application (`index.js`). | 
| `parseString(buffer, (err, result) => { ... });` | **Mocks data parsing**. This is where application logic errors are checked before final success. |
|`resultCallback(null, result..)` | The final point of execution for success path passing the data back to the customer (`index.js`). |

### B. The Application (`index.js`)

| Key Line | Purpose |
| :--- | :--- |
| `weather.current(location, (err, temp_f) => { ... })` | **Calls the module** and defines the anonymous function that will run asynchronously upon completion. |
| `if(err) { ... }` | The standard pattern: Check the **error parameter first**. If present, log the failure (using custom data like `err.code` and `err.hostname`) and stop execution. |
| `console.log(...)` | The success path: if `err` is null, the result is available to be processed. |

## 🌎 Use case: why this pattern matters

| Action required | Module's Responsability (`get-weather2.js` role) | Aplication's Responsability (`index.js` role) |
| :--- | :--- | :--- |
| **Fetch Data** | 1. **Makes HTTP request** to Twitter/X API to get user feed. | N/A |
| **Process Data** | 2. **Parses the JSON** response, checks for valid structure, and removes sensitive fields. | N/A |
| **Failures** | 3. **If network fails**: Returns `err` object. **If JSON is invalid**: Returns `err` object. | N/A |
| **Show Result** | 4. Passes final clean data via the `resultCallback(null, result...)`. | 5. Receives the `result` and renders it on the user's webpage |

- by separating the logic, your main application (`index.js`) doesn't care if the network failed of the the data was bad; it only has to deal with two clear results: **either an `error` or a `result`**. This makes the application simplier cleaner, and less prone to crashing

## 📋 Order of execution in `get-weather2.js`

**Phase 1: Synchronous Setup (Immediate Execution)**

This phase runs instantly, without waiting for the network, until the `req.end()` is hit.

1. **Function Call**: The `exports.current(location, resultCallback)` function is called by the main application (`index.js`).
2. **Options Setup**: The `options` object (containing the `host` and `path`) is defined.
3. **Request Initialization**: The `const req = http.request(options, (res) => { ... })` call starts the request process. The function isnide ( `(res) => { ... } `) is **registered** as the response callback!**, but is **not run yet**.
4. **Error Listener Registered**: The `req.on('error', (err) => { ... })` listener is attached to the request object. This prepares the module to catch immediate network failure.
5. **Request Sent**: The `req.end()` method is called, which actually sends teh request out over the network to the server.

*(At this point, module function finishes, and control returns the main application, which immediately executes its synchronous code. The Node.js event loop now waits for the network response or an error)*

**Phase 2: Asynchronous Handling (Triggered by Events)**

One of two primary events will now trigger an asynchronous block of code.

**A. Failure Path (Network Error)** 
- **Trigger**: The system fails to resolve the hostname (`w1.weather.gov`) or connect
- **Action**: The `req.on('error', (err) => { ... })` listener is immediately triggered.
- **Result**: The module calls `resultCallback(err)`, passing the error back to `index.js`, and the module's work is complete.

**B. Success Path (Successful Network Connection)**
- **Trigger**: A success connection is established, and the server sends a response.
- **Action 1 (Data Stream)**: The `res.on('data', (chunk) => { ... })` callback runs repeatedly as data arrives from the server, continously building the `buffer` string.
- **Action 2 (Data End)**: The `res.on('end', () => { ... })` callback runs only once, when the entire response has been received.
- **Action 3 (Parsing/App Error Check)**: The `parseString(buffer, (err, result) => { ... })` function is called.
    - **If `err` exists (Parsing Failure)**: The module calls `resultCallback(resul)` to report the data error.
    - **If `err` is null (Parsing success)**: The module calls `resultCallback(null, result.current_observation.temp[0])`, sending the clean data back to `index.js`.


The entire process is race between in **Network Error Listener** and the **Response Listener**, with the **Application Callback** being the final fucntion executed in either case.
