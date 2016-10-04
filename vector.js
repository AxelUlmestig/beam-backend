function dimCheck(v1, v2) {
        if(v1.length != v2.length) {
                throw "The vectors have different dimensions. Retard...";
        }
}

function add(v1, v2) {
        dimCheck(v1, v2);
        var v3 = [];
        for(var i = 0; i < v1.length; i++) {
                v3.push(v1[i] + v2[i]);
        }
        return v3;
}

function multiply(v, factor) {
        var multiplied = v.map(x => x * factor);
        return multiplied;
}

function subtract(v1, v2) {
        var reversed = multiply(v2, -1);
        var diff = add(v1, reversed);
        return diff;
}

function abs(v) {
        var squared = v.reduce(function(mem, cur){
                return mem + Math.pow(cur, 2);
        }, 0);
        return Math.sqrt(squared);
}

function distance(v1, v2) {
        return abs(subtract(v1, v2));
}

module.exports = {
        add: add,
        multiply: multiply,
        subtract: subtract,
        abs: abs,
        distance: distance
}
