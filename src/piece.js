class Piece {
    constructor(type) {
        this.type = type;
        this.cells = [];
        this.orientation = 0;
    }

    rotate(isCCW) {
        this.orientation = (this.orientation + 1) % 4;
    }

    getBottomParts() {
        return [];
    }

    getCells() {
        return this.cells[this.orientation];
    }
}

class I extends Piece {
    constructor(type) {
        super("i");
        this.cells = [  [10,11,12,13],
                        [2,12,22,32],
                        [20,21,22,23],
                        [1,11,21,31]
                    ];
    }

    getBottomParts() {
        var arr = []
        if (this.cells[0]%10 != 0) arr = this.cells;
        else arr.push(this.cells[3]);
        return arr;
    }
}

class J extends Piece {
    constructor(type) {
        super("j");
        this.cells = [  [0,10,11,12],
                        [1,11,21,2],
                        [10,11,12,22],
                        [20,21,11,1]
                    ];
    }

    getBottomParts() {
       // TODO
    }
}

class L extends Piece {
    constructor(type) {
        super("l");
        this.cells = [  [10,11,12,2],
                        [1,11,21,22],
                        [20,10,11,12],
                        [0,1,11,21]
                    ];
    }

    getBottomParts() {
        // TODO
    }
}

class O extends Piece {
    constructor(type) {
        super("o");
        this.cells = [  [1,2,11,12],
                        [1,2,11,12],
                        [1,2,11,12],
                        [1,2,11,12]
                    ];
    }

    getBottomParts() {
        // TODO
    }
}

class S extends Piece {
    constructor(type) {
        super("s");
        this.cells = [  [10,11,1,2],
                        [1,11,12,22],
                        [20,21,11,12],
                        [0,10,11,21]
                    ];
    }

    getBottomParts() {
        // TODO
    }
}
class T extends Piece {
    constructor(type) {
        super("t");
        this.cells = [  [1,10,11,12],
                        [1,11,21,12],
                        [10,11,21,12],
                        [10,1,11,21]
                    ];
    }

    getBottomParts() {
        // TODO
    }
}
class Z extends Piece {
    constructor(type) {
        super("z");
        this.cells = [  [0,1,11,12],
                        [21,11,12,2],
                        [10,11,21,22],
                        [20,10,11,1]
                    ];
    }

    getBottomParts() {
        // TODO
    }
}
exports.I = I
exports.J = J
exports.L = L
exports.O = O
exports.S = S
exports.T = T
exports.Z = Z