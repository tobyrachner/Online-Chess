let socket = io();

socket.on('connect', function() {
    socket.emit('connected', {data: 'I\'m connected!'});
})

socket.on('return', function(data) {
    console.log(data);
})

socket.on('move_received', function(data) {
    console.log(data);
})

function join(room, username) {
    if (!room) {room = 'test_room';}
    if (!username) {username = 'toby';}
    socket.emit('join', {username: username, room: room});
}


generateFEN()