var dotWindow = document.querySelector('canvas#dotWindow'); // Reference to main canvas element
const pointsSlider = document.querySelector('#pointsRange'); // Reference to main canvas element
const dotInfoWindow = document.querySelector('canvas#dotInfoWindow'); // Reference to main canvas element
const distanceBox = document.querySelector('p#distanceBox'); // Reference to main canvas element

const c = dotWindow.getContext("2d"); // 2 Dimensional Space
const gw = document.querySelector("#gameWindow");
const gb = document.querySelector("#Gameboard");
gw.height = window.height;
gw.width = window.width;
dotWindow.height = gw.height/1.8;
dotWindow.width = gw.width/2;

const GAME_NAME = "travelingSalesman";
const BASE_URL1 = "http://127.0.0.1:3000/games";
const BASE_URL2 = "http://portal.itoven-ai.co/games";
var BASE_URL = BASE_URL1;

function getTimeDelta(x) {
    //console.log(Date.now()-x,
    // " ms passed since interval.");
    return Date.now() - x;
}



document.querySelector("#titleBox").style.padding = "1rem";
gw.parentElement.style.backgroundColor = "black";
let element0s = gw.children;
for (let i = 0; i < element0s.length; i++) {
    element0s[i].style.color = "white";
    element0s[i].style.fontFamily = "futura";
    element0s[i].style.fontWeight = "bold";


}
let element1s = gb.children;
for (let i = 0; i < element1s.length; i++) {
    element1s[i].style.color = "black";
}


dotWindow.style.backgroundColor = "white";


//dotInfoWindow.height = window.innerHeight/2; // Main Container Boundary
const MAXLEVEL = 1000;
const gridSize = 100; // Number of grid units total
var savedCanvas;
const ctx = dotWindow.getContext("2d");

function disableElementVisibility(id_) {
    var x = document.getElementById(id_);
    x.style.display = "none";
}
hideGameButtons();
class Point {
    constructor(position) {
        this.position = position;
        this.visited = false;
    }
}

// new Point({x: 12, y: 20});

function distanceFormula(point1, point2) {
    return Math.sqrt(Math.pow(Math.abs(point1.position.x - point2.position.x), 2) + Math.pow(Math.abs(point1.position.y - point2.position.y), 2));
}

class Connection_ { // Describes a connection between two points
    constructor(startPoint, endPoint) {
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.distance = distanceFormula(endPoint, startPoint);
    }

}
//'1.\n\nArthurISTHEBEST\n\n36,501'


function lambdaHighScoreSort(a, b) {
    return b.highScore > a.highScore ?  1 // if b should come earlier, push a to end
         : b.highScore < a.highScore ? -1 // if b should come later, push a to begin
         : 0;
}


//'\n\t\t\t\t\t<p class="ranknumber">1.</p>\n\t\t\t\t\t<p class="rankname">ArthurISTHEBEST</p>\n\t\t\t\t\t<p class="rankscore">36,501</p>\n\n\t\t\t\t'

function leaderboardHTML(name, rank, score) {
    var c1 = "<div style='overflow-y: scroll; display: inline-flex;' id='row"+score.toString()+"'" + ">"
    var rankP = "<p class='ranknumber' id='row"+score.toString()+"p'" + ">" + (rank+1).toString() + "." + "</p>";
    return c1 + rankP + '<p class="rankname" style="min-width: 140px; max-width: 140px;">' + name + '</p>' + '<p class="rankscore" style="min-width: 70px; max-width: 70px;">' + score.toString() + '</p></div>'
}

async function activePeriods(elementID="#puristicLeaderboard", text="FETCHING LEADERBOARD") {
    document.querySelector("#puristicLeaderboard").innerText = text;
    await sleep(1000);
    document.querySelector("#puristicLeaderboard").innerText += ".";
    await sleep(1000);
    document.querySelector("#puristicLeaderboard").innerText += ".";
    await sleep(1000);
    document.querySelector("#puristicLeaderboard").innerText += ".";
    await sleep(1000);
    document.querySelector("#puristicLeaderboard").innerHTML = "";

}


async function fillLeaderBoard() {
    var leaderboard_entries = await getLeaderboardEntries(game = GAME_NAME);
    console.log("ENTER FILL LEADERBOARD");
    //await activePeriods();
    console.log(leaderboard_entries);
    '\n\t\t\t\t\t<p class="ranknumber">1.</p>\n\t\t\t\t\t<p class="rankname">ArthurISTHEBEST</p>\n\t\t\t\t\t<p class="rankscore">36,501</p>\n\n\t\t\t\t'
    document.querySelector("#puristicLeaderboard").style.maxHeight = dotWindow.height;
    var leaderboardHTML_ = ''
    var leaderboard_entries_array = [];
    console.log("BEFORE SORT", leaderboard_entries);
    leaderboard_entries.sort(lambdaHighScoreSort);
    console.log("AFTER SORT", leaderboard_entries);

    for (let l = 0; l < leaderboard_entries.length; l++) {
        var leaderboard_entry = leaderboard_entries[l];
        var game_ = leaderboard_entry.game;
        var username_ = leaderboard_entry.username;
        var highScore = leaderboard_entry.highScore;
        var id3 = leaderboard_entry.id3;
        leaderboard_entries_array.push({"id3": id3, "highScore": highScore, "game": game_, "username": username_});
    }

    for (let l = 0; l < leaderboard_entries.length; l++) {
        var leaderboard_entry = leaderboard_entries_array[l];
        var game_ = leaderboard_entry.game;
        var username_ = leaderboard_entry.username;
        var highScore = leaderboard_entry.highScore;
        var id3 = leaderboard_entry.id3;
        leaderboardHTML_ += leaderboardHTML(username_, l, highScore);

    }
    document.querySelector("#puristicLeaderboard").innerHTML = leaderboardHTML_;
}



