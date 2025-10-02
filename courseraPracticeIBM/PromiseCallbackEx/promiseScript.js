// Example of creating a simple promise method

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