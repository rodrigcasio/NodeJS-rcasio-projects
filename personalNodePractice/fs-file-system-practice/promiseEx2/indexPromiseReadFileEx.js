// Example of reading a file with Promise

const fs = require('fs');

const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        let filename = './example.txt';
        try {
            const data = fs.readFileSync(filename, 'utf-8', 'r');
            resolve(data);
        }catch (err){
            reject(err);
        }
    }, 3000);
});

myPromise
    .then((data) => {
        console.log(data);
        console.log(myPromise);
    })
    .catch((err) => {
        console.log('Error reading file:', err);
    });

// OUTPUT:
// node indexPromiseReadFileEx.js

// This is an example of a textfile!
//
// Promise { 'This is an example of a textfile!\n' }