function getPoints(connection) {
    x1 = connection.startPoint.position.x;
    x2 = connection.endPoint.position.x;
    y1 = connection.startPoint.position.y;
    y2 = connection.endPoint.position.y;

    var points = [];

    if (y2 <= y1) {
        y11 = y1;
        y1 = y2;
        y2 = y11;
    }

    if (x2 <= x1) {
        x11 = x1;
        x1 = x2;
        x2 = x11;
    }

    for (let x = x1; x < x2; x++) {
        for (let y = y1; y < y2; y++) {
            points.push(new Point({
                x: x,
                y: y
            }));
        }
    }

    return points;

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function randInt(max) {
    return Math.floor(Math.random() * max);
}

class Connection { // Describes a connection between two points
    constructor(connection) {
        this.startPoint = connection.startPoint;
        this.endPoint = connection.endPoint;
        this.distance = connection.distance;
        this.points = getPoints(connection);
    }
}

points = [];

async function drawTarget(pointA) {

    //console.log("Drawing target by itself...");


    X = pointA.position.x * dotWindow.width / gridSize;
    Y = pointA.position.y * dotWindow.height / gridSize;

    var stroke = gsm.currentColors[points.indexOf(pointA)];

    var R = 10;

    c.strokeStyle = stroke;
    c.beginPath();
    c.arc(X, Y, R, 0, 2 * Math.PI, false);
    c.lineWidth = 3;
    c.stroke();
    c.fillStyle = stroke;
    c.fill();

}

class GameStateManager {
    constructor() {
        this.totalPathDistance = 0;
        this.userPath = [];
        this.userPathDistance = 0;
        this.mode = "auto"; // Other mode: "game"
        this.level = 0;
        this.arrayCombinations = [];
        this.connections = [];
        this.points = [];
        this.closestPoint = null;
        this.canvai = null;
        this.closestPoints = [];
        this.currentColors = [];
        this.inceptionTime = Date.now();
        this.connections = [];
        this.levelTime = 0;
        this.nestedPaths = [];
        this.shortestPath = [];
        this.username = "guestman32951515";
        this.totalScore = 0;
        this.levelScores = [];
        this.possiblePathDistances = [];
        this.currentMousePosition = new Point({
            x: 0,
            y: 0
        });
        this.closestConnection = null;
    }
}
//console.log(Date.now());
gsm = new GameStateManager();

async function pointInConnection(point, connection) {
    rectangle_ = document.querySelector("#dotWindow").getBoundingClientRect();
    var minX = rectangle_.x;
    var maxX = rectangle_.x + rectangle_.width;
    var minY = rectangle_.y;
    var maxY = rectangle_.y + rectangle_.height;
    var px = point.position.x;
    var py = point.position.y;
    var minConX = Math.min(connection.startPoint.position.x, connection.endPoint.position.x);
    var maxConX = Math.max(connection.startPoint.position.x, connection.endPoint.position.x);
    var minConY = Math.min(connection.startPoint.position.y, connection.endPoint.position.y);
    var maxConY = Math.max(connection.startPoint.position.y, connection.endPoint.position.y);
    if (minConX <= px && maxConX >= px) {
        if (minConY <= py && maxConY >= py) {
            return true;
        }
    }
    return false;
}
async function connectTargets() {
    connections__ = [];
    colors2_ = [];
    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < points.length; j++) {
            if (i != j) {
                connection = new Connection_(points[i], points[j]);
                connections__.push(connection);
                colors2_.push("#" + randInt(9) + randInt(9) + randInt(9) + randInt(9) + randInt(9) + '0');
            }
        }
    }
    gsm.currentColors = colors2_;
    gsm.connections = connections__;

    //console.log("Connections were established, now turning into elements.");

}

async function buildColorSet() {
    var colors2 = [];
    if (gsm.mode == "game") {
        for (let i = 0; i < gsm.connections.length; i++) {
            var stroked = "#" + randInt(9) + randInt(9) + randInt(9) + randInt(9) + randInt(9) + '0';
            colors2.push(stroked);
        }
        gsm.currentColors = colors2;
    }
}

function getMidPoint(startPoint, endPoint) {
    // Point.position.x/y
    var startX = startPoint.position.x;
    var startY = startPoint.position.y;
    var endX = endPoint.position.x;
    var endY = endPoint.position.y;
    var avgX = (Math.max(startX, endX) - Math.min(startX, endX)) / 2 + Math.min(startX, endX);
    var avgY = (Math.max(startY, endY) - Math.min(startY, endY)) / 2 + Math.min(startY, endY);
    return new Point({
        x: avgX,
        y: avgY
    });
}

function clearLines() {
    c.clearRect(0, 0, dotWindow.width, dotWindow.height);
}
async function drawTempLineBetweenPoints(connection, stroke = false) {
    X = connection.startPoint.position.x * dotWindow.width / gridSize;
    Y = connection.startPoint.position.y * dotWindow.height / gridSize;
    X2 = connection.endPoint.position.x * dotWindow.width / gridSize;
    Y2 = connection.endPoint.position.y * dotWindow.height / gridSize;
    c.beginPath();
    c.moveTo(X, Y);
    c.lineTo(X2, Y2);
    if (!(stroke)) {
        var stroked = "#" + randInt(9) + randInt(9) + randInt(9) + randInt(9) + randInt(9) + '0';
        c.strokeStyle = stroked;
    } else {
        c.strokeStyle = stroke;
    }
    c.stroke();

}


async function drawLineBetweenPoints(startPoint, endPoint, stroke = false) {
    X = startPoint.position.x * dotWindow.width / gridSize;
    Y = startPoint.position.y * dotWindow.height / gridSize;
    X2 = endPoint.position.x * dotWindow.width / gridSize;
    Y2 = endPoint.position.y * dotWindow.height / gridSize;
    c.beginPath();
    c.moveTo(X, Y);
    c.lineTo(X2, Y2);
    if (!(stroke)) {
        var stroked = "#" + randInt(9) + randInt(9) + randInt(9) + randInt(9) + randInt(9) + '0';
        c.strokeStyle = stroked;
    } else {
        c.strokeStyle = stroke;
    }
    c.stroke();
}

function isInsideBounds(element_, point) {
    rectangle_ = element_.getBoundingClientRect();
    var minX = rectangle_.x;
    var maxX = rectangle_.x + rectangle_.width;
    var minY = rectangle_.y;
    var maxY = rectangle_.y + rectangle_.height;
    if (point.position.x <= maxX && point.position.x >= minX) {
        if (point.position.y <= maxY && point.position.y >= minY) {
            return true;
        }
    }
    return false;
}

ctx.lineWidth = 165;

async function drawBoard() {
    c.beginPath();
    c.beginPath();
    c.lineWidth = 1;
    c.lineWidth = 1;
    c.strokeStyle = "#D3D3D3";
    c.strokeStyle = "#D3D3D3";
    var p = 10;
    for (var x = 0; x <= dotWindow.width; x += dotWindow.width / 10) {
        c.moveTo(x + p, p);
        c.lineTo(x + p, dotWindow.height + p);
        c.stroke();
    }

    for (var x = 0; x <= dotWindow.height; x += dotWindow.width / 10) {
        c.moveTo(p, x + p);
        c.lineTo(dotWindow.width + p, x + p);
        c.stroke();
    }

}

function pointToStr(point_) {
    return "(" + closestPoint.position.x + ", " + closestPoint.position.x + ")";
}

function pointsToStr() {
    return points.map(pointToStr);
}

function getHelp() { // Show modal
    document.querySelector("#modalHelpGuide").show();
}

function hideHelp() { // Show modal
    document.querySelector("#modalHelpGuide").close();
}

function mouseToGridPos(mousePos) {
    rectangle_ = document.querySelector("#dotWindow").getBoundingClientRect();
    var minX = rectangle_.x;
    var maxX = rectangle_.x + rectangle_.width;
    var minY = rectangle_.y;
    var maxY = rectangle_.y + rectangle_.height;
    var px = ((mousePos.position.x - minX) / dotWindow.width) * gridSize;
    var py = ((mousePos.position.y - minY) / dotWindow.height) * gridSize;

    return new Point({
        x: px,
        y: py
    });
}

async function getNearestPoint(PointA) {

    if (PointA != null) {
        var ax = PointA.position.x;
        var ay = PointA.position.y;
        var closestDeltaDistance = gridSize;
        var closestPoint = points[0];
        for (p = 0; p < points.length; p++) {
            var distanceTo = distanceFormula(PointA, points[p]);
            if (closestDeltaDistance >= distanceTo) {
                closestDeltaDistance = distanceTo;
                closestPoint = points[p];
            }
        }
        gsm.closestPoint = closestPoint;
        if (closestPoint != null) {
            document.querySelector("#nearestPointBox").innerText = "(" + closestPoint.position.x + ", " + closestPoint.position.y + ")";
        }
        return closestPoint;
    }
}




