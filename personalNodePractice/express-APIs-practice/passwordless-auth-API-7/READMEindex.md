# Passwordless Based Authentication `Practice Example`

In this practice, we are simulating a similar process of a `Passwordless authentication` managed by a `Express` API developed specify routes:
- /request-access `POST REQUEST`
- /verify-code `POST REQUEST`
- /dashboard `Protected Resource`


## 🏛️ Code Structure

### `index.js` Main server app

1. Importing all the necessary dependecies
```js
const express = require('express');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'my_passwordless_secret_key_123';
```

2. In memory-storage (for temporary verfication codes)
    - In this code, it stores `{ emial: { code: '123456', expires: Date, userId: 101, userRole: 'admin' } }`
```js
const codeStore = {};
```

3. Creating Helper functions `generateSecureCode` and `sendEmail`.
    - 3.1 Generates a securely random 6 digits verification code
    ```js
    const generateSecureCode = () => {
        return crypto.randomBytes(3).readUIntBE(0, 3).toString().padStart(6, '0').slice(-6);
    }
    ```
    -  3.2 Simulates sending an email with the verification code
    ```js
    const sendEmail = (email, code) => {
        console.log(`==============================\n`);
        console.log(`   Simulated Email Sent! 📧`);
        console.log(`   to: ${email}`);
        console.log(`   Verification Code: ${code} (Expires in 5 Minutes)`);
        console.log(`================================`);
    }
    ```

4. 1st Endpoint `/request-access` and send the code 
    - 4.1 Getting the email from the request body:
    ```js
    app.post('/request-access', (req, res) => {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({ message: 'Email address is required' });
        }

    //...
    ```

    - 4.2 Lookup user in the permanent database `user-database.js` with the exported function `{ finfUserEmail }`
    ```js
    const user = findUserEmail(email);
    ```

    - 4.3 If the `user` is not found (Security step) respond vaguely, to prevent hackers from guessing valid emails (user enumeration)
    ```js
    if (!user) {
        sendEmail(email, 'fake_code');
        return res.status(200).json({
            message: `Verification code successfully sent to ${email}. Check your console`
        });
    }
    // ...
    ```
    - 4.3 Generating a secure, time-sensitive code and expiration timestamp:
    ```js
    const code = generateSecureCode();
    const expiresAt = Date.now() + (5 * 60 * 1000);     // 5 min of life
    ```

    - 4.4. Storing the temporary code along with the necessary user data in the in-memory store
    ```js
    codeStore[email] = {
        code,
        expires: expiresAt,
        userId: user.id,
        userRole: user.role,
    };
    // ...
    ```
    - 4.5 Send the real code via email using `sendEmail` simulation
    ```js
    sendEmail(email, code);
    // ...
    ```
    - 4.6 Finally, sending an acknowledgment that the request has been accepted  for processing.
```js
    res.status(200).json({
        message: `Verification code successfully sent to ${email}. Check your console`;
    });
    
});
```



