// importing the express module
const express = require("express");
const PORT = 3000;
// creating an instance of an Express application
const app = express();

// defining a route for the root URL 
app.get('/', (req, res) => {      
  res.send("hello everyone!, and world lol");
});


app.listen(PORT, () => {
  console.log(`Server running on port localhost:${PORT}`);
});


