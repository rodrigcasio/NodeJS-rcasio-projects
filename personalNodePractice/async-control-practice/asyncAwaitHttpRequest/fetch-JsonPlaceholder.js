// Using fetch with async/await function for HTTP request
// obtaining the same data like file "get-JsonPlaceholder.js"
// Modern Standard fetch promised-based

const runnerFunc = async () => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');      
        if(!response.ok){
            throw new Error(`HTTP error, status: ${response.status}`);
        }

        const users = await response.json();
        console.log(users[0]);
    } catch (err) {
        console.error('Error fetching data:', err.message);
    }
}
runnerFunc();