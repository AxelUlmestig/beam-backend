dimCheck = (v1, v2) => {
    if(v1.length != v2.length) {
        throw "The vectors have different dimensions. Retard...";
    }
}

add = (v1, v2) => {
    dimCheck(v1, v2);
    const v3 = [];
    for(let i = 0; i < v1.length; i++) {
        v3.push(v1[i] + v2[i]);
    }
    return v3;
}

multiply = (v, factor) => {
    const multiplied = v.map(x => x * factor);
    return multiplied;
}

subtract = (v1, v2) => {
    const reversed = multiply(v2, -1);
    const diff = add(v1, reversed);
    return diff;
}

abs = v => {
    const squared = v.reduce(function(mem, cur){
        return mem + Math.pow(cur, 2);
    }, 0);
    return Math.sqrt(squared);
}

distance = (v1, v2) => {
    return abs(subtract(v1, v2));
}

module.exports = {
    add: add,
    multiply: multiply,
    subtract: subtract,
    abs: abs,
    distance: distance
}
