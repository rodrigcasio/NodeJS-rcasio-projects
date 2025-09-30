// Asynchronous file read (non-blocking I/O)
// Disk I/O : The request stays on your machine
// Asking the OS to find the file on the hard drive

const fs = require('fs');

const fileName = 'notes.txt';

console.log(`1. Program started. Asking the OS to find and read the file`);

fs.readFile(fileName, 'utf-8', (err, data) => {
                // This callback runs LATER, after the file is read
    if(err){
        console.error(`An error occurred:`, err.message);
        return;
    }
    console.log('3. Data recieved (callback executed).');
    console.log('--- File contents ---');
    console.log(data);
    console.log('---------------------');

});

// 2. This line runs IMMEDIATELY, confirming NON-blocking I/O
console.log('2. Program continues running other code while the file is being read');