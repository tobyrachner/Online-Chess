from flask import Blueprint, render_template, request, flash, url_for, redirect
from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from .models import User
from . import db

auth = Blueprint('auth', __name__)

@auth.route('login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        user = User.query.filter_by(email=email).first()
        if user:
            if user.password == password:
                login_user(user, remember=True)
                flash('Logged in successfully', category='success')
                return redirect(url_for('views.home'))
            else:
                flash('Incorrect password', category='error')
        else:
            flash('User not found', category='error')
    return render_template('login.html')

@auth.route('sign-up', methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        email = request.form.get('email')
        username = request.form.get('username')
        password1 = request.form.get('password1')
        password2 = request.form.get('password2')

        user1 = User.query.filter_by(email=email).first()
        user2 = User.query.filter_by(username=username).first()

        if user1:
            flash('Email already in use', category='error')
        elif user2:
            flash('Username already taken', category='error')
        elif len(username) < 4:
            flash('Username must be at least 4 characters', category='error')
        elif password1 != password2:
            flash('Passwords don\'t match', category='error')
        elif len(password1) < 7:
            flash('Password must be at least 7 characters', category='error')
        else:
            new_user = User(email=email, username=username, password=password1)
            db.session.add(new_user)
            db.session.commit()

            flash('Account created successfully', category='success')
            login_user(new_user, remember=True)
            return redirect(url_for('views.home'))
    return render_template('sign_up.html')

@auth.route('logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))