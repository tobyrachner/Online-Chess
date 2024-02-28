from flask import Blueprint, render_template

views = Blueprint('views', __name__)

@views.route('/')
def home():
    return render_template('home.html')

@views.route('/room/<id>')
def game_room(id):
    return f"<h1>game_room \n id: {id}</h1>"