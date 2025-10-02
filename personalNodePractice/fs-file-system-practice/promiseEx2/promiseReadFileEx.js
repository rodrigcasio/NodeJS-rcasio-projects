// Example of reading a file with promises

// Import the 'fs' module and use its promise-based methods 
const fs = require('fs').promises;

// Read the content of a file 'example.txt' with 'utf-8' encoding
fs.readFile('./example.txt', 'utf-8')
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.error('Error reading file:', err);          // printing the error message to the console 
    });

