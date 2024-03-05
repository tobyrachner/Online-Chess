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
}

class Bishop extends Piece {
    constructor(color) {
        super(color);
        this.type = "bishop";
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