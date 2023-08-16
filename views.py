import time
import json
from website import *
import requests
import random


class game_user(db.Model):
    id3 = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    highScore = db.Column(db.Integer)
    game = db.Column(db.String)


class game_record(db.Model):
    id3 = db.Column(db.String, primary_key=True)
    game = db.Column(db.String)
    level = db.Column(db.Integer)
    levelHighScore = db.Column(db.Integer)
    levelTimeRecord = db.Column(db.Integer)  # milliseconds


class leaderboard_entry(db.Model):
    id3 = db.Column(db.Integer, primary_key=True)
    game = db.Column(db.String)
    username = db.Column(db.String)
    highScore = db.Column(db.Integer)


if not path.exists('instance/' + DB_NAME):
    with app.app_context():
        db.create_all()
        print(f"attempting to create database")

print(os.path.abspath(f'sqlite:///{DB_NAME}'))
views2 = Blueprint('views2', __name__)
app.register_blueprint(views2, url_prefix='/')
gameQuery = "game=" + GAME_NAME

stringPaths = ["/games/api/getUserList?" + gameQuery,
               "/games/api/getLeaderboardEntries?" + gameQuery,
               "/games/api/createGameUser?" + gameQuery,
               "/games/api/changeHighScore?" + gameQuery,
               "/games/api/createGameRecord?" + gameQuery,
               "/games/api/getGameRecord?" + gameQuery,
               "/games/api/createLeaderboardEntry?" + gameQuery]

baseURL = "http://127.0.0.1:3000"

for pather in stringPaths:
    print(baseURL + pather)


def populate_sample_data():
    randomUsers = [{"username": "arthuristhebest", "highScore": 115623, "id3": 1248515, "game": GAME_NAME},
                   {"username": "harrythemanic", "highScore": 213639, "id3": 1721635, "game": GAME_NAME},
                   {"username": "superduper3124", "highScore": 87555, "id3": 2352352, "game": GAME_NAME},
                   {"username": "wackyboii22", "highScore": 112415, "id3": 15260815, "game": GAME_NAME},
                   {"username": "arthuristhedewrbest", "highScore": 115623, "id3": 555415, "game": GAME_NAME},
                   {"username": "afksuperstar", "highScore": 47622, "id3": 1747115, "game": GAME_NAME},
                   {"username": "acemaster", "highScore": 8751455, "id3": 266352, "game": GAME_NAME},
                   {"username": "harleymannqeuing18", "highScore": 1628615, "id3": 56815, "game": GAME_NAME}]

    for user in randomUsers:
        id3 = user['id3']
        game = user['game']
        username = user['username']
        highScore = user['highScore']
        user = game_user(
            id3=id3,
            username=username,
            highScore=highScore,
            game=game
        )
        db.session.add(user)
        try:
            db.session.commit()
        except:
            db.session.rollback()
        print(f"Added user: {user}")


@app.route('/')
def home():
    return jsonify(
        {"GAMES": ["travelingSalesman"], "POPULATE_DATA": True, "query": """BASE_URL = url?

            "/api/getUserList"
            query string = "?game=travelingSalesman&
            
            "/api/getLeaderboardEntries"
            query string = "?game=travelingSalesman
            
            "/api/createGameU
            ser"
            query string = "?game=travelingSalesman&id3=3209523&username=ellisdeman34&highScore=23589253
            
            "/api/changeHighScore"
            query string = "?game=travelingSalesman&username=ellisdeman34&highScore=23589253
            
            "/api/createGameRecord"
            query string = "?game=travelingSalesman&levelTimeRecord=125155&level=2&levelHighScore=149109
            
            "/api/createLeaderboardEntry"
            query string = "?game=travelingSalesman&username=ellisdeman34&highScore=23589253
    """}
    )


@app.route('/games', methods=["GET", "POST"])
def game():
    print(request.query_string)
    gameName = request.args['game']
    if gameName == "travelingSalesman":
        return render_template("traveling_salesman_game.html")
    elif gameName == "chemistrytoy":
        return render_template("chemistrytoy.html")
    return jsonify(request)


'''
GAME NAMES:
1. travelingSalesman
'''

""""END DEFINE MODELS"""


@app.route("/games/api/getUserList", methods=['GET'])
def getUserList():
    users = db.session.execute(db.select(game_user).order_by(game_user.username)).scalars()
    users_ = []
    for user in users:
        users_.append({"id3": user.id3, "username": user.username, "highScore": user.highScore, "game": user.game})
        print(f"Found User: {user}")
    return jsonify(users_)


