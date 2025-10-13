// main server file

const express = require('express');
const path = require('path');
const app = express();
const expressViews = require('express-react-views');
const port = 3000;

const jsxEngine = expressViews.createEngine({});            

app.set('view engine', 'jsx');
app.set('views', path.join(__dirname, 'views'));
app.engine('jsx', jsxEngine);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/:name', (req, res) => {
    const userName = req.params.name;
    const currentTime = new Date().toLocaleDateString();
    console.log(`[Server Log] Rendering page for user: ${dynamicName}`);

    res.render('index', {
        name: userName,
        timestamp: currentTime
    });
});

app.listen(port, () => {
    console.log(`Express SSR Application is running ☑️ . Open in browser: http://localhost:${port}/User`);
});