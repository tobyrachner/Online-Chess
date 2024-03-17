from . import db
from flask_login import UserMixin

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True)
    username = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))

class Game(db.Model):
    name = db.Column(db.String(100), primary_key=True)
    password = db.Column(db.String(100))
    white = db.Column(db.String)
    black = db.Column(db.String)
    fen = db.Column(db.String)
    result = db.Column(db.String)