let board = undefined;
let piece = undefined;
let pieceHtml = undefined;
let availSquares = [];
let emptyAvailSquares = [];

let cOffX = 0;
let cOffY = 0;

function testSetup() {
  board = fenToArray('3k4/1qr2b2/6n1/8/8/5P2/p3R1N1/2KBQ3');
  addPiecesToHtml(board);
  addDragListeners();
}

function createCircle() {
  let circle = document.createElement('div');
  circle.className = 'availCircle';
  return circle;
}

function addDragListeners() {
  let pieces = document.getElementsByClassName('piece');
  for (let i = 0; i < pieces.length; i++) {
    pieces[i].addEventListener('mousedown', dragStart);
  }
}

function dragStart(e) {
  e = e || window.event;
  e.preventDefault();
  
  pieceHtml = e.target;
  let square = pieceHtml.parentElement.id
  piece = board[Number(square[0])][Number(square[1])];

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
    movePiece(board, square, prevSquare, piece, pieceHtml)
  }

  piece = undefined;
  pieceHtml = undefined;
  availSquares = [];
}

function movePiece(board, square, prevSquare, piece, pieceHtml) {
  square.innerHTML = '';
  square.appendChild(pieceHtml);    
  board[Number(square.id[0])][Number(square.id[1])] = piece
  board[Number(prevSquare.id[0])][Number(prevSquare.id[1])] = 0
}

testSetup();