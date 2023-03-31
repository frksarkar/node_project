const fs = require('fs');

// eslint-disable-next-line consistent-return
fs.open('example.txt', 'r+', (err, fd) => {
    console.log(fd);
    if (err) {
        return console.error(err);
    }
});
