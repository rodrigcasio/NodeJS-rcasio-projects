## Async/Await function

In file `index.js` it shows the use of async/await function to handle asynchronous programming in JavaScript easier to read

## Functions used :
`myAsyncFunction()`

```js
const myAsyncFunction = async () => {
    return new Promise((resolve, reject) => {
        let success = true;
        setTimeout(() => {
            if (success){
                resolve('The operation was successful!');
            } else {
                reject(new Error('The operation failed!'));
            }
        }, 3000);
    });
}
```
- This is an async function that returns a **Promise** and uses `setTimeout` to stimulate delay.
- The **Promise** resolves after 3 seconds if `success` is true, or rejects if not.

---
`executeAsyncFunction()`

```js
const executeAsyncFunction = async () => {
    try {
        const result = await myAsyncFunction();
        console.log(result);
    } catch (err){
        console.error(err.message);     // handle and output any error
    }
}
```
- The `executeAsyncFunction` is an async function that uses `await` to wait for the result and handles errors with `try/catch`.
- The output will show the result after 3 seconds, demonstrating how `async/await` makes asynchronous code easier to read and manage.
---
`Calling the executeAsyncFunction();`
```js
executeAsyncFunction();
```
- Starts the process by callin gthe async function, which triggers everything above.

@rodrigcasio
