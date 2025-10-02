## Example User-Defined-Promise

This code is a simpleexample of using a Promise in Node.js to read a file based on user input...

## what does it use ?
- it uses the `prompt-sync` module to ask the user for the name of a file in the terminal.

- It uses the `fs` (File System) module to read files from my computer.

- The main feature is the **Promise** called in `methCall`.
    - A Promise is a way to handle actions that take time of might fail, like reading a file.

- The **Promise** waits 3 seconds (with the use of the `setTimeout(() => { ... })`), then asks the user to type a file name. 
- Whatever the user input is.. it wille stored in the constant `filename`, which we will need to read the file with `fs`.
- It tries to read the file in `fs.readFileSync`:
    - If the file exists, the Promise is resolved and the file's contents are printed.
    - If the file does not exists or there is an error... the Promise is rejected and an error message is shown.

- the `.then()` method runs when the Promise is successfull, showing the file's contents
- the `catch()` method runs if there's an error, showing an error message.

## Code Order:
| step | action |
| :--- | :--- |
| 1. | Import the prompt-sync module and create a prompt |
| 2. | Import a built-in `fs` module for file system operations |
| 3. | Create a new Promise called `methCall` |
| 4. | Wait for 3 seconds before running the code inside `setTimeout` | 
| 5. | Ask the used for the name of the file to read and storing it into filename the input |
|6. | try to read the file synchronously using the filename provided |
|7. | if successful, resolve the promise using the file's contents |
|8. | if there is an error (e.g., file not found) reject the promise|
|9. | Print the promise object (will show as 'pending' at first) |
| 10. | When the Promise finishes : 
- If successful, print the file contents.
- if there is an error, 'Error reading file'|

#### Important:
*Creating the promise with `new Promise()` starts it automatically.*

*`console.log(methCall)` : this just prints the promise object it does not start or trigger anything*


## Order of Asynchronous Process
1. Code starts

2. The promise `methCall` is created and starts a 3-second timer `setTimeout`.

3. after 3 seconds, it aks for the filenname and tries to read the file since the user added the name of the file in the input

4. if successful, it calls `resolve(data)`, which triggers the `.then((data) => { ... })` callback.

5. The code code inside the `.then()` runs and prints the file content

## Output :
node index.js
```
Promise { <pending> }
What is the name of the file? textFile.txt
Promise { 'Hello ! I am line from the "textFile.txt" file !\n\n\n' }
Hello ! I am line from the "textFile.txt" file !
```

code

```js
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

console.log(methCall);   // output : Promise { <pending> }

methCall
    .then((data) =>{
        console.log(methCall);
        console.log(data);      
    })
    .catch((err) => {
        console.log(methCall);
        console.log('Error reading file');
    });
```
@rodrigcasio