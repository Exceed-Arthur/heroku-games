from flask import Flask
from flask_migrate import Migrate
from .models import *
import os
from os import path
import random

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

GAME_NAME = "travelingSalesman"
import os
from os import path
DB_NAME = "database.db"
from flask import jsonify, render_template, request, Blueprint, Flask
db = SQLAlchemy()
views = Blueprint('views', __name__)
app = Flask(__name__)
app.config['SECRET_KEY'] = 'hjshjhdjah kjshkjdhjs'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
print(os.path.abspath(f'sqlite:///{DB_NAME}'))
db.init_app(app)





app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'

""""DEFINE MODELS"""
DB_NAME = "database.db"
print(f"this is the abs path of db_name: {path.abspath('database.db')}")
# create the app


print(f"Running on http://127.0.0.1:3000/music-naming-tool")
print(f"Running on http://portal.itoven-ai.co/games/?game=travelingSalesman")

print(f"Running on http://127.0.0.1:3000/games?game=travelingSalesman")

def create_database(app):
    if not path.exists('instance/' + DB_NAME):
        print(f"attempting to create database")
        db.create_all(app=app)


