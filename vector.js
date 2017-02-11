const util = require('./util.js');

const add = (v1, v2) => util.zip(v1, v2, util.add)

const multiply = (v, factor) => v.map(x => x * factor)

const subtract = (v1, v2) => add(v1, multiply(v2, -1))

const abs = v =>
    Math.sqrt(
        v
        .map(x => Math.pow(x, 2))
        .reduce(util.add, 0)
    )

const distance = (v1, v2) => abs(subtract(v1, v2))

module.exports = {
    add:        add,
    multiply:   multiply,
    subtract:   subtract,
    abs:        abs,
    distance:   distance
}
