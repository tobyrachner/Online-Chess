const boardSize = 8;
const validRange = [...Array(boardSize).keys()]

const knightOffsets = [[-2, 1], [-1, 2], [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1]];
const kingOffsets = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

let kings = {};
let castlingSquares = {};

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

    seeIfCheck(square) {
        let board = [];
        for (let i = 0; i < this.board.length; i++) {
            board.push([...this.board[i]]);
        }
        board[this.row][this.col] = 0;
        board[square[0]][square[1]] = this;
        
        if (kings[this.color].isAttacked(board)) {
            return true;
        }
        return false;
    }

    isAttacked(board, square, color=this.color) {
        if (square == undefined) {square = this.pos}
        if (board == undefined) {board = this.board}
        let piecesInVision = [];
        square = squareArrayToString(square);
        let row = Number(square[0]);
        let col = Number(square[1]);

        // diagonals + straights
        let stop = [false, false, false, false, false, false, false, false];
        for (let i = 1; i < boardSize; i++) {
            let testSquares = [[row, col + i], [row + i, col], [row, col - i], [row - i, col], [row - i, col + i], [row + i, col + i], [row + i, col - i], [row - i, col - i]];
            for (let x = 0; x < testSquares.length; x++) {
                if (!stop[x]) {
                    if (validRange.includes(testSquares[x][0]) && validRange.includes(testSquares[x][1])) {
                        let onSquare = board[testSquares[x][0]][testSquares[x][1]];
                        if (onSquare === 0) {continue}

                        stop[x] = true;
                        if (onSquare.color != color) {
                            piecesInVision.push(onSquare);
                        }
                    }
                }
            }
        } 

        // knight moves
        for (let i = 0; i < knightOffsets.length; i++) {
            let testSquare = [row + knightOffsets[i][0], col + knightOffsets[i][1]];
            if (validRange.includes(testSquare[0]) && validRange.includes(testSquare[1])) {
                let onSquare = board[testSquare[0]][testSquare[1]];
                if (onSquare != 0 && onSquare.color != color) {
                    piecesInVision.push(onSquare);
                }
            }
        }
        // don't need to include king and pawn moves because they would be included in either straights or diagonals if they were in attack range

        for (let i = 0; i < piecesInVision.length; i++) {
            let piece = piecesInVision[i];
            if (piece.type == 'pawn' || piece.type == 'king') {
                if (piece.squaresAttacking().includes(square)) {
                    return true;
                }
            } else if (piece.availSquares(true, board).includes(square)) {
                return true;
            }
        } return false;
    }
}
  
class Rook extends Piece {
    constructor(color, board, pos) {
        super(color, board, pos);
        this.type = "rook";
    }

    availSquares(getSquaresAttacking, board) {
        if (board == undefined) {board = this.board}
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
        } 

        if (getSquaresAttacking) {
            return squares;
        }

        let returnSquares = [];
        for (let i = 0; i < squares.length; i++) {
            if (!this.seeIfCheck(squares[i])) {
                returnSquares.push(squares[i]);
            }
        }  return returnSquares
    }
}

class Bishop extends Piece {
    constructor(color, board, pos) {
        super(color, board, pos);
        this.type = "bishop";
    }

    availSquares(getSquaresAttacking, board) {
        if (board == undefined) {board = this.board}
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
        } 

        if (getSquaresAttacking) {
            return squares;
        }

        let returnSquares = [];
        for (let i = 0; i < squares.length; i++) {
            if (!this.seeIfCheck(squares[i])) {
                returnSquares.push(squares[i]);
            }
        }  return returnSquares
    }
}

class Queen extends Piece {
    constructor(color, board, pos) {
        super(color, board, pos);
        this.type = "queen";
    }

    availSquares(getSquaresAttacking, board) {
        if (board == undefined) {board = this.board}
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
        } 

        if (getSquaresAttacking) {
            return squares;
        }

        let returnSquares = [];
        for (let i = 0; i < squares.length; i++) {
            if (!this.seeIfCheck(squares[i])) {
                returnSquares.push(squares[i]);
            }
        }  return returnSquares
    }
}

class Knight extends Piece {
    constructor(color, board, pos) {
        super(color, board, pos);
        this.type = "night";
        // spelled Knight as night so the first character of piece.type is equal to notation symbol (n)
    }

    availSquares(getSquaresAttacking, board) {
        if (board == undefined) {board = this.board}
        let squares = [];

        for (let i = 0; i < knightOffsets.length; i++) {
            let square = [this.row + knightOffsets[i][0], this.col + knightOffsets[i][1]];
            if (validRange.includes(square[0]) && validRange.includes(square[1])) {
                let onSquare = board[square[0]][square[1]];
                if (onSquare != 0 && onSquare.color == this.color && !getSquaresAttacking) {continue}
                squares.push(squareArrayToString(square));
            }
        } 

        if (getSquaresAttacking) {
            return squares;
        }

        let returnSquares = [];
        for (let i = 0; i < squares.length; i++) {
            if (!this.seeIfCheck(squares[i])) {
                returnSquares.push(squares[i]);
            }
        }  return returnSquares
    }
} 

