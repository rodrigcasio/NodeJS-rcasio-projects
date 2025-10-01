// This is my first example using promises in nodejs this is "User-defined promise" 

let prompt = require('prompt-sync');
let fs = require('fs');

const methCall = new Promise((resolve, reject) => {
    setTimeout(() => {
        let filename = prompt()
    })
});
