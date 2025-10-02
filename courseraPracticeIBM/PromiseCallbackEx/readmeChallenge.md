## Exercise Challenge IBM in Hands on lab
file `promisePracticeEx.js`

### Challenge
Create a script which has two methods that return promises - One of the promises should get resolved after 6 seconds timeout and the other on after 3 seconds timeout. Call the promise in such a way that the second promise is invoked after the first promise resolved 

## output 
How to run: `node promisePracticeEx.js`
```
First Promise Resolved!             // this outputs after 6s
Second Promise Resolved!            // outputs after 3s
```

## Code
```
// IBM practice challenge:

const firstMethodPromise = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('First Promise Resolved!');
        }, 6000);
    });
}
const secondMethodPromise = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
           resolve('Second Promise Resolved!');
        });
    });
}

// calling the first promise 
firstMethodPromise()
    .then((resp) => {
        console.log(resp);
        secondMethodPromise()       // starting the second promise as soon as the first Promise is resolved 
            .then((resp) => {
                console.log(resp);
            })
            .catch((err) => {
                console.log('Error, second promise rejected!');
            });
    })
    .catch((err) => {
        console.log('Error, first promise rejected!');
    });
```

## First Approach code:
*I learned how **Nested Promises** work for this approach 😅*

(works but not what is asking me the exericise) 
(here we are nesting promises lol, )

- OUTPUT : `node promisePracticeEx.js:`
```
Promise { 'First Promise Resolved' }
Promise { 'Second Promise Resolved' }
rodcasio@Rodrigos-MacBook-Air PromiseCallbackEx % 
````

- Code: 
```
const firstPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('First Promise Resolved');
        const secondPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
               resolve('Second Promise Resolved');
            }, 3000);
        });
    
        secondPromise
           .then((resp) =>{
                console.log(secondPromise);
            })
            .catch((err) => {
                console.log('Error, second promise rejected');
            });
    }, 6000);
});

firstPromise
    .then((resp) => {
        console.log(firstPromise);  //outputting the whole first Promise objects
    })
    .catch((err) => {
        console.log('Error, first promise rejected');
    });
*/
```

@rodrigcasio