// This is my first example using promises in nodejs this is "User-defined promise" 

// 1. Code starts
// 2. The promise (methCall) is created and starts a 3-second timer (setTimeout)
// 3. after 3 seconds, it aks for the filenname and tries to read the file since the user 
//      added the name of the file in the input
// 4. if successful, it calls resolve(data), which triggers the .then((data) => { ... }) callback.
// 5. The code code inside the .then() runs and prints the file content


let prompt = require('prompt-sync')();      
let fs = require('fs');

const methCall = new Promise((resolve, reject) => {
    setTimeout(() => {
        let filename = prompt('What is the name of the file? ');
        try{
            const data = fs.readFileSync(filename, {encoding: 'utf8', flag: 'r'});
            resolve(data);
        } catch (err){
            reject(err);
        }
    }, 3000);
});

console.log(methCall);

methCall
    .then((data) =>{
        console.log(methCall);
        console.log(data);      
    })
    .catch((err) => {
        console.log(methCall);
        console.log('Error reading file');
    });


// Explanation 
// 1. Import the prompt-sync module and create a prompt
// 2. Import a built-in 'fs' module for file system operations
// 3. Create a new Promise called 'methCall'
// 4. Wait for 3 seconds before running the code inside setTimeout 
// 5. Ask the used for the name of the file to read and storing it into filename the input
// 6. try to read the file synchronously using the filename provided 
// 7. if successful, resolve the promise using the file's contents
// 8. if there is an error (e.g., file not found) reject the promise
// 9. Print the promise object (will show as 'pending' at first)
// 10. When the Promise finishes :
//     - If successful, print the file contents.
//     - if there is an error, 'Error reading file'