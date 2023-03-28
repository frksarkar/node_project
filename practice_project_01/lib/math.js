const math = {};

math.getRandomNumber = function getRandomNumber(min, max) {
    const minimum = typeof min === 'number' ? min : 0;
    const maximum = typeof max === 'number' ? max : 0;
    return Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
};

module.exports = math;
