const mathLibrary = require('./lib/math');
const quotesLibrary = require('./lib/quotes');

const app = {};

app.config = {
    timeBetweenQuotes: 1000,
};

app.printAQuotes = function printAQuotes() {
    const allQuotes = quotesLibrary.allQuotes();

    const quotesLength = allQuotes.length;

    const randomNumber = mathLibrary.getRandomNumber(1, quotesLength);

    const selectQuotes = allQuotes[randomNumber - 1];

    console.log(selectQuotes);
    return selectQuotes;
};

app.infiniteLoop = function infiniteLoop() {
    setInterval(app.printAQuotes, app.config.timeBetweenQuotes);
};
module.exports = app;
