let roomName = window.location.href.substring(window.location.href.lastIndexOf('/') + 1, window.location.href.lastIndexOf('?'));
let user = document.getElementById('jinjaData').dataset.user;
let locked = document.getElementById('online').dataset.locked;
if (Array.from(user)[0] === '<') {user = 'Anonymous'};

playingAs = '';

socket.on('joined', function(data) {
    console.log('joined game room')
    setup(data['fen'])
})

socket.on('color_successful', function(color) {
    playingAs = color;
})


function playAs(color) {
    if (new URLSearchParams(window.location.search).get('locked') === 'False' && playingAs === '') {
    socket.emit('play_as', {'color': color, 'room': roomName})
    }
}

function join(room, username) {
    if (!room) {room = roomName;}
    if (!username) {username = user;}
    socket.emit('join', {username: username, room: room})
}


join(roomName, user);