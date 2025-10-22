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
const { findUserEmail } = require('./user-database');

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

4. **1st Endpoint** `/request-access` and send the code 
    - 4.1 Getting the email from the request body:
    ```js
    app.post('/request-access', (req, res) => {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email address is required' });
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
        - (*email becomes becomes a **dynamic property key**, not an object. with this key property `email`, this one holds a literal object [no name needed]. eg : `codeStore = { 'rodrigo.test@dev.com': { code: '', expires: expiresAt, userId: user.id ... }}`)
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

5. **2nd Endpoint** `/verify-code`.
    - 5.1 Getting the **email** and **code** from the request body
    ```js
    app.post('/verify-code', (req, res) => {
        const { code, email } = req.body;
    
    if (!email || !code) {
        return res.status(400).json({ message: 'Email verification code are required.' });
    }
    // ... 
    ```
    - 5.2 Retrieve the stored code data. storedData is reference to the **value** of the property key `email` ( `storedData = { code, expires: expiresAt.. }`)
    ```js
    const storedData = codeStore[email];
    ```
    - 5.3 Check #1 if there is an exisiting code request.
    ```js
    if (!storedData) {
        return res.status(401).json({ message: 'Invalid code or access request.' });
    }
    ```
    - 5.4 Check #2. Is the code expired?
        - Clearing expired code with: `delete codeStore[email];`
    ```js
    if (Date.now() > storedData.expires) {
        delete codeStore[email];    
        return res.status(401).json({ message: 'Code expired. Please request a new access code.' });
    }
    ```
    - 5.5 Check #3 Does the code match?
    ```js
    if (storedData.code === code) {
    
    //.. 
    ```
    - 5.5.1 **Success** if the code is valid and not expired:
    **Cleanup**: Remove the used code immediately ( single-use requirement )
        ```js
        delete codeStore[email];
        ```
    - 5.5.2 **Granting access**: Preparing the user payload.
        ```js
        const payload = {
            id: storeData.userId,
            email: email,
            role: storedData.userRole
        };
        ```
    - 5.5.3 **Generate** a JWT (the final access key).
        ```js
        const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
        ```
    - 5.5.4 **Sending** the final JWT to the client.
        ```js
        return res.status(200).json({
            message: 'Verification successful. Access Token provided.',
            token: accessToken,
            user: payload
        });
        ```
    - 5.6 If code does not match: 
    ```js
    } else {
        res.status(401).json({ message: 'Invalid code or access request' });
    }
    ```

6. **3rd ENDPOINT** `/dashboard` (*the protected resource*).

    (*Comparing the previous token-based-authentication, here we are adding the functionality of the middlware `verifyToken` within the `/dashboard` endpoint*)

    - 6.1 **Getting** the `Authorization` header and extract the token.
    ```js
    app.get('/dashboard', (req, res) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
    
        if (!token) {
            return res.status(401).json({ message: 'Access Denied ❌. Token required.' });
        }
    //..
    ```
    - 6.2 **Verify** the JWT.
    ```js
    jwt.verify(token.trim(), SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or Expired Token ⌛️' });
        }
    // ...
    ```
    - 6.3 **Access Granted**, returned personalized data.
```js
        return res.status(200).json({
            message: `Welcome to the Protected Dashboard, ${decoded.email}. Your user ID is ${decoded.id}`,
            access_level: decoded.role,
            token_payload: decoded
        });
    });
});
```

7. Finally **Server Launch**
```js
app.listen(PORT, () => {
    console.log(`Passwordless Server running on http://localhost:${PORT}`);
    console.log(`Available Endpoints: POST /request-access, POST /verify-code, GET /dashboard (protected)`);
})
```

### `user-database.js`
*Simulated database to store user credentials*

1.  **Storing** email and unique ID for simulation:
```js
const users = [
    { id: 101, email: 'rodrigo.test@dev.com', name: 'Rodrigo', role: 'admin' },
    { id: 102, email: 'test@user.com', name: 'Test User', role: 'guest' }
];
```
2. **Creating** function to find a user by email address:
```js
const finfUserEmail = (email) => {
    return users.find(user => user.email === email);
}
```
3. **Exporting** the function.
```js
module.exports = { findUserEmail };
```

### `test-auth.http` Testing the fucntionality of the passwordless API express application

1. **Request Access** Client sends email to request a code.
```http
POST http://localhost:3000/request-access
Content-Type: application/json

{
    "email": "rodrigo.test@dev.com"
}
```
- 1.1  **Important**. After running the request `POST request-access`. *checking the terminal for the 6-digit code*. **The Server** will output the code needed for the next step **capturing the code and saving it in `@verificationCode`**

    ```http
    @verificationCode = "pasting_code_here_from_the_server_response"
    ```
2. **Verify Code** Client sends email and the code. Server verifies and issues a **JWT**.
```http
POST http://localhost:3000/verify-code
Content-Type: appplication/json

{
    "email": "rodrigo.test@dev.com",
    "code": "{{verificationCode}}"
}
```
- 2.1 **Capturing** the generated token ( the new "key" )
```http
@jwtToken = {{response.body.token}}
```

3. **Accessing** the protected `/dashboard` (Using the JWT)
- *Using the token obtained in `step 2` (jwtToken) if possible*
```http
GET http://localhost:3000/dashboard
Authorization: Bearer {{jwtToken}}
```

4. **Verification Failure** Invalid Code Test:
- Testing what happens when the code is wrong
```http
POST http://localost:3000/verify-code
Content-Type: application/json

{
    "email": "rodrigo.test@dev.com"
    "code": "000000"
}
``` 