async function drawNearestConnections(mp) {
    var pointo = await getNearestPoint(mp);
    var remainingConns = await getRemainingConnectionsWithPoint(pointo);
    var points3 = getPointsFromConnections(remainingConns);
    points3.sort(sortPointsByDistanceLambda);
    var nearestPointBridge = [points3[0], points3[1]];
    gsm.closestConnection = await getClosestConnection(pointo);
    //console.log(remainingConns);
    // Use event.pageX / event.pageY here




    rectangle_ = document.querySelector('#dotWindow').getBoundingClientRect();
    var minX = rectangle_.x;
    var maxX = rectangle_.x + rectangle_.width;
    var minY = rectangle_.y;
    var maxY = rectangle_.y + rectangle_.height;
    var px = ((mp.position.x - minX) / dotWindow.width) * gridSize;
    var py = ((mp.position.y - minY) / dotWindow.height) * gridSize;

    for (let i = 0; i < remainingConns.length; i++) {
        var strokey = gsm.currentColors[gsm.connections.indexOf(remainingConns[i])];

        await drawTempLineBetweenPoints(remainingConns[i], strokey);


    }
}

function colorMorphTitle() {
    var color1 = "#af"+ randInt(9).toString()+ randInt(9).toString() + randInt(9).toString() + randInt(9).toString();
    var color2 = "#f0b" + randInt(9).toString() + randInt(9).toString() + randInt(9).toString();
    var gradient = "linear-gradient(" + randInt(10, 99).toString() +  "deg, " + color1 + ", " + color2 + ")";
    console.log(gradient);
    document.querySelector("#titleBox").style.backgroundImage = gradient;
}

document.onmousemove = handleMouseMove;


async function handleMouseMove(event) {

    if (gsm.mode == "game" && !lvlMgr.levelSolved) {

        var eventDoc, doc, body;

        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
                (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
                (doc && doc.scrollTop || body && body.scrollTop || 0) -
                (doc && doc.clientTop || body && body.clientTop || 0);
        }

        var np = new Point({
            x: event.pageX,
            y: event.pageY
        })
        gsm.currentMousePosition = np;
        if (isInsideBounds(dotWindow, np)) {

            var mp = mouseToGridPos(np); // Mouse Position

            var currentMousePosition = np;
            var newConn = await getClosestConnectionPoint(mp)
            var oldConn = gsm.closestConnection;
            gsm.closestConnection = newConn;
            //await drawNearestConnections(mp);
            if (gsm.closestConnection != null) {


                if (pointInConnection(mp, gsm.closestConnection)) {
                    if (oldConn != newConn) {
                        clearLines();
                        drawBoard();
                        lvlMgr.reloadTargets();
                        if (!gsm.userPath.includes(gsm.closestConnection)) {
                            await drawTempClosestConnection();
                        }
                    }
                }
            }
        }
        var pointo = await getNearestPoint(mouseToGridPos(gsm.currentMousePosition));
        await drawUserPath();
        return gsm.currentMousePosition;

    }

}



function buildTableData(rowTuples) {
    var contained = "";

    for (var i = 0; i < rowTuples.length; i++) {
        var texto = '<div style="display:inline-flex; overflow-y:auto;"' + contained + '<p>';
        contained += rowTuples[i][0];
        contained += "</p>";
        contained += '<p style="padding-left: 2rem;">';
        contained += "Single Leg Distance: " + rowTuples[i][1].toString();
        contained += "</p>" + "</div>";
    }


    return '<div id="simulatedTableVisits">' + contained + '</div>';
    //tablearea.appendChild(table);
}



function hideGameButtons() {
    disableElementVisibility("startButton");
    disableElementVisibility("nearestPointContainer");
    disableElementVisibility("exposeConnections");
    disableElementVisibility("PointsContainer");
    disableElementVisibility("trackSection");
    disableElementVisibility("trackSecTable");
    disableElementVisibility("restartLevel");
    disableElementVisibility("helpButton");
    disableElementVisibility("mouseContainer");
}

function sortPointsByDistanceLambda(a, b) {
    if (distanceFormula(a, gsm.closestPoint) > distanceFormula(b, gsm.closestPoint)) {
        return -1;
    }
    if (distanceFormula(a, gsm.closestPoint) < distanceFormula(b, gsm.closestPoint)) {
        return 1;
    }
    // a must be equal to b
    return 0;
}

function sortPointsByDistanceLambdaGroup(a, b) {
    if (distanceFormula(a, gsm.closestPoint) > distanceFormula(b, gsm.closestPoint)) {
        return -1;
    }
    if (distanceFormula(a, gsm.closestPoint) < distanceFormula(b, gsm.closestPoint)) {
        return 1;
    }
    // a must be equal to b
    return 0;
}



function sortNearestPoints() {
    gsm.closestPoints =
        gsm.closestPoints.sort(sortPointsByDistanceLambda);
}



async function drawTempClosestConnection() {
    await sleep(50);
    var mp = mouseToGridPos(gsm.currentMousePosition);
    gsm.closestConnection = await getClosestConnectionPoint(mp);
    if (gsm.closestConnection != null) {
        drawTempLineBetweenPoints(gsm.closestConnection, gsm.currentColors[points.indexOf(gsm.closestConnection.startPoint)]);
        drawTarget(gsm.closestConnection.endPoint);

    }
}

function handleMouseClover() { // Click Hover
    gsm.canvai = dotWindow; // Save current state of canvas
    //drawTempLineBetweenPoints(gsm.closestConnection.startPoint, gsm.closestConnection.endPoint);
    for (let i = 0; i < gsm.connections.length; i++) {
        drawTempLineBetweenPoints(gsm.connections[i], stroke = gsm.currentColors[i]);
        drawTarget(gsm.connections[i].endPoint);

    }
}

function getPointsFromConnections(connections) {
    var points3 = [];
    for (let c = 0; c < connections.length; c++) {
        if (!(points3.includes(connections[c].startPoint))) {
            points3.push(connections[c].startPoint);
        }
        if (!(points3.includes(connections[c].endPoint))) {
            points3.push(connections[c].endPoint);
        }
    }

    points3.sort(sortPointsByDistanceLambda);
    return points3;

}



async function getRemainingConnectionsWithPoint(pointA, pointType = "start") {
    var pointsFilt = [];
    if (pointType == "start") {
        for (let p = 0; p < gsm.connections.length; p++) {
            if (gsm.connections[p].startPoint.position == pointA.position) {
                pointsFilt.push(gsm.connections[p]);
            }
        }
    } else if (pointType == "all") {
        for (let p = 0; p < points.length; p++) {
            if (gsm.connections[p].startPoint.position == pointA.position || gsm.connections[p].endPoint.position == pointA.position) {
                pointsFilt.push(gsm.connections[p]);
            }
        }
    } else if (pointType == "end") {
        for (let p = 0; p < points.length; p++) {
            if (gsm.connections[p].endPoint.position == pointA.position) {
                pointsFilt.push(gsm.connections[p]);
            }
        }
    }
    return pointsFilt;
}



async function getClosestConnections(pointA) {
    var conns = await getConnectionsWithPoint(pointA, "start");
    var conns2 = [];
    for (let c = 0; c < conns.length; c++) {
        if (!(gsm.userPath.includes(conns[c]))) {
            conns2.push(conns[c]);
        }
    }
    return conns2;
}


