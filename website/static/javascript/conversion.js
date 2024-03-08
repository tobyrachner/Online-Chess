function CreatePieceObject()  {
    this.r = function (color, board, pos) { return new Rook(color, board, pos);};
    this.b = function (color, board, pos) { return new Bishop(color, board, pos);};
    this.q = function (color, board, pos) { return new Queen(color, board, pos);};
    this.n = function (color, board, pos) { return new Knight(color, board, pos);};
    this.k = function (color, board, pos) { return new King(color, board, pos);};
    this.p = function (color, board, pos) { return new Pawn(color, board, pos);};
}
const createPieces = new CreatePieceObject();


function addPiecesToHtml(board) {
    let addPiece = function (type, color, pos) {
        let square = document.getElementById(pos);
        square.innerHTML = `<img src="http://127.0.0.1:5000/pieces/${color + '_' + type}" class="piece"></img>`;
    }
   
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            let square = board[i][j];
            if (!(square === 0)) {
                addPiece(square.type, square.color, i.toString() + j.toString());
            }
        }
    }
}


function fenToArray(fen) {
    const rows = fen.split('/');
    let board = [];


    // FEN example: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'
    // lower case = black piece, upper case = white piece, number = number of empty squares, lines are separated by '/'


    for (let i = 0; i < rows.length; i++) {
        let row = [];
        let currColumn = -1

        for (let j = 0; j < rows[i].length; j++) {
            let character = rows[i][j];

            if (!isNaN(character)) {
                currColumn += Number(character);
                for (let j = 0; j < +character; j++) {
                    row.push(0)
                }
            } else {
                currColumn += 1;
                let color = 'white';
                if (character === character.toLowerCase()) {color = 'black'}
                row.push(createPieces[character.toLowerCase()](color, board, i.toString() + currColumn.toString()));
            }
        }


        board.push(row)
    }
    return board
}


function generateFEN(board) {
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