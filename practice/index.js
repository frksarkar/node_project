const mathLibrary = require('./lib/math');
const quotesLibrary = require('./lib/quotes');

const app = {};

app.config = {
    timeBetweenQuotes: 2000,
};

app.printAQuotes = function printAQuotes() {
    const allQuotes = quotesLibrary.allQuotes();

    const quotesLength = allQuotes.length;

    const randomNumber = mathLibrary.getRandomNumber(1, quotesLength);

    const selectQuotes = allQuotes[randomNumber - 1];

    console.log(selectQuotes);
};

app.infiniteLoop = function infiniteLoop() {
    setInterval(app.printAQuotes, app.config.timeBetweenQuotes);
};

app.infiniteLoop();
