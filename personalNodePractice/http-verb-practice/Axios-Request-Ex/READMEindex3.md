## 📋 First **Axios** example `HTTP POST request` 📮

In file `post-index3.js`, it is created an **Axios** `HTTP POST request`.
*It is necessary to install Axios in the project with `npm install axios` and import the library into the script with `const axios = require('axios');`.

It is necessary to defined the `data` that we want to send in the request body. This `data` must be declared as a **JavaScript object**.

## Code explanation 
|**Code**| **What It Does**|
|:---|:---|
|`const axios = require('axios');`| This imports the library **Axios** to make the request.|
|`const data = { name: Rodrig, age: 26, userId: 1};`| This will be the data that we are planning to send in the **POST request**. `It must be a JavaScript object`.|
|`axios.post('https://jsonplaceholder.typicode.com/posts', data)`| This is where we create the POST request with Axios method `.post`, placing as needed arguments the **API endpoint** and the **data** object we want to post| 
|`.then((response) => {...})`|If the request is successful, the `.then()` block is executed|
|`console.log('Post created succesfully'); console.log('Status', response.status); console.log('Response from server:', response.data);`| These logs allow to obtain information regarding the **status** of out request, the **data** posted in the server and if it was successful the **POST request**.
|`.catch((err) => { ... })`| This code block executes If the request fails. (e.g., `network error` or `bad status code`).|
|`console.error('Error creating post', err)`| This is the main `err` message that we can obtain from the server with loggin into the console the `error`|
|`if (err.response){ ... }`| Axios can provide a detailed error object with the following error loggings|
|`console.error('Server responded with status:', err.response.status); console.error('Server responded data:', err.response.data);`| These are loggings that can be helpful to understand the reason of the request not going through|
|` else if (err.request)`| Here we place a `else...if` condition if the `request` was made but **no** response was received.|
|`console.log('No response received', err.request);`| Logging into the console the `error.request`. *Again*... the request was made but no response was **received**.|
|`else { ... }`| If there was an issue in setting up the request that triggered an `Error`|
|`console.error('Error', err.message)`| Logging into the console the `err.message`.|

## Code 
```js
const axios = require('axios');

const data = {
    name: 'Rodrig',
    age: 26,
    userId: 1,
};

axios.post('https://jsonplaceholder.typicode.com/posts', data)
    .then((response) => {
        console.log('Post created successfully ✅');
        console.log('Status:', response.status);
        console.log('Response from server:', response.data);
    })
    .catch((err) => {
        console.log('Error creating post', err);
        
        if(err.response){   // request was made and the server responded with a status code 
            console.error('Server responded with status', err.response.status);
            console.error('Server response data', err.response.data);
        }else if (err.request) {
            console.error('No response received:', err.request);    // request made but no response received
        } else {
            console.err('Error message: ', err.message);
        }
    });
```

## Output 

`node post-index3.js`

```zsh
Post created successfully ✅
Status: 201
Response from server: { name: 'Rodrig', age: 26, userId: 1, id: 101 }
```

## Output `example` if error **occurs**

- Example: written the **API endpoint** wrongly `(typo in URL)`

