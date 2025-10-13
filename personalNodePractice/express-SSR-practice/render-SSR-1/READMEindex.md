# Example of a Express `Server-Side-Rendering` Content

`/render-SSR-1/index.js` **Main Express Server / Controller **
`/views/index.jsx` **The Template**
`/public/styles.css` **CSS styles for template within a folder identified to be static content**

## 🏛️ Code Structure

### `index.js` Main application.
**This file is responsible for setting up the server , defining the web address and preparing the data

1. Getting the tools we need. Loading up:
    - `express`, main tool for building the server
    - `path`, helps find folders on our computer
    - `react`, The view engine needs React loaded in the server enviroment to turn JSX into HTML

```js
const express = require('express');
const path = require('path');
const react = require('react');

const app = express();
const port = 3000;
```

2. **Setting up the Public folder (*the one created for CSS applied in the `index.jsx`*)**
    - This line tells express "If the browser asks for a file ( like the styles.css ). *"Look inside the `public` directory and give it to them."*
```js
app.use(express.static(path.join(__dirname, 'public')));
```

3. **Setting up the `View engine`**
    - This tells the **Express** where to find the `Template` files.
    - Here we are using `path.join()` and `__dirname` to make sure the folder is found 100% of the time.
```js
app.use('views', path.join(__dirname, 'views'));
```
3.1 Here we set the file extension to look for (`.jsx`)
```js
app.set('view engine', 'jsx');
```
3.2 We tell express to use `express-react-views` engine to process these .jsx files.
```js
app.engine('jsx', require('express-react-engine').createEngine({
    pretty: true            // makes the final HTML look clean when it is view the source.
}));
```
4. **Defining the Web Address** `(The Route)`
    - 1. This creates an specific web address.. The `/:name` means it can be anything, like `/rod` `/sally` (this is known as URL parameter)
    - 2. We prepare all the data (`the props`) that we want to send to the template.
    - 3. Rendering the page. `res.render()` tells express: 
        - 3.1 Find the 'index' template (`views/index.jsx`).
        - 3.2 Use the `dataToPass` object to fill in all the placeholders
        - 3.3 Finally, send the final HTML back to the browser.
```js
app.get('/:name', (req, res) => {
    const userName = req.params.name;
    const currentTime = new Date().ToLocaleTimeString();
    
    console.log(`[Server Log] Rendering page for user ${userName}`);

    // preparing the props 
    const dataToPass = {
        name: userName,
        timestamp: currentTime
    }
    
    res.render('index', dataToPass);
});
```
6. Finally.. **Staring the Engine**
```js
app.listen(Port, () => {
    console.log(`Express SSR Application is running ☑️. Open in browser: http://localhost:${port}/User`);
});
```

### `/views/index.jsx` **The Template File**
*this file runs on the server (Node.js) to generate HTML.*

1. **Template Dependency**

- Here we explicitly load React. This is crucial for the server to understand.. *How to process the `JSX` code inside this file*
```js
const React = require('react');
```

2. **The Main Component** `the template`
- First this function receives the data passed from Express's `res.render()` as `props`.
- Secondly, here we are unpacking the data (`props`) sent from the server for easy use.
```js
const HelloMessage = (props) => {
    const { name, timestamp } = props;        // destructuring

```

3. **Template Structure** (JSX)
- 3.1 This defines the full HTML document that the server will send to the browser.
```js
    return(
        <html>
            <head>
                <title>Server-Rendered Page</title>
                {/* 3.2 Best practice adding CSS Linking*/}
                {/* This links to the external CSS file in the /public directory
                    keeping it clean and separated */}
                <link rel="stylesheet" href="/styles.css">

                {/* 3.3 Client-side React Libraries*/}
                {/* these scripts load REACT for the BROWSER. They are not too necessary for SSR display, but they can be if we are adding interactively later.. */}
                <script src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
                <script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
            </head>
            <body>
                <div className="container">
                    <h1>Server-Side Rendered Content</h1>
                    <p>This message was rendered by the Express server using the data passed from the server from the route:</p>
                    
                    {/*3.4 Dynamic Content Injection*/}
                    {/* The server inserts the 'name' and the 'currentTime' variable here before sending the page*/}
                    <p>Hello, <span className="name">{name}</span>!</p>

                    <div className="footer">
                        Rendered Time: {timestamp}
                    </div>
                </div>
            </body>
        </html>
    );

..
```
4. Finally.. **Template Export**
- Here we export the component so the `express-react-views` engine can find and use it..
```js
module.exports = HelloMessage;
```

@rodrigcasio