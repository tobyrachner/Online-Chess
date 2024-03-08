function allSquares() {
    let squares = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            squares.push(i.toString() + j.toString());
        }
    }
    return squares;
}

class Piece {
    constructor(color) {
        this.color = color;
    }
  }
  
class Rook extends Piece {
    constructor(color) {
        super(color);
        this.type = "rook";
    }

    availSquares() {
        return allSquares()
    }
}

class Bishop extends Piece {
    constructor(color) {
        super(color);
        this.type = "bishop";
    }

    availSquares() {
        let squares = [];
        for (let i = 0; i < 8; i++) {
            squares.push('0' + i.toString());
        } return squares;
    }
}

class Queen extends Piece {
    constructor(color) {
        super(color);
        this.type = "queen";
    }
}

class Knight extends Piece {
    constructor(color) {
        super(color);
        this.type = "night";
        // spelled Knight as night so the first character of piece.type is equal to notation symbol (n)
    }
}

class King extends Piece {
    constructor(color) {
        super(color);
        this.type = "king";
    }
}

class Pawn extends Piece {
    constructor(color) {
        super(color);
        this.type = "pawn";
    }
}