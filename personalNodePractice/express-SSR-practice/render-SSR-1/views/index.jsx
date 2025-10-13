// The template

const HelloMessage = (props) => {
    const {name, timestamp } = props;       // destructured the passed data

    return( 
        <html>
            <head>
                <title>Example practice of Server-Rendered Page</title>
            </head>
            <body>
                <div class="container">
                    <h1>Server-Side Render Content</h1>
                    <p>This message was rendered by the Express server using the data passed from the route:</p>
                    <p>Hello, {name}!</p>
                    <div>
                        Rendered Time: {timestamp}
                    </div>
                </div>
            </body>
        </html>
    );
}

module.exports = HelloMessage;