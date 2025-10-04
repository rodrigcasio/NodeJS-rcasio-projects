## Using Axios Package (first time example)
In this code, `index.js`, we are asking a server (`URL`) to return a response.
(*Installation needed to use axios package with `npm install axios`*)

- Using `axios.get(url)` sends an http get request to that server.
- if the server responds successfull, you get its data in `resp.data` inside the `.then((data) => { ... })` callback 
- if the server cannot be reached or the URL is invalid, the `.catch((err) => { ... })` callback runs.

In simple words
-   
We are requesting data from a server, and the code prints the server's response if succeeds.


## Sync and Async operations

*Added `console.log()` statements to visualize the order of synchronous and asynchronous operations*


- All the (sync) operations (the numbered logs and Promise creation) run first, in order.

- The asynchronous operations (inside `.then()` and `.catch()` only run after the HTTP request finish, so they appeaer later in the output)

*Synchronous code runs top-to-bottom, immediately.*

*Asynchronous code (like network requests) runs later, after the sync code is done*

## API used:
In the code, the API is `https://jsonplaceholder.typicode.com/posts/1`
- `jsonplaceholder.typicode.com` is a free fake online REST API server.
- Here we are using it to access example data, just like i would with a real server...

*Axios sends a request to this API, and I get a sample response (like a post object)*

### In simple words
- I'm using the JSONPlacehoder API to practice making HTTP request and getting data from a server


## output:

node index.js
```
1. Start the script (sync)
2. Calling axious.get for url (sync)
3. After axious.get for url (sync)
Promise { <pending> }
6. end of script (sync) 
4. Fulfilled! for : url (async)
{
  userId: 1,
  id: 1,
  title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
  body: 'quia et suscipit\n' +
    'suscipit recusandae consequuntur expedita et cum\n' +
    'reprehenderit molestiae ut ut quas totam\n' +
    'nostrum rerum est autem sunt rem eveniet architecto'
}
```
@rodrigcasio