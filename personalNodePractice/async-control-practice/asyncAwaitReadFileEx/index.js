// example of using async/await for handling Promise

const fs = require('fs');

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

const exePromiseAsync = async () => {
    try {
        result = await promiseAsync();
        console.log(result);
    } catch (err){
        console.error(err.message);
    }
}

// calling the async function
exePromiseAsync();