async function getClosestConnection(x, y) {

    let compPos = new Point({
        x: x,
        y: y
    });
    var closestConnection = null;
    var distanceTo_ = 99999999;
    var closestDeltaDistance = distanceTo_;
    for (let c = 0; c < gsm.connections.length; c++) {
        if (c != 0 && (c * 2 == gsm.userPath.length + 1)) { //console.log("SEA BRAIN"); return null}
            var midPoint = getMidPoint(gsm.connections[c].startPoint, gsm.connections[c].endPoint);
            var distanceTo = distanceFormula(midPoint, compPos);
            if (distanceTo < closestDeltaDistance) {
                closestDeltaDistance = distanceTo;
                closestConnection = gsm.connections[c];

            }
        }
        rectangle_ = document.getElementById("dotWindow").getBoundingClientRect();
        var minX = rectangle_.x;
        var maxX = rectangle_.x + rectangle_.width;
        var minY = rectangle_.y;
        var maxY = rectangle_.y + rectangle_.height;
        var px = ((gsm.currentMousePosition.position.x - minX) / dotWindow.width) * gridSize;
        var py = ((gsm.currentMousePosition.position.y - minY) / dotWindow.height) * gridSize;
        var mp1 = gsm.currentMousePosition.position.x;
        document.querySelector("#mousePosBox").innerText = "Mouse Position: (" + (px.toFixed(2)).toString() + ", " + (py.toFixed(2)).toString() + ")";
        return closestConnection;

    }
}


function filterByVisited(item) {
    if (!gsm.userPath.includes(item)) {
        return true;
    }
    return false;
}

async function getClosestConnectionPoint(compPos) {
    var closestConnection = null;
    var distanceTo_ = 99999999;
    var closestDeltaDistance = distanceTo_;
    let cacheConns = gsm.connections;
    gsm.connections = cacheConns.filter(filterByVisited);
    for (let c = 0; c < gsm.connections.length; c++) {
        var midPoint = getMidPoint(gsm.connections[c].startPoint, gsm.connections[c].endPoint);
        var distanceTo = distanceFormula(midPoint, compPos);
        if (distanceTo < closestDeltaDistance) {
            closestDeltaDistance = distanceTo;
            closestConnection = gsm.connections[c];
        }
    }
    rectangle_ = document.getElementById("dotWindow").getBoundingClientRect();
    var minX = rectangle_.x;
    var maxX = rectangle_.x + rectangle_.width;
    var minY = rectangle_.y;
    var maxY = rectangle_.y + rectangle_.height;
    var px = ((gsm.currentMousePosition.position.x - minX) / dotWindow.width) * gridSize;
    var py = ((gsm.currentMousePosition.position.y - minY) / dotWindow.height) * gridSize;
    var mp1 = gsm.currentMousePosition.position.x;
    document.querySelector("#mousePosBox").innerText = "Mouse Position: (" + (px.toFixed(2)).toString() + ", " + (py.toFixed(2)).toString() + ")";
    gsm.connections = cacheConns;
    return closestConnection;

}

function generatePoints(count) {
    points = [];
    let spatialModifier = 4;
    for (let c = 0; c < count; c++) {
        points.push(new Point({
            x: randInt(gridSize - spatialModifier * 2) + spatialModifier,
            y: randInt(gridSize - spatialModifier * 3) + spatialModifier
        }));
    }

    return points;
}




c.fillStyle = "#FF0000";


var quadrants = [];
var lines = [];

function isInQuadrant(point, quadrantOrigin, radius) {

    var maxY = quadrantOrigin.position.y + radius;
    var minY = quadrantOrigin.position.y - radius;
    var maxX = quadrantOrigin.position.x + radius;
    var minX = quadrantOrigin.position.x - radius;

    if (point.position.x <= maxX && point.position.x >= minX) {
        if (point.position.y <= maxY && point.position.y >= minY) {
            return true;
        }
    }

    return false;

}


function hasNeighbors(point, points) {
    var n = 0;
    var radius = 6; // Defining distance of neigbor
    points = points.filter(item => item !== point)
    for (let i = 0; i < points.length; i++) {
        if (isInQuadrant(point, points[i], radius)) {
            n++;
        }
    }
    return n;
}


async function drawTargets(pointsToDraw, pts = false, colors = false) {
    updatePointCount2();
    colors2 = [];
    if (pts) {
        points = pts;
    } else {
        points = generatePoints(pointsToDraw);
    }
    for (let i = 0; i < points.length; i++) {
        X = points[i].position.x * dotWindow.width / gridSize;
        Y = points[i].position.y * dotWindow.height / gridSize;

        var stroke = '#FF' + randInt(9) + randInt(9) + randInt(9) + '0';
        if (colors) {
            stroke = colors[i];
        } else {
            colors2.push(stroke);
        }
        var R = 10;

        c.strokeStyle = stroke;
        quadrants.push(new Point({
            x: X,
            y: Y
        }));
        c.beginPath();
        c.arc(X, Y, R, 0, 2 * Math.PI, false);
        c.lineWidth = 3;
        c.stroke();
        c.fillStyle = stroke;
        c.fill();

    }
    if (!(colors)) {
        gsm.currentColors = colors2;
    }

}

var slideElem = document.getElementById("pointsRange");

slideElem.addEventListener("change", event => {
    updatePointCount2();
});

function showGameButtons() {
    enableElementVisibility("trackSection");
    enableElementVisibility("exposeConnections");
    enableElementVisibility("trackSecTable");
    enableElementVisibility("nearestPointContainer");
    enableElementVisibility("nearestPointContainer");
    enableElementVisibility("PointsContainer");
    enableElementVisibility("helpButton");
    enableElementVisibility("restartLevel");
    enableElementVisibility("mouseContainer");
}

function updatePointCount2() {
    document.querySelector("#pointsBox2").innerText = pointsSlider.value.toString();
}


async function pathFromConnectionArray(connectionArray) {
    var pointCollection = [];
    for (let i = 0; i < connectionArray.length; i++) {
        if (!(pointCollection.includes(connectionArray[i].startPoint))) {
            pointCollection.push(connectionArray[i].startPoint);
        }
        if (!(pointCollection.includes(connectionArray[i].endPoint))) {
            pointCollection.push(connectionArray[i].endPoint);
        }
    }
    return pointCollection;

}


class pointNode {
    constructor(head) {
        this.head = head;
        this.next = null;
    }
}

async function buildPointNodes(path_) {
    var nodeList = [];
    for (var n = 0; n < path_.length; n++) {
        nodeList.push(new pointNode(path_[n]));
    }
    for (let c = 0; c < nodeList.length; c++) {
        if (c < nodeList.length - 1) {
            nodeList[c].next = nodeList[c + 1];
        }
    }
    return nodeList;
}


function sortNumbers(a, b) {
    //console.log(a, b, a>b);
    if (a > b) {
        return 1;
    }
    if (a < b) {
        return -1;
    }
    return 0;
}




async function calculatePathDistance(pathNodes) {
    var totalDistance = 0;
    //console.log(pathNodes, "path Nodes 766");
    for (let p = 0; p < pathNodes.length; p++) {
        if (pathNodes[p].head != null) {
            if (pathNodes[p].next != null) {
                distanceTo = distanceFormula(pathNodes[p].head, pathNodes[p].next.head);
                totalDistance += distanceTo;

            }
        }
    }
    if (totalDistance) {
        if (!gsm.possiblePathDistances.includes(totalDistance)) {
            gsm.possiblePathDistances.push(totalDistance);

        }
    }
    return totalDistance;
}

