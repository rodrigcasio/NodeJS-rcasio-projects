// first time using the async/await function

// This code shows how async/await function simplifies asynchronous programming in JavaScript 
// Async function that returns a Promise
const myAsyncFunction = async () => {
    return new Promise((resolve, reject) => {
        let success = true;
        setTimeout(() => {
            if (success){
                resolve('The operation was successful!');
            } else {
                reject(new Error('The operation failed!'));
            }
        }, 3000);
    });
}

const executeAsyncFunction = async () => {
    try {
        const result = await myAsyncFunction();
        console.log(result);
    } catch (err){
        console.error(err.message);     // handle and output any error
    }
}

// Calling the async function to execute
executeAsyncFunction();
