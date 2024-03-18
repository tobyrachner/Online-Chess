from flask import Blueprint, render_template, send_from_directory, redirect, url_for, flash, request
from flask_login import current_user
import os

from .models import Game
from . import db

DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

views = Blueprint('views', __name__)

@views.route('/')
def home():
    return render_template('home.html', user=current_user, online=True)

@views.route('/create_game', methods=['POST'])
def create_game():
    game = Game.query.filter_by(name=request.form['name']).first()

    if game:
        flash('Room already exists', category='error')
        return "Room already exists", 400
    else:
        new_game = Game(name=request.form['name'], password=request.form['password'], fen=DEFAULT_FEN)
        db.session.add(new_game)
        db.session.commit()

        return 'test'
    
@views.route('/join_game', methods=['POST'])
def join_game():
    game = Game.query.filter_by(name=request.form['name']).first()
    locked = True

    if not game:
        flash('Room not found', category='error')
        return "Room not found", 400
    
    if game.password == request.form['password']:
        locked = False

    elif request.form['spectate'] == 'false':
        flash ('Incorrect password', category='error')
        return "Incorrect password", 400
    
    return {"name": game.name, "locked": locked}

@views.route('/game/<id>')
def game_room(id):
    return render_template('game.html', user=current_user, online=True, id=id)

@views.route('/pieces/<piece>')
def get_piece_image(piece):
    path = os.path.join(os.path.dirname(os.getcwd()), 'online-chess', 'website', 'static', 'images', 'pieces')
    return send_from_directory(path, piece.replace('-', '_') + '.png')