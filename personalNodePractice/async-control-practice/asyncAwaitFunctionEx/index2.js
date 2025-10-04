// Another example using async/await function

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
