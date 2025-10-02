// This is an example of a Promise
// using a timer, after 3 seconds the promise resolves!
// and it executes the .then((message) => { ... }) callback function.

const myPromise = new Promise((resolve, reject) => {  
    setTimeout(() => {
        let success = true;
        if (success){
            resolve('The operation was successful!');
        }else {
            reject('The operation failed!');
        }
    }, 3000);
});

// Execute the promise and handle the fulfilled and rejected states
myPromise
    .then((message) => {
        console.log(message);
        console.log(myPromise);       // logging the whole Promise object
    })
    .catch((err) => {
        console.error(err);
        consolelog(myPromise);
    });