class King extends Piece {
    constructor(color, board, pos) {
        super(color, board, pos);
        this.type = "king";
    }

    availSquares(board=this.board) {
        let squares = [];

        for (let i = 0; i < kingOffsets.length; i++) {
            let square = [this.row + kingOffsets[i][0], this.col + kingOffsets[i][1]];
            if (validRange.includes(square[0]) && validRange.includes(square[1])) {
                let onSquare = board[square[0]][square[1]];
                if (onSquare != 0 && onSquare.color == this.color) {continue}
                squares.push(squareArrayToString(square));
            }
        } 

        let testBoard = [];
        for (let i = 0; i < this.board.length; i++) {
            testBoard.push([...this.board[i]]);
        }
        testBoard[this.row][this.col] = 0;

        // making sure the king can't walk into check
        let returnSquares = [];
        for (let i = 0; i < squares.length; i++) {
            if (!this.isAttacked(testBoard, squares[i])) {
                returnSquares.push(squares[i]);
            }
        }  
        
        // adding castling
        if (castling[this.color].length > 0 && !this.isAttacked()) {
            let row = this.row.toString();
            if (castling[this.color].includes('k') && board[this.row][5] === 0 && board[this.row][6] === 0) {
                if (!this.isAttacked(this.board, row + '5') && !this.isAttacked(this.board, row + '6')) {
                    returnSquares.push(row + '6', row + '7')
                    castlingSquares[row + '6'] = {'kingSquare': row + '6', 'rook': row + '7', 'rookTargetSquare': row + '5'};
                    castlingSquares[row + '7'] = {'kingSquare': row + '6', 'rook': row + '7', 'rookTargetSquare': row + '5'};
                }
            }

            if (castling[this.color].includes('q') && board[this.row][1] === 0 && board[this.row][2] === 0 && board[this.row][3] === 0) {
                if (!this.isAttacked(this.board, row + '3') && !this.isAttacked(this.board, row + '2')) {
                    returnSquares.push(row + '2', row + '0')
                    castlingSquares[row + '2'] = {'kingSquare': row + '2', 'rook': row + '0', 'rookTargetSquare': row + '3'};
                    castlingSquares[row + '0'] = {'kingSquare': row + '2', 'rook': row + '0', 'rookTargetSquare': row + '3'};
                }
            }
        }
        
        return returnSquares
    }

    squaresAttacking() {
        let squares = [];

        for (let i = 0; i < kingOffsets.length; i++) {
            let square = [this.row + kingOffsets[i][0], this.col + kingOffsets[i][1]];
            if (validRange.includes(square[0]) && validRange.includes(square[1])) {
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

    availSquares(board=this.board) {
        let squares = [];

        if (board[this.row + this.direction][this.col] === 0) {
            squares.push(squareArrayToString([this.row + this.direction, this.col]));

            if (this.row === this.homeRow && board[this.row + this.direction * 2][this.col] === 0) {
                squares.push(squareArrayToString([this.row + this.direction * 2, this.col]));
            }
        }
        if ((validRange.includes(this.col + 1) && board[this.row + this.direction][this.col + 1] != 0 && board[this.row + this.direction][this.col + 1].color != this.color) || (this.row + this.direction).toString() + (this.col + 1).toString() === enPassantDummy) {
            squares.push(squareArrayToString([[this.row + this.direction], [this.col + 1]]));
        }
        if ((validRange.includes(this.col - 1) && board[this.row + this.direction][this.col - 1] != 0 &&  board[this.row + this.direction][this.col - 1].color != this.color) || (this.row + this.direction).toString() + (this.col - 1).toString() === enPassantDummy) {
            squares.push(squareArrayToString([[this.row + this.direction], [this.col - 1]]));
        } 

        let returnSquares = [];
        for (let i = 0; i < squares.length; i++) {
            if (!this.seeIfCheck(squares[i])) {
                returnSquares.push(squares[i]);
            }
        }  return returnSquares
    }

    squaresAttacking() {
        let squares = [];
        if (validRange.includes(this.col - 1)) {squares.push((this.row + this.direction).toString() + (this.col - 1).toString());}
        if (validRange.includes(this.col + 1)) {squares.push((this.row + this.direction).toString() + (this.col + 1).toString());}
        return squares;
    }

    promote(type, board) {
        return createPieces[type](this.color, board, this.pos);
    }
}