let room = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
let user = document.getElementById('jinjaData').dataset.user;

function join(room, username) {
    if (!room) {room = document.getElementById('room-id').dataset.id;}
    if (!username) {username = document.getElementById('jinjaData').dataset.user;}
    if (Array.from(username)[0] === '<') {username = 'Anonymous'};
    socket.emit('join', {username: username, room: room})
}

socket.on('joined', function(data) {
    console.log('joined game room')
    console.log
    setup(data['fen'])
})

window.addEventListener('beforeunload', function(event) {
    event.preventDefault();
    console.log('beforeunload')
    socket.emit('client_disconnecting', {room: room, user: user})
})

join(room, user);