```zsh
Error creating post AxiosError: Request failed with status code 404
    at settle (/Users/rodcasio/Library/CloudStorage/OneDrive-Personal/clonedReposGit/NodeJS-rcasio-projects/personalNodePractice/http-verb-practice/node_modules/axios/dist/node/axios.cjs:2097:12)
    at BrotliDecompress.handleStreamEnd (/Users/rodcasio/Library/CloudStorage/OneDrive-Personal/clonedReposGit/NodeJS-rcasio-projects/personalNodePractice/http-verb-practice/node_modules/axios/dist/node/axios.cjs:3305:11)
    at BrotliDecompress.emit (node:events:536:35)
    at endReadableNT (node:internal/streams/readable:1698:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
    at Axios.request (/Users/rodcasio/Library/CloudStorage/OneDrive-Personal/clonedReposGit/NodeJS-rcasio-projects/personalNodePractice/http-verb-practice/node_modules/axios/dist/node/axios.cjs:4483:41)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'ERR_BAD_REQUEST',
  config: {
    transitional: {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false
    },
    adapter: [ 'xhr', 'http', 'fetch' ],
    transformRequest: [ [Function: transformRequest] ],
    transformResponse: [ [Function: transformResponse] ],
    timeout: 0,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    maxContentLength: -1,
    maxBodyLength: -1,
    env: { FormData: [Function [FormData]], Blob: [class Blob] },
    validateStatus: [Function: validateStatus],
    headers: Object [AxiosHeaders] {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'User-Agent': 'axios/1.12.2',
      'Content-Length': '37',
      'Accept-Encoding': 'gzip, compress, deflate, br'
    },
    method: 'post',
    url: 'https://jsonplaceholder.typicode.com/p',
    data: '{"name":"Rodrig","age":26,"userId":1}',
    allowAbsoluteUrls: true
  },
  request: <ref *1> ClientRequest {
    _events: [Object: null prototype] {
      abort: [Function (anonymous)],
      aborted: [Function (anonymous)],
      connect: [Function (anonymous)],
      error: [Function (anonymous)],
      socket: [Function (anonymous)],
      timeout: [Function (anonymous)],
      finish: [Function: requestOnFinish]
    },
    _eventsCount: 7,
    _maxListeners: undefined,
    outputData: [],
    outputSize: 0,
    writable: true,
    destroyed: true,
    _last: false,
    chunkedEncoding: false,
    shouldKeepAlive: true,
    maxRequestsOnConnectionReached: false,
    _defaultKeepAlive: true,
    useChunkedEncodingByDefault: true,
    sendDate: false,
    _removedConnection: false,
    _removedContLen: false,
    _removedTE: false,
    strictContentLength: false,
    _contentLength: '37',
    _hasBody: true,
    _trailer: '',
    finished: true,
    _headerSent: true,
    _closed: true,
    socket: TLSSocket {
      _tlsOptions: [Object],
      _secureEstablished: true,
      _securePending: false,
      _newSessionPending: false,
      _controlReleased: true,
      secureConnecting: false,
      _SNICallback: null,
      servername: 'jsonplaceholder.typicode.com',
      alpnProtocol: false,
      authorized: true,
      authorizationError: null,
      encrypted: true,
      _events: [Object: null prototype],
      _eventsCount: 9,
      connecting: false,
      _hadError: false,
      _parent: null,
      _host: 'jsonplaceholder.typicode.com',
      _closeAfterHandlingError: false,
      _readableState: [ReadableState],
      _writableState: [WritableState],
      allowHalfOpen: false,
      _maxListeners: undefined,
      _sockname: null,
      _pendingData: null,
      _pendingEncoding: '',
      server: undefined,
      _server: null,
      ssl: [TLSWrap],
      _requestCert: true,
      _rejectUnauthorized: true,
      timeout: 5000,
      parser: null,
      _httpMessage: null,
      autoSelectFamilyAttemptedAddresses: [Array],
      [Symbol(alpncallback)]: null,
      [Symbol(res)]: [TLSWrap],
      [Symbol(verified)]: true,
      [Symbol(pendingSession)]: null,
      [Symbol(async_id_symbol)]: -1,
      [Symbol(kHandle)]: [TLSWrap],
      [Symbol(lastWriteQueueSize)]: 0,
      [Symbol(timeout)]: Timeout {
        _idleTimeout: 5000,
        _idlePrev: [TimersList],
        _idleNext: [TimersList],
        _idleStart: 446,
        _onTimeout: [Function: bound ],
        _timerArgs: undefined,
        _repeat: null,
        _destroyed: false,
        [Symbol(refed)]: false,
        [Symbol(kHasPrimitive)]: false,
        [Symbol(asyncId)]: 25,
        [Symbol(triggerId)]: 23
      },
      [Symbol(kBuffer)]: null,
      [Symbol(kBufferCb)]: null,
      [Symbol(kBufferGen)]: null,
      [Symbol(shapeMode)]: true,
      [Symbol(kCapture)]: false,
      [Symbol(kSetNoDelay)]: false,
      [Symbol(kSetKeepAlive)]: true,
      [Symbol(kSetKeepAliveInitialDelay)]: 1,
      [Symbol(kBytesRead)]: 0,
      [Symbol(kBytesWritten)]: 0,
      [Symbol(connect-options)]: [Object]
    },
    _header: 'POST /p HTTP/1.1\r\n' +
      'Accept: application/json, text/plain, */*\r\n' +
      'Content-Type: application/json\r\n' +
      'User-Agent: axios/1.12.2\r\n' +
      'Content-Length: 37\r\n' +
      'Accept-Encoding: gzip, compress, deflate, br\r\n' +
      'Host: jsonplaceholder.typicode.com\r\n' +
      'Connection: keep-alive\r\n' +
      '\r\n',
    _keepAliveTimeout: 0,
    _onPendingData: [Function: nop],
    agent: Agent {
      _events: [Object: null prototype],
      _eventsCount: 2,
      _maxListeners: undefined,
      defaultPort: 443,
      protocol: 'https:',
      options: [Object: null prototype],
      requests: [Object: null prototype] {},
      sockets: [Object: null prototype] {},
      freeSockets: [Object: null prototype],
      keepAliveMsecs: 1000,
      keepAlive: true,
      maxSockets: Infinity,
      maxFreeSockets: 256,
      scheduling: 'lifo',
      maxTotalSockets: Infinity,
      totalSocketCount: 1,
      maxCachedSessions: 100,
      _sessionCache: [Object],
      [Symbol(shapeMode)]: false,
      [Symbol(kCapture)]: false
    },
    socketPath: undefined,
    method: 'POST',
    maxHeaderSize: undefined,
    insecureHTTPParser: undefined,
    joinDuplicateHeaders: undefined,
    path: '/p',
    _ended: true,
    res: IncomingMessage {
      _events: [Object],
      _readableState: [ReadableState],
      _maxListeners: undefined,
      socket: null,
      httpVersionMajor: 1,
      httpVersionMinor: 1,
      httpVersion: '1.1',
      complete: true,
      rawHeaders: [Array],
      rawTrailers: [],
      joinDuplicateHeaders: undefined,
      aborted: false,
      upgrade: false,
      url: '',
      method: null,
      statusCode: 404,
      statusMessage: 'Not Found',
      client: [TLSSocket],
      _consuming: true,
      _dumped: false,
      req: [Circular *1],
      _eventsCount: 4,
      responseUrl: 'https://jsonplaceholder.typicode.com/p',
      redirects: [],
      [Symbol(shapeMode)]: true,
      [Symbol(kCapture)]: false,
      [Symbol(kHeaders)]: [Object],
      [Symbol(kHeadersCount)]: 48,
      [Symbol(kTrailers)]: null,
      [Symbol(kTrailersCount)]: 0
    },
    aborted: false,
    timeoutCb: null,
    upgradeOrConnect: false,
    parser: null,
    maxHeadersCount: null,
    reusedSocket: false,
    host: 'jsonplaceholder.typicode.com',
    protocol: 'https:',
    _redirectable: Writable {
      _events: [Object],
      _writableState: [WritableState],
      _maxListeners: undefined,
      _options: [Object],
      _ended: true,
      _ending: true,
      _redirectCount: 0,
      _redirects: [],
      _requestBodyLength: 37,
      _requestBodyBuffers: [],
      _eventsCount: 3,
      _onNativeResponse: [Function (anonymous)],
      _currentRequest: [Circular *1],
      _currentUrl: 'https://jsonplaceholder.typicode.com/p',
      [Symbol(shapeMode)]: true,
      [Symbol(kCapture)]: false
    },
    [Symbol(shapeMode)]: false,
    [Symbol(kCapture)]: false,
    [Symbol(kBytesWritten)]: 0,
    [Symbol(kNeedDrain)]: false,
    [Symbol(corked)]: 0,
    [Symbol(kOutHeaders)]: [Object: null prototype] {
      accept: [Array],
      'content-type': [Array],
      'user-agent': [Array],
      'content-length': [Array],
      'accept-encoding': [Array],
      host: [Array]
    },
    [Symbol(errored)]: null,
    [Symbol(kHighWaterMark)]: 16384,
    [Symbol(kRejectNonStandardBodyWrites)]: false,
    [Symbol(kUniqueHeaders)]: null
  },
  response: {
    status: 404,
    statusText: 'Not Found',
    headers: Object [AxiosHeaders] {
      date: 'Sat, 04 Oct 2025 07:08:53 GMT',
      'content-type': 'application/json; charset=utf-8',
      'transfer-encoding': 'chunked',
      connection: 'keep-alive',
      'access-control-allow-credentials': 'true',
      'cache-control': 'no-cache',
      etag: 'W/"2-vyGp6PvFo4RvsFtPoIWeCReyIC8"',
      expires: '-1',
      nel: '{"report_to":"heroku-nel","response_headers":["Via"],"max_age":3600,"success_fraction":0.01,"failure_fraction":0.1}',
      pragma: 'no-cache',
      'report-to': '{"group":"heroku-nel","endpoints":[{"url":"https://nel.heroku.com/reports?s=1kxVUXWur968p3QQNzj5iMvitvCUf7NguOgudP8yI5E%3D\\u0026sid=e11707d5-02a7-43ef-b45e-2cf4d2036f7d\\u0026ts=1759561733"}],"max_age":3600}',
      'reporting-endpoints': 'heroku-nel="https://nel.heroku.com/reports?s=1kxVUXWur968p3QQNzj5iMvitvCUf7NguOgudP8yI5E%3D&sid=e11707d5-02a7-43ef-b45e-2cf4d2036f7d&ts=1759561733"',
      server: 'cloudflare',
      vary: 'Origin, X-HTTP-Method-Override, Accept-Encoding',
      via: '2.0 heroku-router',
      'x-content-type-options': 'nosniff',
      'x-powered-by': 'Express',
      'x-ratelimit-limit': '1000',
      'x-ratelimit-remaining': '999',
      'x-ratelimit-reset': '1759561752',
      'cf-cache-status': 'DYNAMIC',
      'cf-ray': '9892d9c3dcc6e5fa-DFW',
      'alt-svc': 'h3=":443"; ma=86400'
    },
    config: {
      transitional: [Object],
      adapter: [Array],
      transformRequest: [Array],
      transformResponse: [Array],
      timeout: 0,
      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',
      maxContentLength: -1,
      maxBodyLength: -1,
      env: [Object],
      validateStatus: [Function: validateStatus],
      headers: [Object [AxiosHeaders]],
      method: 'post',
      url: 'https://jsonplaceholder.typicode.com/p',
      data: '{"name":"Rodrig","age":26,"userId":1}',
      allowAbsoluteUrls: true
    },
    request: <ref *1> ClientRequest {
      _events: [Object: null prototype],
      _eventsCount: 7,
      _maxListeners: undefined,
      outputData: [],
      outputSize: 0,
      writable: true,
      destroyed: true,
      _last: false,
      chunkedEncoding: false,
      shouldKeepAlive: true,
      maxRequestsOnConnectionReached: false,
      _defaultKeepAlive: true,
      useChunkedEncodingByDefault: true,
      sendDate: false,
      _removedConnection: false,
      _removedContLen: false,
      _removedTE: false,
      strictContentLength: false,
      _contentLength: '37',
      _hasBody: true,
      _trailer: '',
      finished: true,
      _headerSent: true,
      _closed: true,
      socket: [TLSSocket],
      _header: 'POST /p HTTP/1.1\r\n' +
        'Accept: application/json, text/plain, */*\r\n' +
        'Content-Type: application/json\r\n' +
        'User-Agent: axios/1.12.2\r\n' +
        'Content-Length: 37\r\n' +
        'Accept-Encoding: gzip, compress, deflate, br\r\n' +
        'Host: jsonplaceholder.typicode.com\r\n' +
        'Connection: keep-alive\r\n' +
        '\r\n',
      _keepAliveTimeout: 0,
      _onPendingData: [Function: nop],
      agent: [Agent],
      socketPath: undefined,
      method: 'POST',
      maxHeaderSize: undefined,
      insecureHTTPParser: undefined,
      joinDuplicateHeaders: undefined,
      path: '/p',
      _ended: true,
      res: [IncomingMessage],
      aborted: false,
      timeoutCb: null,
      upgradeOrConnect: false,
      parser: null,
      maxHeadersCount: null,
      reusedSocket: false,
      host: 'jsonplaceholder.typicode.com',
      protocol: 'https:',
      _redirectable: [Writable],
      [Symbol(shapeMode)]: false,
      [Symbol(kCapture)]: false,
      [Symbol(kBytesWritten)]: 0,
      [Symbol(kNeedDrain)]: false,
      [Symbol(corked)]: 0,
      [Symbol(kOutHeaders)]: [Object: null prototype],
      [Symbol(errored)]: null,
      [Symbol(kHighWaterMark)]: 16384,
      [Symbol(kRejectNonStandardBodyWrites)]: false,
      [Symbol(kUniqueHeaders)]: null
    },
    data: {}
  },
  status: 404
}
Server responded with status 404
Server response data {}
```