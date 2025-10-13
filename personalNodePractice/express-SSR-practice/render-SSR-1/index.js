// main server file

const express = require('express');
const app = express();
const expressViews = require('express-react-views');
const port = 3000;

const jsxEngine = expressViews.createEngine({});            

app.set('view engine', 'jsx');
app.set('views', '/views');
app.engine('jsx', jsxEngine);

app.get('/:name', (req, res) => {
    const dynamicName = req.params.name;

    console.log(`[Server Log] Rendering page for user: ${dynamicName} `);

    res.render('index', {
        name: dynamicName,
        timestamp: new Date().toLocaleDateString()
    });
});

app.listen(port, () => {
    console.log(`Express SSR Application is running ☑️ . Open in browser: http://localhost:${port}/User`);
});