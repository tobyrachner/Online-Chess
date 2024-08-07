const boardSize = 8;
const validRange = [...Array(boardSize).keys()]

const changePlayers = {
    'w': 'white',
    'b': 'black',
    'white': 'black',
    'black': 'white',
};
const castling = {
    'white': [],
    'black': [],
};
const aToG = 'abcdefgh';
let activePlayer = 'white';
let enPassantDummy = '-';
let halfMoves = 0;
let fullMove = 1;

let boardFlipped = false;

function CreatePieceObject()  {
    this.r = function (color, board, pos) { return new Rook(color, board, pos);};
    this.b = function (color, board, pos) { return new Bishop(color, board, pos);};
    this.q = function (color, board, pos) { return new Queen(color, board, pos);};
    this.n = function (color, board, pos) { return new Knight(color, board, pos);};
    this.k = function (color, board, pos) { return new King(color, board, pos);};
    this.p = function (color, board, pos) { return new Pawn(color, board, pos);};
}
const createPieces = new CreatePieceObject();

function generateEmptyBoard(flip) {

    let boardHtml = document.getElementById('board');
    boardHtml.innerHTML = ''; 

    let color = 'white';
    let row = '0';
    let col = '0';

    for (let i = 0; i < boardSize; i++) {
        row = i.toString()
        if (flip) {row = (7 - i).toString()};

        for (let j = 0; j < boardSize; j++) {
            col = j.toString()
            if (flip) {col = (7 - j).toString()};

            color = 'white'
            if ((i + j) % 2 === 1) {color = 'black'};
            boardHtml.innerHTML += `<div class="square relative flex justify-center items-center bg-${color}" id="${row + col}"></div>`;
        }
    }
}

function addPiecesToHtml(board, flip) {
    if (!flip) {flip = boardFlipped}

    let addPiece = function (type, color, pos) {
        let square = document.getElementById(pos);
        square.innerHTML = `<img src="http://127.0.0.1:5000/pieces/${color + '_' + type}" class="piece w-[80%] aspect-square absolute z-10"></img>`;
    }

    generateEmptyBoard(flip);
   
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
    // FEN example: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    // more infos here: https://www.chess.com/terms/fen-chess

    fen = fen.split(' ');
    const rows = fen[0].split('/');
    activePlayer = changePlayers[fen[1]];
    halfMoves = Number(fen[4]);
    fullMovements = Number(fen[5]);

    if (fen[3] === '-') {enPassantDummy = '-';}
    else {enPassantDummy = (8 - Number(fen[3][1])).toString() + aToG.indexOf(fen[3][0]).toString();};

    for (let i = 0; i < fen[2].length; i++) {
        let character = fen[2][i];
        if (character === '-') {continue}
        if (character === character.toUpperCase()) {castling['white'].push(character.toLowerCase());}
        if (character === character.toLowerCase()) {castling['black'].push(character);}
    }
    

    let board = [];

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
                let piece = createPieces[character.toLowerCase()](color, board, i.toString() + currColumn.toString());
                row.push(piece);

                if (piece.type === 'king') {
                    kings[piece.color] = piece;
                }
            }
        }


        board.push(row)
    }
    return board
}


function generateFEN() {
    let fen = [];

    let boardPosition = '';
    let zeroCount = 0

    for (let row = 0; row < board.length; row++) {
        if (!(boardPosition == '')) {boardPosition += '/';}
        zeroCount = 0

        for (let i = 0; i < board[row].length; i++) {
            let obj = board[row][i];


            if (obj === 0) {
                zeroCount += 1;
            } else {
                if (zeroCount) {
                    boardPosition += zeroCount.toString();
                    zeroCount = 0;
                }


                let letter = obj.type[0];
                if (obj.color === 'white') {
                    letter = letter.toUpperCase()
                }
                boardPosition += letter;
            }
        }
        if (zeroCount) {boardPosition += zeroCount.toString();}
    }

    let castleMoves = '';
    for (let i = 0; i < castling['white'].length; i++) {castleMoves += castling['white'][i].toUpperCase();} 
    for (let i = 0; i < castling['black'].length; i++) {castleMoves += castling['black'][i];}
    if (castleMoves === '') {
        castleMoves = '-'
    }

    if (enPassantDummy != '-') {
        enPassantDummy = aToG[Number(enPassantDummy[1])] + (8 - Number(enPassantDummy[0])).toString();
    }

    fen.push(boardPosition, activePlayer[0], castleMoves, enPassantDummy, halfMoves.toString(), fullMove.toString());
    return fen.join(' ');
}

function flipBoard() {
    boardFlipped = !boardFlipped;
    addPiecesToHtml(board, boardFlipped)
    addDragListeners()
}