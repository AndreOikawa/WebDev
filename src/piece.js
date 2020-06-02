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

exports.I = I