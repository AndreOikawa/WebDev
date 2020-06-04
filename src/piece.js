class Piece {
    constructor(type) {
        this.type = type;
        this.cells = [];
        this.orientation = 0;
    }

    rotate(isCCW) {
        this.orientation = (this.orientation + (isCCW ? 1 : -1) + 4) % 4;
    }

    getBottomParts() {
        return [];
    }

    getLeftParts() {
        return [];
    }

    getRightParts() {
        return [];
    }

    getCells() {
        return this.cells[this.orientation];
    }
}

class I extends Piece {
    constructor(type) {
        super("i");
        this.cells = [  [{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:3,y:1}],
                        [{x:2,y:0},{x:2,y:1},{x:2,y:2},{x:2,y:3}],
                        [{x:0,y:2},{x:1,y:2},{x:2,y:2},{x:3,y:2}],
                        [{x:1,y:0},{x:1,y:1},{x:1,y:2},{x:1,y:3}],
                    ];
    }

    getBottomParts() {
        var arr = []
        if (this.cells[this.orientation][0].x == 0) arr = this.cells[this.orientation];
        else arr.push({x: this.cells[this.orientation][3].x, y: 3});
        return arr;
    }

    getLeftParts() {
        var arr = []
        if (this.cells[this.orientation][0].x == 0) arr.push(this.cells[this.orientation][0]);
        else arr = this.cells[this.orientation];
        return arr;
    }

    getRightParts() {
        var arr = []
        if (this.cells[this.orientation][0].x == 0) arr.push(this.cells[this.orientation][3]);
        else arr = this.cells[this.orientation];
        return arr;
    }
}

class J extends Piece {
    constructor(type) {
        super("j");
        this.cells = [  [{x:0,y:0},{x:0,y:1},{x:1,y:1},{x:2,y:1}],
                        [{x:1,y:0},{x:2,y:0},{x:1,y:1},{x:1,y:2}],
                        [{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:2,y:2}],
                        [{x:0,y:2},{x:1,y:2},{x:1,y:1},{x:1,y:0}],
                    ];
    }

    getBottomParts() {
       // TODO
    }
}

class L extends Piece {
    constructor(type) {
        super("l");
        this.cells = [  [{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:2,y:0}],
                        [{x:1,y:0},{x:1,y:1},{x:1,y:2},{x:2,y:2}],
                        [{x:0,y:2},{x:0,y:1},{x:1,y:1},{x:2,y:1}],
                        [{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:1,y:2}],
                    ];
    }

    getBottomParts() {
        // TODO
    }
}

class O extends Piece {
    constructor(type) {
        super("o");
        this.cells = [  [{x:1,y:0},{x:1,y:1},{x:2,y:0},{x:2,y:1}],
                        [{x:1,y:0},{x:1,y:1},{x:2,y:0},{x:2,y:1}],
                        [{x:1,y:0},{x:1,y:1},{x:2,y:0},{x:2,y:1}],
                        [{x:1,y:0},{x:1,y:1},{x:2,y:0},{x:2,y:1}],
                    ];
    }

    getBottomParts() {
        // TODO
    }
}

class S extends Piece {
    constructor(type) {
        super("s");
        this.cells = [  [{x:0,y:1},{x:1,y:1},{x:1,y:0},{x:2,y:0}],
                        [{x:1,y:0},{x:1,y:1},{x:2,y:1},{x:2,y:2}],
                        [{x:0,y:2},{x:1,y:2},{x:1,y:1},{x:2,y:1}],
                        [{x:0,y:0},{x:0,y:1},{x:1,y:1},{x:1,y:2}],
                    ];
    }

    getBottomParts() {
        // TODO
    }
}
class T extends Piece {
    constructor(type) {
        super("t");
        this.cells = [  [{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:1,y:0}],
                        [{x:1,y:0},{x:1,y:2},{x:1,y:1},{x:2,y:1}],
                        [{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:1,y:2}],
                        [{x:1,y:0},{x:1,y:1},{x:1,y:2},{x:0,y:1}],
                    ];
    }

    getBottomParts() {
        // TODO
    }
}
class Z extends Piece {
    constructor(type) {
        super("z");
        this.cells = [  [{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:2,y:1}],
                        [{x:1,y:2},{x:1,y:1},{x:2,y:1},{x:2,y:0}],
                        [{x:0,y:1},{x:1,y:1},{x:1,y:2},{x:2,y:2}],
                        [{x:0,y:2},{x:0,y:1},{x:1,y:1},{x:1,y:0}],
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