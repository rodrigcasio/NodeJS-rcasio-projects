// New example of reading a file with using only async/await function

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