## `Index2.js` **async/await** example
In this example, we are simulating an **asynchronous** operation **(like fetching data from a database or API)**

| **Function** | **What it does** |
| :--- | :--- |
| `fetchData(delay)`| This function simulates an asynchronous operation (like.. fetching data from a database or API). It returns a **Promise** after the timer runs out|
|`processData()`| 1. The `async` keyword declares that `processData()` as an asynchronous function, which enables te use of `await` keyword inside 2. This function executes first the **Synchronous** operation: `console.log('Starting data processing')`. 3. The `await` keyword pauses the execution of the `processData()` until the **Promise** returned by `fetchingData()` resolves. 4. `result1` will hold the resolved value of the `fetchData(4000)` call.. as well for the `result2` 5. The `try/catch` block is used for error handling. if any `await`ed **Promise** rejects, the `catch` block will execute.|

## Code 📝

```js
const fetchData = (delay) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(typeof delay === 'number' && delay > 0){
                resolve(`Data fetched after ${delay} miliseconds ✔`);
            } else{
                reject(new Error('Operation Failed, missing argument or wrong input user'));
            }
        }, delay)
    });
}

const processData = async () => {
    console.log(`1. Starting data processing...`);      //  (sync)
    try {
        const result1 = await fetchData(4000);      // (async)
        console.log(result1);  
        
        const result2 = await fetchData(3000);      // (async)
        console.log(result2);

        const result3 = await fetchData();      // this rejected Promise will trigger catch block
        console.log(result3);

        const result4 = await fetchData(2000);    // wont be processed 
        console.log(result4);

    } catch (err){
        console.error(`Data not processed ❌`, err.message);
    }
    console.log(`Data Process concluded ☑️`);
}

// calling the async function
processData();
console.log(`2. Please wait...`);       // (sync)

```

## Output 
```
node index2.js
1. Starting data processing...
2. Please wait...
Data fetched after 4000 miliseconds ✔
Data fetched after 3000 miliseconds ✔
Data not processed ❌ Operation Failed, missing argument or wrong input user
Data Process concluded ☑️
```

The `result3` is a **rejected** **Promise**, which triggers the `catch` code block to handle the error from the **Promise**, this avoids the `result4` to receive the resolved value of `fetchData(2000)`

@rodrigcasio