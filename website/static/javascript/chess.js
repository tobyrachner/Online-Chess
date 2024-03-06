function CreatePieceObject()  {
    this.r = function (color) { return new Rook(color);};
    this.b = function (color) { return new Bishop(color);};
    this.q = function (color) { return new Queen(color);};
    this.n = function (color) { return new Knight(color);};
    this.k = function (color) { return new King(color);};
    this.p = function (color) { return new Pawn(color);};
}
const createPieces = new CreatePieceObject();


function addPiecesToHtml(board) {
    let addPiece = function (type, color, pos) {
        let square = document.getElementById(pos);
        square.innerHTML = `<img src="http://127.0.0.1:5000/pieces/${color + '_' + type}" class="piece" width="63" height="63"></img>`;
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
        for (let j = 0; j < rows[i].length; j++) {
            let character = rows[i][j];


            if (!isNaN(character)) {
                for (let j = 0; j < +character; j++) {
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