const http = require('http');
const app = require('../index');

http.createServer((req, res) => {
    if (req.url === '/') {
        res.write(`${app.printAQuotes()}`);
        res.end();
    }
}).listen(3000);
