// This is my first example using promises in nodejs this is "User-defined promise" 

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