async function sortConnectionArrayDistanceMapLambda(a, b) {
    // Takes two connection objects
    //console.log(a, b, "704");
    var path1 = await pathFromConnectionArray(a);
    var path2 = await pathFromConnectionArray(b);
    var distanceP1 = await calculatePathDistance(await buildPointNodes(path1));
    var distanceP2 = await calculatePathDistance(await buildPointNodes(path2));
    //console.log(distanceP1, distanceP2, distanceP1>distanceP2, "791");
    if (distanceP1 > distanceP2) {
        return 1;
    }
    if (distanceP1 < distanceP2) {
        return -1;
    }
    return 0;
}



async function sortPathArrayDistanceMapLambda(a, b) {
    // Takes two point (path) array objects
    //console.log(a, b, "804 initial arg sortpath array");

    var distanceP1 = await calculatePathDistance(a);
    var distanceP2 = await calculatePathDistance(b);
    //console.log(distanceP1, distanceP2, distanceP1>distanceP2, "808");
    if (distanceP1 > distanceP2) {
        return 1;
    }
    if (distanceP1 < distanceP2) {
        return -1;
    }
    return 0;
}

async function buildPointNodes2(uipathnodes) {
    var nodes_ = [];
    for (let u = 0; u < uipathnodes.length; u++) {
        nodes_.push(new pointNode(uipathnodes[u]));
    }
    for (let c = 0; c < nodes_.length; c++) {
        if (c < nodes_.length - 1) {
            nodes_[c].next = nodes_[c + 1];
        }
    }
    return nodes_;
}



async function convertPathsToNodes(uipaths) {
    var nest = [];
    for (let u = 0; u < uipaths.length; u++) {
        nest.push(await buildPointNodes2(uipaths[u]));
    }
    return nest;

}

async function lambdaPathDistanceSort(a, b) {
    if (await calculatePathDistance(a) < await (calculatePathDistance(b))) {
        return 1;
    }
    if (await calculatePathDistance(a) > await (calculatePathDistance(b))) {
        return -1;
    }
    return 0;
}

class Path {
    constructor(path, dist) {
        this.path = path; // Array of nodes terminated by null
        this.distance = dist;
    }
}


async function convertConnectionsToNodes(connPath) {
    var nodes = [];
    let pfca = await pathFromConnectionArray(connPath);
    let dist = await calculatePathDistance(pfca);
    let na = await buildPointNodes2(pfca);
    return na;
}


async function drawPath(path_, color = false) {
    c.beginPath();
    //console.log(path_, drawPath);
    var counterDistance2 = 0;
    for (let i = 0; i < path_.length - 1; i++) {
        startPoint = path_[i];
        X = startPoint.head.position.x * dotWindow.width / gridSize;
        Y = startPoint.head.position.y * dotWindow.height / gridSize;
        endPoint = path_[i + 1];
        X2 = endPoint.head.position.x * dotWindow.width / gridSize;
        Y2 = endPoint.head.position.y * dotWindow.height / gridSize;
        gsm.possiblePathDistances.sort(sortNumbers);
        counterDistance2 += distanceFormula(new Point({
            x: startPoint.head.position.x,
            y: startPoint.head.position.y
        }), new Point({
            x: endPoint.head.position.x,
            y: endPoint.head.position.y
        }));
        document.querySelector("#distanceBox").innerText = "  " + counterDistance2.toFixed(3);

        //


        c.beginPath();
        c.moveTo(X, Y);
        c.lineTo(X2, Y2);
        if (!color) {
            var stroked = gsm.currentColors[points.indexOf(startPoint)];
        }

        c.strokeStyle = stroked;
        c.stroke();
        if (gsm.possiblePathDistances != null) {
            if (gsm.possiblePathDistances[gsm.possiblePathDistances.length-1] != null) {

                document.querySelector("#distanceBoxPoor").innerText = gsm.possiblePathDistances[gsm.possiblePathDistances.length - 1].toFixed(3);
              }
        }
        if (gsm.shortestDistance != null) {

           document.querySelector("#distanceBoxRich").innerText = gsm.shortestDistance.toFixed(3);
        }



    }

}


async function drawPathSlow(path_, color = false) {
    c.beginPath();

    //console.log(path_, drawPath);
    var counterDistance2 = 0;
    for (let i = 0; i < path_.length - 1; i++) {
        startPoint = path_[i];
        X = startPoint.head.position.x * dotWindow.width / gridSize;
        Y = startPoint.head.position.y * dotWindow.height / gridSize;
        endPoint = path_[i + 1];
        X2 = endPoint.head.position.x * dotWindow.width / gridSize;
        Y2 = endPoint.head.position.y * dotWindow.height / gridSize;
        gsm.possiblePathDistances.sort(sortNumbers);
        counterDistance2 += distanceFormula(new Point({
            x: startPoint.head.position.x,
            y: startPoint.head.position.y
        }), new Point({
            x: endPoint.head.position.x,
            y: endPoint.head.position.y
        }));
        document.querySelector("#distanceBox").innerText = counterDistance2.toFixed(3);
        //
        c.beginPath();
        c.moveTo(X, Y);
        c.lineTo(X2, Y2);
        if (!color) {
            var stroked = gsm.currentColors[points.indexOf(startPoint)];
        }

        c.strokeStyle = stroked;
        c.stroke();
        document.querySelector("#distanceBoxPoor").innerText = gsm.possiblePathDistances[gsm.possiblePathDistances.length - 1].toFixed(3);
        document.querySelector("#distanceBoxRich").innerText = gsm.shortestDistance.toFixed(3);
        await sleep(375);
    }

}

async function findShortestPath(nestedPath) {
    nestedPath.sort(await lambdaPathDistanceSort);
    gsm.shortestPath = nestedPath[0];

    gsm.shortestDistance = await calculatePathDistance(gsm.shortestPath);
    gsm.nestedPaths = nestedPath;
    //console.log(nestedPath, "SHORTEST PATH FOUND");

}

var repeats = 0;
async function solveTargets() {
    if (gsm.mode != "game") {
        colorMorphTitle();
        console.log(gsm);
        console.log(points, "basic points");
        connectTargets();
        var nestedPaths = await convertPathsToNodes(await getArrayCombos((await pathFromConnectionArray(gsm.connections.map((conn) => new Connection(conn))))));

        var cachePaths = nestedPaths;
        //console.log(nestedPaths, "nested Paths solvetargets");
        findShortestPath(nestedPaths); // Assign to GSM...Shortest Point
        await sleep(1090 + 100 * points.length);
        await drawPathSlow(gsm.shortestPath);
        await drawTargets(pointsSlider.value, points);
        document.querySelector("#cpuDistanceValueBox").innerText = gsm.shortestDistance.toFixed(3).toString() + "m";
    }
    else {
        return
    }



    //nestedPaths.map((uninitializedNodes) => uninitializedNodes.sort(sortPathArrayDistanceMapLambda));
    //console.log(nestedPaths, "nested Paths 2 solvetargets");
    //console.log("nestedPaths==cachePaths", nestedPaths==cachePaths);

}