@app.route("/games/api/getLeaderboardEntries", methods=['GET'])  # ACCESS WITH GAME NAME QUERY
def get_leaderboard_entries():
    dictionary = request.values.dicts[0].to_dict()
    game = dictionary['game'] if 'game' in dictionary.keys() else 'travelingSalesman'

    selection = leaderboard_entry.query.all()
    selection_ = []
    for leaderboard_entry2 in selection:
        dictionary_parse = {"game": leaderboard_entry2.game, "username": leaderboard_entry2.username,
                            "highScore": leaderboard_entry2.highScore, "id3": leaderboard_entry2.id3}
        #print("RETRIEVED LEADERBOARD ENTRIES ON SERVER: ", dictionary_parse)
        if leaderboard_entry2.game.lower() == game.lower():
            selection_.append(dictionary_parse)
    selection = selection_
    return jsonify(selection)


@app.route("/games/api/createGameUser", methods=['GET'])
def user_create():
    dictionary = request.values.dicts[0].to_dict()
    id3 = dictionary['id3']
    game = dictionary['game']
    username = dictionary['username']
    highScore = dictionary['highScore']
    user = game_user()
    user.id3 = id3
    user.username = username
    user.highScore = highScore
    user.game = game
    try:
        db.session.add(user)
        db.session.commit()
    except:
        db.session.rollback()
    print(f"Added user: {user}")
    return jsonify(f"Added user: {user}")


@app.route("/games/api/changeHighScore", methods=['GET'])
def changeHighScore():
    dictionary = request.values.dicts[0].to_dict()
    username = dictionary['username']
    highScore = dictionary['highScore']
    user = game_user.query.filter_by(username=username).one_or_404()
    user.high_score = highScore
    try:
        db.session.commit()
    except:
        db.session.rollback()
    print(f"Changed user high score: {username, highScore}")


@app.route("/games/api/createGameRecord", methods=['GET'])
def createGameRecord():
    print(request)
    print("create leaderboard entry starting")
    dictionary = request.values.dicts[0].to_dict()
    game = dictionary["game"]
    level_time_record = dictionary['levelTimeRecord']
    level = dictionary['level']
    level_high_score = dictionary['levelHighScore']
    game_record2 = game_record()
    game_record2.game = game
    game_record2.levelTimeRecord = level_time_record
    game_record2.levelHighScore = level_high_score
    game_record2.level = level
    try:
        db.session.add(game_record2)
        db.session.commit()
    except:
        db.session.rollback()
    print(f"createGameRecord : {game_record2}")
    return jsonify({"createGameRecord: ": [game_record.game, game_record.levelTimeRecord, game_record.levelHighScore,
                                           game_record.level]})


@app.route("/games/api/getGameRecord", methods=['GET'])
def getGameRecord():
    dictionary = request.values.dicts[0].to_dict()
    #print(dictionary)
    game = 'travelingSalesman'
    game_records = game_record.query.all()
    selection_ = []
    for record_entry in game_records:
        #print("RETRIEVED RECORD_ENTRY", record_entry)
        if record_entry.game.lower() == game.lower():
            dictionary_parse = {"game": record_entry.game, "id3": record_entry.id3,
                                "levelHighScore": record_entry.levelHighScore, "levelTimeRecord": record_entry.levelTimeRecord, "level": record_entry.level}
            print("RETRIEVED LEADERBOARD ENTRIES ON SERVER: ", dictionary_parse)
            if record_entry.game.lower() == game.lower():
                selection_.append(dictionary_parse)
    selection = selection_
    #print(selection)

    return jsonify(selection)


"""
class GameRecord(db.Model):
    game = db.Column(db.String, primary_key=True)
    level = db.Column(db.Integer, unique=True)
    level_high_score = db.Column(db.Integer)
    level_time_record = db.Column(db.Integer)  # milliseconds


"""


