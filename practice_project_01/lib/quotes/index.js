const fs = require('fs');

const quotes = {};

quotes.allQuotes = function allQuotes() {
    const fileContents = fs.readFileSync(`${__dirname}/quotes.txt`, 'utf8');

    const arrOfQuotes = fileContents.split('\n');

    return arrOfQuotes;
};

module.exports = quotes;