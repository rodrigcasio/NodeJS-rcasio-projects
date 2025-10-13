// The template
const React = require('react');

const HelloMessage = (props) => {
    const { name, timestamp } = props;       // destructured the passed data

    return( 
        <html>
            <head>
                <title>Example practice of Server-Rendered Page</title>
                <script src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
                <script src="https://unpkg/react-dom@17/umd/react-dom.production.min.js"></script>
                <link rel="stylesheet" href="/styles.css"/>
            </head>
            <body>
                <div className="container">
                    <h1>Server-Side Render Content</h1>
                    <p>This message was rendered by the Express server using the data passed from the route:</p>
                    <p>Hello, <span>{name}</span>!</p>
                    <div>
                        Rendered Time: {timestamp}
                    </div>
                </div>
            </body>
        </html>
    );
}

module.exports = HelloMessage;