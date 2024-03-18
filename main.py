from flask import request
from flask_socketio import SocketIO, send, emit, join_room, leave_room
from website import create_app, db
from website.models import Game

app = create_app()
socketio = SocketIO(app)

users = {}
rooms = {} # keeping track of client count for each room

@socketio.on('connected')
def user_connected(data):
    print('Received message:', data['data'])
    emit('return', 'Received message: ' + data['data'])

@socketio.on('disconnect')
def disconnecting():
    if request.sid in users:
        print(users)
        user, room = users[request.sid]
        rooms[room] -= 1
        
        if rooms[room] == 0:
            Game.query.filter_by(name=room).delete()
            db.session.commit()

@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']

    users[request.sid] = [username, room]
    
    if room in rooms: 
        rooms[room] += 1
    else:
        rooms[room] = 1

    join_room(room)
    emit('return', username + ' has joined the room.', to=room)
    emit('joined', {'fen': Game.query.filter_by(name=room).first().fen})

@socketio.on('send_move')
def play_move(data):
    game = Game.query.filter_by(name=data['room']).first()
    game.fen = data['fen']
    db.session.commit()
    socketio.emit('move_played', data, to=data['room'])

if __name__ == '__main__':
    socketio.run(app, debug=True)