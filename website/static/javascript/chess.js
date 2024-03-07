function testSetup() {
  let board = fenToArray('3k4/1qr2b2/6n1/8/8/5P2/p3R1N1/2KBQ3');
  addPiecesToHtml(board);
  addDragListeners();
}

let cOffX = 0;
let cOffY = 0;

function addDragListeners() {
  let pieces = document.getElementsByClassName('piece');
  for (let i = 0; i < pieces.length; i++) {
    pieces[i].addEventListener('mousedown', dragStart);
  }
}

function dragStart(e) {
  e = e || window.event;
  e.preventDefault();
  
  let piece = e.target;

  cOffX = e.clientX;
  cOffY = e.clientY;

  document.addEventListener('mousemove', dragMove);
  document.addEventListener('mouseup', dragEnd);

  piece.classList.add('dragging');
};

function dragMove(e) {
  e = e || window.event;
  e.preventDefault();

  let piece = e.target;

  piece.style.center

  piece.style.top = (e.clientY - cOffY).toString() + 'px';
  piece.style.left = (e.clientX - cOffX).toString() + 'px';
};

function dragEnd(e) {
  e = e || window.event;
  e.preventDefault();

  let piece = e.target;
  let prevSquare = piece.parentElement;

  document.removeEventListener('mousemove', dragMove);
  document.removeEventListener('mouseup', dragEnd);

  piece.classList.remove('dragging');
  piece.style.top = null;
  piece.style.left = null;

  let square = document.elementFromPoint(e.clientX, e.clientY);
  if (square.classList.contains('piece')) {
    square = square.parentElement;
  }

  if (square.classList.contains('square')) {
    prevSquare.removeChild(piece);
    square.innerHTML = '';
    square.appendChild(piece);
  }
}