@app.route("/games/api/createLeaderboardEntry", methods=['GET'])
def createLeaderboardEntry():
    print(request)
    print("create leaderboard entry starting")

    dictionary = request.values.dicts[0].to_dict()
    #print(dictionary)
    print(request.query_string.decode("utf-8"))
    game = dictionary["game"]
    username = dictionary["username"]
    highScore = dictionary["highScore"]
    ogLeaderboard = leaderboard_entry.query.filter_by(username=username).all()
    userScores = [] # already in server
    for leaderboard_entry_ in ogLeaderboard:
        print("OG ogLeaderboard!", ogLeaderboard)
        print(leaderboard_entry_.username, leaderboard_entry_.highScore, leaderboard_entry_.game)
        if leaderboard_entry_.game.lower() == GAME_NAME.lower():
            userScores.append(leaderboard_entry_.highScore)
    print(game, username, highScore)
    leaderboard_entry2 = leaderboard_entry()
    leaderboard_entry2.game = game
    leaderboard_entry2.username = username
    leaderboard_entry2.highScore = highScore
    leaderboard_entry2.id3 = dictionary["id3"]
    if len(userScores) > 0:
        if max(userScores) < highScore:

            db.session.add(leaderboard_entry2)
            db.session.commit()
            print(f"Created leaderboard entry : {leaderboard_entry2}")
            return jsonify(
                {"LEADERBOARD_ENTRY: ": [leaderboard_entry2.game, leaderboard_entry2.username, leaderboard_entry2.highScore]})
    else:
        return jsonify("NOTHING UPDATED. HIGH SCORE TOO LOW.")

"""


class User(db.Model):
    id_ = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    high_score = db.Column(db.Integer)


class GameRecords(db.Model):
    name = db.Column(db.String, primary_key=True)
    level = db.Column(db.Integer, unique=True)
    level_high_score = db.Column(db.integer)
    level_time_record = db.Column(db.integer)  # milliseconds


class LeaderboardEntry(db.Model):
    name = db.Column(db.String, primary_key=True)
    username = db.Column(db.String)
    score = db.Column(db.Integer)



"""


word_url = 'https://itoven-ai.co/images/words.txt'
word_request = requests.get(word_url, allow_redirects=True)


def getRandomWord():
    return random.choice(word_request.text.split("\n"))


def getRandomName():
    word = getRandomWord()
    number = random.randrange(99999)
    return "".join(x for x in list(f"{word}"+str(number)))


def populate():

    import random
    randomUsers = [None for x in range(112) if x]  # Generate array with 112 spots
    randomUsers = [{"username": getRandomName(), "highScore": random.randrange(500, 5000),
                    "id3": random.randrange(1000000, 9999999), "game": GAME_NAME} for x in randomUsers if not x]
    #print(randomUsers, len(randomUsers), "okay randomUsers here u go")


    randomGameRecords = [None for x in range(1162) if x]  # Generate array with 112 spots
    randomGameRecords = [{"levelHighScore": random.randrange(1040, 5040),
                    "levelTimeRecord": random.randrange(5530, 99999), "game": GAME_NAME, "level": random.randrange(0, 58), "id3": random.randrange(111111, 999999)} for x in randomGameRecords if not x]
    randomLeaderboardEntries = [None for x in range(1122) if x]  # Generate array with 112 spots
    randomLeaderboardEntries = [{"username": getRandomName(), "highScore": random.randrange(500, 5000),
                    "id3": random.randrange(1000000, 9999999), "game": GAME_NAME} for x in randomLeaderboardEntries if not x]
    #print(randomLeaderboardEntries, len(randomLeaderboardEntries), "okay randomLeaderboardEntries here u go")

    for rlbe in randomLeaderboardEntries:
            #print(rlbe)
            id3 = rlbe['id3']
            game = rlbe['game']
            username = rlbe['username']
            highScore = rlbe['highScore']
            rlbe = leaderboard_entry(
                id3=id3,
                username=username,
                highScore=highScore,
                game=game
            )
            with app.app_context():
                db.session.add(rlbe)
                db.session.commit()
                print(f"Added leaderboardEntry: {rlbe}")
                print(jsonify(f"Added leaderboardEntry: {rlbe}"))


    for user in randomUsers:
            print(user)
            id3 = user['id3']
            game = user['game']
            username = user['username']
            highScore = user['highScore']
            rlbe = game_user(
                id3=id3,
                username=username,
                highScore=highScore,
                game=game
            )
            with app.app_context():
                db.session.add(rlbe)
                db.session.commit()
                print(f"Added user: {rlbe}")
                print(jsonify(f"Added user: {rlbe}"))

    for rgr in randomGameRecords:
            #print(rgr)
            level = rgr['level']
            levelTimeRecord = rgr['levelTimeRecord']
            game = rgr['game']
            id3 = rgr["id3"]
            levelHighScore = rgr['levelHighScore']
            rgr = game_record(
                levelHighScore=levelHighScore/10*level*20,
                level=level,
                levelTimeRecord=levelTimeRecord,
                game=game,
                id3=id3
            )
            with app.app_context():
                try:
                    db.session.add(rgr)
                    db.session.commit()

                    print(f"Added randomGameRecords: {rgr}")
                    print(jsonify(f"Added randomGameRecords: {rgr}"))
                except:
                    pass

#populate() # Already populated tho
