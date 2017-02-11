const add = (a, b) => a + b

const dimCheck = (v1, v2) => {
    if(v1.length !== v2.length) {
        throw "Can't zip arrays of different length"
    }
}

const zip = (v1, v2, f) => {
    dimCheck(v1, v2);
    const v3 = [];
    for(let i = 0; i < v1.length; i++) {
        v3.push(f(v1[i], v2[i]));
    }
    return v3;
}

module.exports = {
    add:    add,
    zip:    zip
}
