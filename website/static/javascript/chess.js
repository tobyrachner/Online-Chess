let controller = new AbortController();;
let { signal } = controller;

const promoteButtons = document.createElement('div');
promoteButtons.className = 'promote-buttons';
promoteButtons.innerHTML = `<img class="promote-button" id="promote-bishop" src="http://127.0.0.1:5000/pieces/white_bishop">
<img class="promote-button" id="promote-knight" src="http://127.0.0.1:5000/pieces/white_night">
<img class="promote-button" id="promote-rook" src="http://127.0.0.1:5000/pieces/white_rook">
<img class="promote-button" id="promote-queen" src="http://127.0.0.1:5000/pieces/white_queen">`;

let board = undefined;
let piece = undefined;
let pieceHtml = undefined;
let availSquares = [];
let emptyAvailSquares = [];

let cOffX = 0;
let cOffY = 0;

function setup(fen) {
  if (fen) {board = fenToArray(fen);}
  else {board = fenToArray('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');}
  addPiecesToHtml(board);
  addDragListeners();
}

function createCircle() {
  let circle = document.createElement('div');
  circle.className = 'availCircle';
  return circle;
}

function addDragListeners() {
  controller = new AbortController();
  let { signal } = controller;
  let pieces = document.getElementsByClassName('piece');
  for (let i = 0; i < pieces.length; i++) {
    pieces[i].addEventListener('mousedown', dragStart, { signal });
  }
}

function dragStart(e) {
  e = e || window.event;
  e.preventDefault();
  
  pieceHtml = e.target;
  let square = pieceHtml.parentElement.id
  piece = board[Number(square[0])][Number(square[1])];

  if (piece.color != activePlayer) {
    return
  }

  availSquares = piece.availSquares();
  for (let i = 0; i < availSquares.length; i++) {
    let availSquare = document.getElementById(availSquares[i]);

    if (availSquare.hasChildNodes()) {
      availSquare.style.borderRadius = '1.3em'
    } else {
      availSquare.appendChild(createCircle());
      emptyAvailSquares.push(availSquare); 
    }
  }

  cOffX = e.clientX;
  cOffY = e.clientY;

  document.addEventListener('mousemove', dragMove);
  document.addEventListener('mouseup', dragEnd);

  pieceHtml.classList.add('dragging');
};

function dragMove(e) {
  e = e || window.event;
  e.preventDefault();

  pieceHtml.style.center

  pieceHtml.style.top = (e.clientY - cOffY).toString() + 'px';
  pieceHtml.style.left = (e.clientX - cOffX).toString() + 'px';
};

function dragEnd(e) {
  e = e || window.event;
  e.preventDefault();

  let prevSquare = pieceHtml.parentElement;

  for (let i = 0; i < availSquares.length; i++) {
    let availSquare = document.getElementById(availSquares[i]);
    availSquare.style.borderRadius = null;
    if (emptyAvailSquares.includes(availSquare)) {
      availSquare.innerHTML = '';
    }
  }

  document.removeEventListener('mousemove', dragMove);
  document.removeEventListener('mouseup', dragEnd);

  pieceHtml.classList.remove('dragging');
  pieceHtml.style.top = null;
  pieceHtml.style.left = null;

  let square = document.elementFromPoint(e.clientX, e.clientY);
  if (square.classList.contains('piece')) {
    square = square.parentElement;
  }

  if (square.classList.contains('square') && availSquares.includes(square.id)) {
    changeTurn(board, square, prevSquare, piece, pieceHtml)
  }

  piece = undefined;
  pieceHtml = undefined;
  availSquares = [];
  emptyAvailSquares = [];
}

