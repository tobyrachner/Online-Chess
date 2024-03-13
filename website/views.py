from flask import Blueprint, render_template, send_from_directory, request
from flask_login import current_user
import os

views = Blueprint('views', __name__)

@views.route('/')
def home():
    return render_template('home.html', user=current_user)

@views.route('/pieces/<piece>')
def get_piece_image(piece):
    path = os.path.join(os.path.dirname(os.getcwd()), 'online-chess', 'website', 'static', 'images', 'pieces')
    return send_from_directory(path, piece.replace('-', '_') + '.png')

@views.route('/room/<id>')
def game_room(id):
    return f"<h1>game_room \n id: {id}</h1>"

@views.route('play_move', methods=['POST'])
def play_move():
    print(request.form['fen'])
    return 'success'