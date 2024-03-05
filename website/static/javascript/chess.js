function CreatePieceObject()  {
    this.r = function (color) { return new Rook(color);};
    this.b = function (color) { return new Bishop(color);};
    this.q = function (color) { return new Queen(color);};
    this.n = function (color) { return new Knight(color);};
    this.k = function (color) { return new King(color);};
    this.p = function (color) { return new Pawn(color);};
}

const createPieces = new CreatePieceObject();

function fenToArray(fen) {
    const rows = fen.split('/');
    let board = [];

    // FEN example: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'
    // lower case = black piece, upper case = white piece, number = number of empty squares, lines are separated by '/'

    for (let i = 0; i < rows.length; i++) {
        let row = [];
        for (let j = 0; j < rows[i].length; j++) {
            let character = rows[i][j];

            if (!isNaN(character)) {
                for (let k = 0; k < +character; k++) {
                    row.push(0)
                }
            } else {
                let color = 'white';
                if (character === character.toLowerCase()) {color = 'black'}
                row.push(createPieces[character.toLowerCase()](color))
            }
        }

        board.push(row)
    }
    return board
}

function arrayToFEN(board) {
    console.log(board)
    let fen = '';
    let zeroCount = 0

    for (let row = 0; row < board.length; row++) {
        if (!(fen == '')) {fen += '/';}

        if (zeroCount) {fen += zeroCount.toString();}
        zeroCount = 0

        for (let i = 0; i < board[row].length; i++) {
            let obj = board[row][i];

            if (obj === 0) {
                zeroCount += 1;
            } else {
                if (zeroCount) {
                    fen += zeroCount.toString();
                    zeroCount = 0;
                }

                let letter = obj.type[0];
                if (obj.color === 'white') {
                    letter = letter.toUpperCase()
                }
                fen += letter;
            }
        }
    }
    return fen;
}