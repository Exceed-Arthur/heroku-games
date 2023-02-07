from website.models import *
import views
from views import db
from flask import request, jsonify

def populate():

    randomUsers = [{"username": "arthuristhebest", "highScore": 115623, "id3": 1248515, "game": "travelingSalesman"},
        {"username": "harrythemanic", "highScore": 213639, "id3": 1721635, "game": "travelingSalesman"},
        {"username": "superduper3124", "highScore": 87555, "id3":2352352, "game": "travelingSalesman"},
        {"username": "wackyboii22", "highScore": 112415, "id3": 15260815, "game": "travelingSalesman"},
        {"username": "arthuristhebest", "highScore": 115623, "id3": 555415, "game": "travelingSalesman"},
        {"username": "afksuperstar", "highScore": 47622, "id3": 1747115, "game": "travelingSalesman"},
        {"username": "acemaster", "highScore": 8751455, "id3":266352, "game": "travelingSalesman"},
        {"username": "harleymannqeuing18", "highScore": 1628615, "id3": 56815, "game": "travelingSalesman"}]

    for user in randomUsers:
        id3 = user['id3']
        game = user['game']
        username = user['username']
        highScore = user['highScore']
        user =views.GameUser(
            id3=id3,
            username=username,
            highScore=highScore,
            game=game
        )
        db.session.add(user)
        db.session.commit()
        print(f"Added user: {user}")
        return jsonify(f"Added user: {user}")


populate()