from flask_socketio import SocketIO, send, emit, join_room, leave_room
from website import create_app

app = create_app()
socketio = SocketIO(app)

@socketio.on('connected')
def user_connected(data):
    print('Received message:', data['data'])
    emit('return', 'Received message: ' + data['data'])

@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    print(room)
    emit('return', username + ' has joined the room.')

@socketio.on('send_move')
def play_move(data):
    print(data)
    socketio.emit('move_played', data, to=data['room'])

if __name__ == '__main__':
    socketio.run(app, debug=True)