async function solveTargetsInvisible() {
    gsm.possiblePathDistances = [];
    gsm.connections = [];
    console.log(gsm);
    var gameRecords = await getGameRecord(game=GAME_NAME);
    //console.log("BEFORE FILTER", gameRecords)
    var gameRecords2 = await filterByLevel(gameRecords, gsm.level);
    //console.log("AFTER FILTER", gameRecords2)
    var gameRecords = gameRecords2;
    //console.log("BEFORE SORTING", gameRecords)
    gameRecords.sort(lambdaTimeRecordSort);
    var timeRecordObject = gameRecords[0];
    await starblock();

    //console.log(points, "basic points");
    connectTargets();
    var nestedPaths = await convertPathsToNodes(await getArrayCombos((await pathFromConnectionArray(gsm.connections.map((conn) => new Connection(conn))))));

    var cachePaths = nestedPaths;
    //console.log(nestedPaths, "nested Paths solvetargets");
    findShortestPath(nestedPaths); // Assign to GSM...Shortest Point
    document.querySelector("#cpuDistanceValueBox").innerText = gsm.shortestDistance.toFixed(3).toString() + "m";



    //nestedPaths.map((uninitializedNodes) => uninitializedNodes.sort(sortPathArrayDistanceMapLambda));
    //console.log(nestedPaths, "nested Paths 2 solvetargets");
    //console.log("nestedPaths==cachePaths", nestedPaths==cachePaths);

}


function toggleElementVisibility(id_) {
    var x = document.getElementById(id_);
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}



function enableElementVisibility(id_) {
    var x = document.getElementById(id_);
    x.style.display = "block";
}

class levelManager {
    constructor() {
        this.level = gsm.level;
        this.pts = [];
        this.levelSolved = false;
        this.levelScore = 0;
    }

    async saveLevelTargets(points___) {
        this.pts = points___;
    }

    async reloadTargets() {
        points = this.pts;
        var colors_ = gsm.currentColors;
        drawBoard();
        await drawTargets(((Math.pow((this.level / MAXLEVEL), 2) + 3) * 2), points, colors_);

    }

    newLevel(pts = false) {
        enableElementVisibility("mouseContainer");
        enableElementVisibility("mousePosBox");
        this.levelSolved = false;
        levelBoxModal
        document.querySelector("#levelBoxModal").innerText = (gsm.level + 1).toString()
        //console.log("new level caused", this.inceptionTime);
        document.querySelector("#simulatedVisitsTable").innerHTML = "<p></p>";
        if (pts) {
            points = pts;
        } else {
            points = generatePoints((0.32368 * (this.level + 1) * (this.level + 1) + 1));
        }
        c.clearRect(0, 0, dotWindow.width, dotWindow.height);
        drawBoard();
        var counterDistance = 0;
        distanceBox.innerText = counterDistance.toFixed(3);
        var ptsct = gsm.level + 2;
        drawTargets(ptsct);
        document.querySelector("#dotLevelTitle").innerText = "Level " + (gsm.level + 1).toString();
        document.querySelector("#pointsBox2").innerText = "Solving " + (ptsct).toString() + " points.";
        connectTargets();
        this.saveLevelTargets(points);
        gsm.inceptionTime = Date.now();
    }
}
var lvlMgr = new levelManager();

function handleMouseUp() {
    if (gsm.mode == "game") {
        c.clearRect(0, 0, dotWindow.width, dotWindow.height);
        dotWindow = gsm.canvai;
        lvlMgr.reloadTargets();
    }
}

function lambdaTimeRecordSort(a,b) {
    return b.levelTimeRecord < a.levelTimeRecord ?  1 // if b should come earlier, push a to end
     : b.levelTimeRecord > a.levelTimeRecord ? -1 // if b should come later, push a to begin
     : 0;
}

async function showModalReport() {
    await starblock();
    var gameRecords = await getGameRecord(game=GAME_NAME);
    //console.log("BEFORE FILTER", gameRecords)
    var gameRecords2 = await filterByLevel(gameRecords, gsm.level);
    //console.log("AFTER FILTER", gameRecords2)
    var gameRecords = gameRecords2;
    //console.log("BEFORE SORTING", gameRecords)
    gameRecords.sort(lambdaTimeRecordSort);
    var timeRecordObject = gameRecords[0];
    //console.log(timeRecordObject)
    //console.log("AFTER SORTING", gameRecords)

    hideGameButtons();
    document.querySelector("#modalLevelReport").show();
    //console.log(gsm.levelTime);
    document.querySelector("#ratingBoxers").innerText = convertMSToStringInterval(timeRecordObject.levelTimeRecord);
    document.querySelector("#timerValueBox").innerText = convertMSToStringInterval(gsm.levelTime);
    document.querySelector("#levelScoreBox").innerText = " " + (await calculateLevelScore(gsm.level)).toFixed(2).toString() + " pts";
    await sleep(5000);
}

function hideModalReport() {
    document.querySelector("#modalLevelReport").close();
}




async function filterByLevel(gameRecords, level) {
    var gameRecords2 = [];
    for (let g=0; g < gameRecords.length; g++) {
        if (gameRecords[g].level == level) {
            gameRecords2.push(gameRecords[g]);
        }
    }
    return gameRecords2;
}


async function nextLevel() {
    if (lvlMgr.levelSolved == true) {
        gsm.userPath = [];
        gsm.closestConnection = null;
        gsm.connections = [];
        hideModalReport();
        gsm.level += 1;
        c.clearRect(0, 0, dotWindow.width, dotWindow.height);
        await drawBoard();
        lvlMgr.newLevel();
        showGameButtons();
        await fillLeaderBoard();
    }
}

async function getLevelTimeRecord() {
    var gameRecords = await getGameRecord(game=GAME_NAME);
    //console.log("BEFORE FILTER", gameRecords)
    var gameRecords2 = await filterByLevel(gameRecords, gsm.level);
    //console.log("AFTER FILTER", gameRecords2)
    var gameRecords = gameRecords2;
    //console.log("BEFORE SORTING", gameRecords);
    gameRecords.sort(lambdaTimeRecordSort);
    var timeRecordObject = gameRecords[0];
    //console.log(timeRecordObject);
    //console.log("AFTER SORTING", gameRecords);
    //console.log("Level Time Record", timeRecordObject.levelTimeRecord);
    return timeRecordObject.levelTimeRecord;

    }

async function showModalLogin() {
    document.querySelector("#startButton").style.display = "none";
    document.querySelector("#modalLightLogin").show();
    //disableElementVisibility("#mouseContainer");
}

async function disableElements(element_ids) {
    for (let e = 0; e < element_ids.length; e++) {
        if (document.querySelector("#" + element_ids[e]) != null) {
            disableElementVisibility(element_ids[e]);
        }
    }
}


async function startNewGame() {

    document.querySelector("#modalLightLogin").close();
    gsm.mode = "game";
    console.log("Starting new game...");
    const removableElements = ["pointsBox2", "mousePosBox", "mouseContainer", "pointsCountEmbed", "unIdealDistanceBoxWrapper", "IdealDistanceBoxWrapper", "dotLevelTitle", "pointsRange", "pointscountselector2"];
    await disableElements(removableElements);
    disableElementVisibility("mouseContainer");
    showGameButtons();
    gsm.level = 0;
    enableElementVisibility("dotLevelTitle");
    gsm.userPath = [];
    await showModalLogin();
    gsm.connections = [];
    gsm.shortestPath = [];
    document.querySelector("#modeBox").innerText = "Mode: Active Game"
    //console.log("Starting level 1.");

    await fillLeaderBoard();
    lvlMgr.newLevel();
}

