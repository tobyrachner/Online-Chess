const boardSize = 8;
const validRange = [...Array(boardSize).keys()]

const knightOffsets = [[-2, 1], [-1, 2], [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1]];
const kingOffsets = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

function allSquares() {
    let squares = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            squares.push(i.toString() + j.toString());
        }
    }
    return squares;
}

function squareArrayToString(square) {
    return square[0].toString() + square[1].toString();
}

class Piece {
    constructor(color, board, pos) {
        this.color = color;
        this.board = board;
        this.pos = pos;
        this.row = Number(pos[0]);
        this.col = Number(pos[1]);
    }

    changePosition(pos) {
        this.pos = pos;
        this.row = Number(pos[0]);
        this.col = Number(pos[1]);
    }
  }
  
class Rook extends Piece {
    constructor(color, board, pos) {
        super(color, board, pos);
        this.type = "rook";
    }

    availSquares(getSquaresAttacking=false, board=this.board) {
        let squares = [];
        let stop = [false, false, false, false];

        for (let i = 1; i < boardSize; i++) {
            let testSquares = [[this.row, this.col + i], [this.row + i, this.col], [this.row, this.col - i], [this.row - i, this.col]];
            for (let x = 0; x < testSquares.length; x++) {
                if (!stop[x]) {
                    if (validRange.includes(testSquares[x][0]) && validRange.includes(testSquares[x][1])) {
                        let onSquare = board[testSquares[x][0]][testSquares[x][1]];
                        if (onSquare === 0) {squares.push(squareArrayToString(testSquares[x])); continue}

                        stop[x] = true;
                        if (onSquare.color != this.color) {
                            squares.push(squareArrayToString(testSquares[x]));
                        } else if (getSquaresAttacking) {
                            squares.push(squareArrayToString(testSquares[x]));
                        }
                    }
                }
            }
        } return squares
    }
}

class Bishop extends Piece {
    constructor(color, board, pos) {
        super(color, board, pos);
        this.type = "bishop";
    }

    availSquares(getSquaresAttacking=false, board=this.board) {
        let squares = [];
        let stop = [false, false, false, false];

        for (let i = 1; i < boardSize; i++) {
            let testSquares = [[this.row - i, this.col + i], [this.row + i, this.col + i], [this.row + i, this.col - i], [this.row - i, this.col - i]];
            for (let x = 0; x < testSquares.length; x++) {
                if (!stop[x]) {
                    if (validRange.includes(testSquares[x][0]) && validRange.includes(testSquares[x][1])) {
                        let onSquare = board[testSquares[x][0]][testSquares[x][1]];
                        if (onSquare === 0) {squares.push(squareArrayToString(testSquares[x])); continue}

                        stop[x] = true;
                        if (onSquare.color != this.color) {
                            squares.push(squareArrayToString(testSquares[x]));
                        } else if (getSquaresAttacking) {
                            squares.push(squareArrayToString(testSquares[x]));
                        }
                    }
                }
            }
        } return squares
    }
}

class Queen extends Piece {
    constructor(color, board, pos) {
        super(color, board, pos);
        this.type = "queen";
    }

    availSquares(getSquaresAttacking=false, board=this.board) {
        let squares = [];
        let stop = [false, false, false, false];

        for (let i = 1; i < boardSize; i++) {
            let testSquares = [[this.row, this.col + i], [this.row + i, this.col], [this.row, this.col - i], [this.row - i, this.col], [this.row - i, this.col + i], [this.row + i, this.col + i], [this.row + i, this.col - i], [this.row - i, this.col - i]];
            for (let x = 0; x < testSquares.length; x++) {
                if (!stop[x]) {
                    if (validRange.includes(testSquares[x][0]) && validRange.includes(testSquares[x][1])) {
                        let onSquare = board[testSquares[x][0]][testSquares[x][1]];
                        if (onSquare === 0) {squares.push(squareArrayToString(testSquares[x])); continue}

                        stop[x] = true;
                        if (onSquare.color != this.color) {
                            squares.push(squareArrayToString(testSquares[x]));
                        } else if (getSquaresAttacking) {
                            squares.push(squareArrayToString(testSquares[x]));
                        }
                    }
                }
            }
        } return squares
    }
}

class Knight extends Piece {
    constructor(color, board, pos) {
        super(color, board, pos);
        this.type = "night";
        // spelled Knight as night so the first character of piece.type is equal to notation symbol (n)
    }

    availSquares(getSquaresAttacking=false, board=this.board) {
        let squares = [];

        for (let i = 0; i < knightOffsets.length; i++) {
            let square = [this.row + knightOffsets[i][0], this.col + knightOffsets[i][1]];
            if (validRange.includes(square[0]) && validRange.includes(square[1])) {
                let onSquare = board[square[0]][square[1]];
                if (onSquare != 0 && onSquare.color == this.color && !getSquaresAttacking) {continue}
                squares.push(squareArrayToString(square));
            }
        } return squares
    }
} 



class King extends Piece {
    constructor(color, board, pos) {
        super(color, board, pos);
        this.type = "king";
    }

    availSquares(getSquaresAttacking=false, board=this.board) {
        let squares = [];

        for (let i = 0; i < kingOffsets.length; i++) {
            let square = [this.row + kingOffsets[i][0], this.col + kingOffsets[i][1]];
            if (validRange.includes(square[0]) && validRange.includes(square[1])) {
                let onSquare = board[square[0]][square[1]];
                if (onSquare != 0 && onSquare.color == this.color && !getSquaresAttacking) {continue}
                squares.push(squareArrayToString(square));
            }
        } return squares
    }
}

class Pawn extends Piece {
    constructor(color, board, pos) {
        super(color, board, pos);
        this.type = "pawn";

        this.homeRow = 6;
        this.direction = -1;
        this.promotionRow = 0;
        if (this.color === 'black') {
            this.homeRow = 1;
            this.direction = 1;
            this.promotionRow = 7;
        }
    }

    availSquares(getSquaresAttacking=false, board=this.board) {
        let squares = [];

        if (board[this.row + this.direction][this.col] === 0) {
            squares.push(squareArrayToString([this.row + this.direction, this.col]));

            if (this.row === this.homeRow && board[this.row + this.direction * 2][this.col] === 0) {
                squares.push(squareArrayToString([this.row + this.direction * 2, this.col]));
            }
        }
        return squares
    }
}