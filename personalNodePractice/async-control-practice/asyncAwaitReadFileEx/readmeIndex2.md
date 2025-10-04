## Using async/await to read a file 

In `index2.js`, it demonstrates how to read a file with the use of async/await function.
This allows the `data` variable to recieve the resolved **Promise** and logging it into the console.

## Code execution 

1. The `readFileContent()` is an **async** function, the program does not wait for it to finish. The `console.log('2. Program continues execeution..) runs right away since it is a synchronouse function.

2.  The `await fs.readFile(...)` call **pauses** the `readFileContent()` function itself, but not the whole program. While the file is being read in the background... other run can continue to run, like `console.log('2. Program continues excution');`

3. Once the file read operation completes (and it's **Promise resolves**), the `await` expression is finished. The `data` varible holds the resolved **Promise** (contents of the file) and the last `console.log('data')` executes..

4. Lastly, I added after the `try/catch` statement.. another `console.log()` indicading that the execution was fully completed.


## Code 
```js
const fs = require('fs').promises;

const readFileContent = async () => {
    console.log(`1. Starting reading the file...`);
    try {
        const data = await fs.readFile('./example.txt', ({encoding : 'utf-8', flag: 'r'}));
        console.log(`📄 File content:\n`, data);
    } catch (error) {
        console.error(error);
    }
    console.log(`Reading file process done ☑️`);
}

readFileContent();
console.log(`2. Program continues execution...`);
```


## Output

```zsh
node index2.js
1. Starting reading the file...
2. Program continues execution...
📄 File content:
 This is a text file Hello!!! my name is Rodrigo Casio

Reading file process done ☑️
```