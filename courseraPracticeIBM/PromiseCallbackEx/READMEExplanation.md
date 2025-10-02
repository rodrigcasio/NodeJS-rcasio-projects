## First Promise Exercise from IBM Hands on Lab

| step | action |
| :--- | :--- |
|1. | Declaring a Promise with `const myPromise = new Promise((resolve, reject) => { ... })`
|2. | Inside the callback function we set a timer with a callback function `setTimeout(() => { ... }, 6000)`, when the timer times out after 6 seconds the promise will resolve with `resolve("Promise resolved")`.
|3. | The script first logs the **Promise object** as `<pending>` first with `Before calling promise` log.
|4. | Immediately after, the Script logs the `after calling promise`|
|5. | After 6 seconds, the promise resolves, and the callbacks from `myPromise.then((successMessage) = > { ... })` runs and also logs the entire **Promise** object with `console.log(myPromise)`.

## Order of execution 

| step | action |
| :--- | :--- |
|1.| When is written `new Promise(...)`, the Promise starts immediately and runs the code inside the its callback (the function you pass to `new Promise`).
|2.| The script runs all the synchronous code first ( like the `console.log('Before calling promise')`,  `console.log(myPromise)`, `console.log('after calling promise')`).
|3.| Inside the **Promise*, the timer `setTimeout` starts counting down (but does not block the rest of the script).
|4.| The script continues and finishes all the synchronous code.
|5.| After 6000 miliseconds, the timer's callback runs and calls `resolve('Promise Resolved')`.
|6.| This "Resolves" the **Promise**, so any `.then()` attached to the Promise will now run its callback.
|7.| The `.then()` callback prints the success message and the resolved **Promise Object**.

### Code 
```
// Created promise method. The promise will get resolved when the timer times out after 6s
const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('Promise Resolved');
    }, 6000);
});

console.log(`Before calling promise`);
console.log(myPromise);  // seeing it pending the object promise

// After promised resolves, the callback logs 'From Callback: Promise Resolved'
myPromise
    .then((successMessage) => {
        console.log(`From Callback: ${successMessage}`);
        console.log(myPromise);    // outputing the promise object with resolved 
    })
    .catch((err) => {
        console.log(myPromise);
        console.log(`Promise rejected`);
    });

console.log(`after calling promise`);
```

## Output 

```
Before calling promise
Promise { <pending> }
after calling promise
From Callback: Promise Resolved
Promise { 'Promise Resolved' }
```