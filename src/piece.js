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
        var arr = [];
        for (let x = 0; x < 4; ++x) {
            var bestCell = {x: -1, y: -1};
            for (let i = 0; i < this.cells[this.orientation].length; ++i) {
                const cell = this.cells[this.orientation][i];
                if (cell.y > bestCell.y && cell.x === x) bestCell = cell;
            }
            if (bestCell.x === x) arr.push(bestCell);
        }
        return arr;
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
}
exports.I = I
exports.J = J
exports.L = L
exports.O = O
exports.S = S
exports.T = T
exports.Z = Z
exports.Piece = Piece