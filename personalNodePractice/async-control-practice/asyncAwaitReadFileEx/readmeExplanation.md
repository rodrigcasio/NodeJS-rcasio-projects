## async/await function for reading a file example

`index.js` demonstrates how to handle a **Promise** with `async/await` function

---
### First function promise `promiseAsync()`
code 
```js
const promiseAsync = async () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let filename = './example.txt';
            fs.readFile(filename, 'utf-8', (err, data) => {             // using the readFile with a callback to handle errors
                if (err){
                    reject(new Error('Operation Failed'));
                } else {
                    resolve(data);
                }
            });
        }, 3000);
    });
}
```
1. Here we first declare the async function `promiseAsync` to declare a **Promise**

2. Inside the **Promise**, I placed the `setTimeout()` function to resolve the **Promise** after 3 seconds.

3. Afterwards, we declare the variable `filename` to identify the text file we want to read, which is `example.txt` *(file must be within the same folder as the script)*

4. Then, we call the `fs` to use the method `readFile`, which handles as arguments `filename`, `utf-8`, and the callback function `(err, data)` that handles the errors and result, in this case `data`.

5. Within the callback function. We placed a condition statement for `err` to handle errors and reject the **Promise**, if no errors are detected, We resolve the **Promise** by returning the content of the `example.txt` file.

### Outer/Controller/Runner Function `exeAsyncFunction()`
Code:
```js
const exePromiseAsync = async () => {
    try {
        result = await promiseAsync();
        console.log(result);
    } catch (err){
        console.error(err.message);
    }
}
```
1. Declare the function `exePromiseAsync()` which will run the whole promise.

2. Using the `try/catch` for error handling.

3. Awaits the result of `promiseAsync()` with `await`.

4. If **Promise** was resolved, it prints out the data content of `example.txt`.

5. If there is an error, prints the error message.

## Calling the outer function `exePromiseAsync()`

```js
exePromiseAsync();
```
- Starts the process by calling the outer async function that uses await.

@rodrigcasio