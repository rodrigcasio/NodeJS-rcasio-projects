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

- **A. The Module**(`get-weather2.js`)
    
-- `exports.current = (location, resultCallback) => { ... }`   : Defines the module's public function, accepting the **Application Callback** as the final argument.
-- `const req = http.request(...)` : Initializes the request and saves the Request Object (`req`) to attach the high-level error listener.
-- `req.on('error', (err) => { resultCallback(err); });` : **Catches network/DNS errors** and returns them immediately to the main application (`index.js`). 
-- `parseString(buffer, (err, result) => { ... });` : **Mocks data parsing**. This is where application logic errors are checked before final success.
-- `resultCallback(null, result..)` : The final point of execution for success path passing the data back to the customer (`index.js`).

- **B. The Application**(`index.js`)

-- `weather.current(location, (err, temp_f) => { ... })` : **Calls the module** and defines the anonymous function that will run asynchronously upon completion.
-- `if(err) { ... }` : The standard pattern: Check the **error parameter first**. If present, log the failure (using custom data like `err.code` and `err.hostname`) and stop execution. 
-- `console.log(...)` : The success path: if `err` is null, the result is available to be processed.