function changeTurn(board, square, prevSquare, piece, pieceHtml) {
  if (activePlayer === 'black') {fullMove++;}

  halfMoves++;
  if (piece.type === 'pawn' || square.hasChildNodes()) {halfMoves = 0;}

  if (piece.type === 'king') {
    castling[piece.color] = [];
  }
  if (piece.type === 'rook') {
    if (piece.col == '0') {castling[piece.color].splice(castling[piece.color].indexOf('q'), 1);}
    if (piece.col == '7') {castling[piece.color].splice(castling[piece.color].indexOf('k'), 1);}
  }

  if (square.id in castlingSquares) {
    let positions = castlingSquares[square.id]
    square = document.getElementById(positions['kingSquare']);
    let rook = board[Number(positions['rook'][0])][Number(positions['rook'][1])];
    let rookSquare = document.getElementById(positions['rook'])
    let rookHtml = rookSquare.childNodes[0];

    rookSquare.innerHTML = '';
    document.getElementById(positions['rookTargetSquare']).appendChild(rookHtml);
    board[rook.row][rook.col] = 0;
    board[Number(positions['rookTargetSquare'][0])][Number(positions['rookTargetSquare'][1])] = rook;
    rook.changePosition(positions['rookTargetSquare']);
  }

  if (piece.type === 'pawn') {
    if (square.id === enPassantDummy) {
      let passedSquare = [piece.row, piece.col - piece.direction]
      document.getElementById(passedSquare.join('')).innerHTML = '';
      board[passedSquare[0]][passedSquare[1]] = 0;    
    };

    if (Number(square.id[0]) === piece.promotionRow) {
      square.innerHTML = ''
      square.appendChild(pieceHtml);
      square.appendChild(promoteButtons);
      promotePawn(createClickListenerPromise(), piece, square, prevSquare.id);
      return
    }
  }

  if (piece.type === 'pawn' && Math.abs(Number(square.id[0]) - piece.row) > 1) {
    enPassantDummy = (piece.row + piece.direction).toString() + piece.col.toString();
  } else {
    enPassantDummy = '-';
  }

  square.innerHTML = '';
  square.appendChild(pieceHtml);    
  board[Number(square.id[0])][Number(square.id[1])] = piece;
  board[Number(prevSquare.id[0])][Number(prevSquare.id[1])] = 0;
  piece.changePosition(square.id)


  activePlayer = changePlayers[activePlayer];
  let gameOver = checkGameOver()
  if (gameOver) {console.log(gameOver)}
}

function checkGameOver() {
  if (halfMoves > 99) {return '50 moves'}

  let pieces = [];
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] != 0) {pieces.push(board[i][j]);
      }
    }
  }

  for (let i = 0; i < pieces.length; i++) {
    let piece = pieces[i];
    if (piece.color === activePlayer && piece.availSquares().length > 0) {
      return false;
    }
  }
  if (kings[activePlayer].isAttacked()) {
    return 'checkmate';
  }
  return 'stalemate';
}

async function promotePawn(clickListenerPromise, pawn, square, prevSquare) {
  pawn.changePosition(square.id)
  
  controller.abort();
  await clickListenerPromise;

  clickListenerPromise.then((type) => {
    board[pawn.row][pawn.col] = pawn.promote(type, board);
  })

  // adding 1 ms of delay because .then function is apparently slightly delayed
  await new Promise(r => setTimeout(r, 1));
  
  board[Number(prevSquare[0])][Number(prevSquare[1])] = 0;
  enPassantDummy = '-';

  addPiecesToHtml(board);

  activePlayer = changePlayers[activePlayer];
  let gameOver = checkGameOver()
  if (gameOver) {console.log(gameOver)}

  addDragListeners();
}

function createClickListenerPromise() {
  return new Promise(function (resolve) {
    document.getElementById('promote-bishop').addEventListener('click', function selectPieceListener() {
      resolve('b');
    });
    document.getElementById('promote-knight').addEventListener('click', function selectPieceListener() {
      resolve('n');
    });
    document.getElementById('promote-rook').addEventListener('click', function selectPieceListener() {
      resolve('r');
    });
    document.getElementById('promote-queen').addEventListener('click', function selectPieceListener() {
      resolve('q');
    });
  })
}


setup();