function sortByDistance() {
    var sorted = points.sort(function sortClosest(a, b) { // non-anonymous as you ordered...
        return b.position.x + b.position.x < a.position.x + a.position.y ? 1 // if b should come earlier, push a to end
            :
            b.position.x + b.position.y > a.position.x + a.position.y ? -1 // if b should come later, push a to begin
            :
            0; // a and b are equal

    })
    return sorted;
}


async function shiftArray(array1) {
    var newArray = [];
    var lastItem = array1[array1.length - 1];
    newArray.push(lastItem);
    for (let a = 0; a < array1.length - 1; a++) {
        newArray.push(array1[a]);
    }
    return newArray;
}

async function getArrayCombos(array1) {
    var arrayVersions = [];
    var currentArray = array1;
    for (let i = 0; i < array1.length; i++) {
        newArray1 = await shiftArray(currentArray);
        currentArray = newArray1;
        arrayVersions.push(newArray1);
    }
    return arrayVersions;
}



async function drawLoop() {
    fillLeaderBoard();

    while (gsm.mode != "game") {

        disableElementVisibility("mousePosBox");
        disableElementVisibility("mouseContainer");
        dotWindow.width = window.innerWidth / 2; // Main Container Boundary
        dotWindow.height = window.innerHeight * 0.8; // Main Container Boundary
        points = generatePoints(pointsSlider.value);
        points = sortByDistance(points);
        quadrants = [];
        c.fillStyle = "white";
        c.clearRect(0, 0, dotWindow.width, dotWindow.height);
        await drawBoard();
        await drawTargets(pointsSlider.value, points);
        if ((gsm.mode != "game")) {
            await sleep(1700);
            gsm.possiblePathDistances = [];

            await solveTargets();

            await drawTargets(pointsSlider.value, points);

            enableElementVisibility("startButton");
        }
        if (gsm.mode != "game") {
            await sleep(5000 + points.length * 100);
        }

    }
}




async function drawUserPath() {
    await drawPath(await convertConnectionsToNodes(gsm.userPath));
    await drawTargets(pointsSlider.value, points, gsm.currentColors);
}

async function allVisited(points_) {
    //console.log("points...visited?", points_);
    for (let p = 0; p < points_.length; p++) {
        if (points_.visited == false) {
            //console.log("FAILED CHECK LEVEL AT ", points_);
            return false;
        }
    }

}




async function extractDistances(pathConn) {
    var distances = [0];
    for (let d = 0; d < pathConn.length; d++) {
        distances.push(pathConn[d].distance);
    }
    return distances;
}


async function getTableData() {
    //console.log(gsm.userPath);
    var points_ = getPointsFromConnections(gsm.userPath);
    var distances = await extractDistances(gsm.userPath);
    //console.log(distances);
    var totalDistances = distances.reduce((a, b) => a + b, 0);
    gsm.userPathDistance = totalDistances;
    gsm.totalPathDistance = totalDistances;
    //console.log(points_);
    console.log(gsm);
    if (totalDistances > 0) {
        document.querySelector("#userDistanceValueBox").innerText = totalDistances.toFixed(3).toString() + "m";
    }
    var tupes = [];
    for (let p = 0; p < points_.length; p++) {
        array1 = [];
        array1.push("(" + points_[p].position.x + ", " + points_[p].position.y + ")");
        array1.push(distances[p]);

        //console.log(array1);
        tupes.push(array1);
    }
    //console.log(tupes);
    return tupes;
}


async function handleGameClick() {
    if (gsm.mode == "game" && lvlMgr.levelSolved == false) {
        await (drawBoard());
        if (gsm.closestConnection != null) {
            if (!(gsm.closestConnection.startPoint.visited && gsm.closestConnection.endPoint.visited)) {
                gsm.userPath.push(gsm.closestConnection);
                document.querySelector("#simulatedVisitsTable").scrollBy(0,100);
                console.log(gsm);
                var pd = await calculatePathDistance(gsm.userPath);
                gsm.userPathDistance = pd;

                gsm.closestConnection.startPoint.visited = true;
                gsm.closestConnection.endPoint.visited = true;
                var tupes = await getTableData();
                //console.log(tupes);
                var tablePs = await buildTableData(tupes);
                //console.log(document.querySelector("#simulatedVisitsTable"));
                document.querySelector("#simulatedVisitsTable").innerHTML = tablePs;
                //console.log(tablePs);
            }

            await drawUserPath();

            if ((gsm.userPath.length + 1) == points.length) {
                await solveTargetsInvisible();
                if (allVisited(await getPointsFromConnections(gsm.userPath) == true)) {
                    lvlMgr.levelSolved = true;
                    gsm.userPathDistance = await calculatePathDistance(gsm.userPath);



                    await showModalReport();

                    console.log("LEVEL IS SOLVED! :)");
                }
            }

            gsm.totalPathDistance = await calculatePathDistance(gsm.userPath);
            document.querySelector("#distanceBox").innerText = gsm.totalPathDistance.toFixed(3);
        }
    }

}

async function hideModalButton() {
    if (gsm.mode == "game" && lvlMgr.levelSolved == true) {
        hideModalReport();
        await nextLevel();
        gsm.inceptionTime = Date.now();
    }
    gsm.inceptionTime = Date.now();
}

async function handleLevelSolve() {


}


function restartLevel() {
    lvlMgr.levelSolved = false;
    gsm.userPath = [];

    gsm.level -= 1;
    nextLevel();
}


function convertMSToStringInterval(ms) {
    var remainingMS = ms;
    var hrs = 0;
    while (remainingMS > (1000 * 60 * 60)) {
        remainingMS -= 1000 * 60 * 60;
        hrs += 1;
    }

    var m = 0;
    while (remainingMS > (1000 * 60)) {
        remainingMS -= 1000 * 60;
        m += 1;
    }

    var s = 0;
    while (remainingMS > (1000)) {
        remainingMS -= 1000;
        s += 1;
    }

    return hrs + "h:" + m + "m:" + s + "s";
}






function calculateLevelScore(pts = 35000, level = 5) {
    gsm.levelTime = Date.now() - gsm.inceptionTime;
    // gsm.userPathDistance
    // gsm.shortestDistance
    // MAX LEVEL, PTS RECORD FOR LEVEL, TIME RECORD FOR LEVEL,
    var ptsRecord = 500;
    var timeRecord = 12409;
    var maxLevel = 34;

    var weightedPts = (0.55) * (pts / ptsRecord);
    var timeDecision = 0;
    timeDecision = (gsm.levelTime / timeRecord);
    //console.log(gsm.levelTime, "level time");
    document.querySelector("#timerValueBox").innerText = convertMSToStringInterval(gsm.levelTime);
    if (timeDecision > 1) {
        timeDecision = 1;
    }
    var weightedTime = -1 * (0.1) * (timeDecision);
    levelDecision = (level / maxLevel);
    if (levelDecision > 1) {
        levelDecision = 1;
    }
    var weightedLevels = 1 * (0.35) * (levelDecision);

    document.querySelector("#cpuDistanceValueBox").innerText = gsm.shortestDistance.toFixed(3) + "m";
    console.log(gsm);
    var score = 100000 * (weightedPts) + 200 * weightedTime + 3551 * weightedLevels;
    lvlMgr.levelScore = score;
    gsm.totalScore += score;
    console.log(lvlMgr);



    return score;

}




