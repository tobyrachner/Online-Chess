from flask import Blueprint, render_template, send_from_directory, request, redirect, url_for, flash
from flask_login import current_user
import os

from .models import Game
from . import db

DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

views = Blueprint('views', __name__)

@views.route('/')
def home():
    return render_template('home.html', user=current_user, online=True)

@views.route('create_game', methods=['POST'])
def create_game():
    print(request.form['name'])

    game = Game.query.filter_by(name=request.form['name']).first()

    if game:
        flash('Room name currently in use', category='error')
        return ValueError()
    else:
        new_game = Game(name=request.form['name'], password=request.form['password'], fen=DEFAULT_FEN)
        db.session.add(new_game)
        db.session.commit()

        return 'test'

@views.route('/game/<id>')
def game_room(id):
    return render_template('game.html', user=current_user, online=True, id=id)

@views.route('/pieces/<piece>')
def get_piece_image(piece):
    path = os.path.join(os.path.dirname(os.getcwd()), 'online-chess', 'website', 'static', 'images', 'pieces')
    return send_from_directory(path, piece.replace('-', '_') + '.png')