async function starblock(){
   console.log(gsm);
   var recordTime = await getLevelTimeRecord();
   console.log(recordTime, "starblock enter");
   var starWidth = 0;
   var timeRatioPre = (gsm.levelTime/recordTime);
   if (timeRatioPre < 0.1 || timeRatioPre > 1) {
    timeRatioPre = 1;
   }
   var timeRatio = timeRatioPre;
   var distanceRatioPre = (gsm.userPathDistance/gsm.shortestDistance)
   if (distanceRatioPre < 0.1 || distanceRatioPre > 1) {
    distanceRatioPre = 1;
   }
   var distanceRatio = distanceRatioPre;
   var starwidthPre = (1-((distanceRatio+timeRatio)/2))*100;
   if (distanceRatio > 1) {
    starwidthPre -= 20;
   }
   console.log(starwidthPre, "starwidth pre", distanceRatio, timeRatio, "distance, time, ratio");
   document.querySelector("#starBlocker").style.width = Math.round(starwidthPre).toString() + "%";
}


function prepareScreenName() {

    var possibleScreenName = document.querySelector("#displayNameBoxEnter").value.toString().toLowerCase();
    possibleScreenName = possibleScreenName.replace("<", "").replace(";", "").replace(">", "").replace("select", "");
    curses = ["ass", "nigger", "dyke", "shit", "piss", "whore", "spic", "chink", "jew", "kyke", "beaner", "fuck", "cunt", "cock", "prick", "dildo", "prostitute", "meth"];
    for (let c = 0; c < curses.length; c++) {
        possibleScreenName = possibleScreenName.replace(curses[c]);
    }
    if (possibleScreenName.length < 4) {
        alert("invalid name detected. you are a guest now. sorry bud :(");
        possibleScreenName = "Guesterooni" + randInt(99999).toString();
    }
    document.querySelector("#displayNameBoxEnter").value = possibleScreenName;
    console.log(possibleScreenName, "POSSIBLE SCREEN NAME")
    console.log(username, "UNSET SCREEN NAME NAME");

    gsm.username = possibleScreenName;

    console.log(gsm.username, "SET SCREEN NAME NAME");
    return possibleScreenName;

}
async function startWithName() {

    prepareScreenName();
    startNewGame();

    document.querySelector("#modalLightLogin").close();
}

async function createGameRecord(levelTimeRecord = null, levelHighScore = null, game = GAME_NAME, level = null) {
    var id_ = (Math.floor(Math.random() * 1000000000));
    var url = BASE_URL + "/api/createGameUser?";
    var query = "levelHighScore=" + levelHighScore.toString();
    query += "&game=" + GAME_NAME + "&level=" + level.toString();
    query += "&levelTimeRecord=" + levelTimeRecord.toString();
    var gameRecords = await getGameRecord(game=GAME_NAME);
    console.log(gameRecords, "GAME RECORDS HERE");
    const data = {
        levelTimeRecord: levelTimeRecord,
        levelHighScore: levelHighScore,
        level: level,
        game: game
    };

    fetch(url + query, {
            method: 'GET', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}


async function createUser(username, highScore = 0) {
    document.querySelector("#modalLightLogin").close();
    var id_ = (Math.floor(Math.random() * 1000000000));
    var url = BASE_URL + "/api/createGameUser?";
    var query = "id3=" + id_.toString() + "&username=" + username;
    query += "&highScore=" + highScore.toString();
    query += "&game=" + GAME_NAME
    const data = {
        username: username,
        highScore: highScore
    };

    fetch(url + query, {
            method: 'GET', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}


async function createLeaderboardEntry(username, highScore = 0, game = GAME_NAME) {
    var url = BASE_URL + "/api/createLeaderboardEntry?"
    var query = "username=" + username;
    var aceRandom = randInt(99999999);
    query += "&highScore=" + highScore.toString();
    query += "&game=" + GAME_NAME;
    query += "&id3=" + aceRandom.toString();
    const data = {
        username: username,
        highScore: highScore,
        game: GAME_NAME,
        id3: aceRandom
    };
    fetch(url + query, {
            method: 'GET', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}


async function getUserList(game = GAME_NAME) {
    var url = BASE_URL + "/api/getUserList?";
    var query = "game=" + GAME_NAME;
    const data = (await (await fetch(url + query)).json());
    console.log(data, getUserList);
    return data;
}

async function getGameRecord(game = GAME_NAME) {
    var url = BASE_URL + "/api/getGameRecord?";
    var query = "game=" + GAME_NAME;
    const data = (await (await fetch(url + query)).json());
    console.log(data, getGameRecord);
    return data;
}


async function changeHighScore(game = GAME_NAME, username = null, highScore = null) {
    var url = BASE_URL + "/api/changeHighScore?";
    var query = "game=" + GAME_NAME;
    const data = {
        game: GAME_NAME,
        username: username,
        highScore: highScore
    };

    fetch(url + query, {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function hideModalScreenName() {
    gsm.mode = "loading";
    //console.log(hideModalScreenName);
    disableElementVisibility("modalLightLogin");
    startNewGame();
    gsm.inceptionTime = Date.now();
    //console.log(gsm.inceptionTime);
    gsm.mode = "game";
}

async function getLeaderboardEntries(game = GAME_NAME, username = null) {
    var url = BASE_URL + "/api/getLeaderboardEntries?";
    var query = "game=" + GAME_NAME;
    const data = (await fetch(url + query)).json();
    console.log(data, getLeaderboardEntries);
    return data;
}

drawLoop();


createLeaderboardEntry("actlike_umean_it", highScore=568568, game=GAME_NAME);
createLeaderboardEntry("bombastic_clamb", highScore=23526, game=GAME_NAME);
createLeaderboardEntry("menacinmaker91", highScore=12412450, game=GAME_NAME);
createLeaderboardEntry("gds_King34", highScore=68568, game=GAME_NAME);
createUser("gds_King34", highScore=68568);
createUser("menacinmaker91", highScore=568568);
createUser("bombastic_clamb", highScore=23526);
createUser("actlike_umean_it", highScore=41167);
getLeaderboardEntries(game=GAME_NAME);
createLeaderboardEntry(username="actlike_umean_it", highScore=randInt(2359515), game=GAME_NAME);
createLeaderboardEntry(username="bomclamb", highScore=(2359515), game=GAME_NAME);
createLeaderboardEntry(username="bombastic_clamb", highScore=(2359515), game=GAME_NAME);
createLeaderboardEntry(username="act_it", highScore=randInt(2359515), game=GAME_NAME);
createLeaderboardEntry(username="bwoah dude", highScore=(2359515), game=GAME_NAME);
createLeaderboardEntry(username="bombastic_clamb", highScore=(2359515), game=GAME_NAME);
createLeaderboardEntry(username="gds_King34", highScore=randInt(2359515), game=GAME_NAME);
createLeaderboardEntry(username="boafmba5stic_clamb", highScore=(2359515), game=GAME_NAME);
createLeaderboardEntry(username="bombastic_clamb", highScore=(2359515), game=GAME_NAME);
createLeaderboardEntry(username="actli45ke_umean_it", highScore=randInt(2359515), game=GAME_NAME);
createLeaderboardEntry(username="bombasagshtic_clamb", highScore=(2359515), game=GAME_NAME);
createLeaderboardEntry(username="bombhsfastic_clamb", highScore=(2359515), game=GAME_NAME);

