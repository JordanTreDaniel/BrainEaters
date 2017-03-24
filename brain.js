var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
ctx.fillStyle = 'green';
var heroPic = new Image();
heroPic.src = "http://vignette3.wikia.nocookie.net/playstationallstarsfanfictionroyale/images/d/d3/Mewtwo.png/revision/latest?cb=20130409192330";
var zombiePic = new Image();
zombiePic.src = 'http://www.pngall.com/wp-content/uploads/2016/07/Zombie-PNG-Picture-180x180.png';
var chars = {
    hero: {
        img: heroPic,
        pos: { x: 0, y: 0 }
    },
    zombies: []
};
var numberOfZombies = 2;
var numberOfGoals = 2;
var map = [];
var goals = [];
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
var Zombie = (function () {
    function Zombie(pos, id, img) {
        if (img === void 0) { img = zombiePic; }
        this.pos = pos;
        this.id = id;
        this.img = img;
    }
    return Zombie;
}());
function genMaze() {
    var graphX = 0;
    var graphY = 0;
    for (var y = 0; y < 16; y++) {
        ctx.fillRect(graphX, graphY, 50, 50);
        map.push(savePoint(graphX, graphY));
        graphX += 50;
    }
    graphY = 50;
    for (var i = 1; i < 16; i++) {
        var usedX = [];
        for (var j = 0; j < 12; j++) {
            do {
                graphX = (50 * (Math.floor(Math.random() * 16)));
            } while (arrayIncludesPoint(graphX, graphY, usedX));
            ctx.fillRect(graphX, graphY, 50, 50);
            map.push(savePoint(graphX, graphY));
            usedX.push({ x: graphX, y: graphY });
        }
        graphY += 50;
    }
    graphY = 750;
    ctx.fillStyle = 'gold';
    for (var x = 0; x < numberOfGoals; x++) {
        do {
            graphX = 50 * (Math.floor(Math.random() * 16));
        } while (arrayIncludesPoint(graphX, graphY, goals) || !(arrayIncludesPoint(graphX, graphY, map)));
        ctx.fillRect(graphX, graphY, 50, 50);
        goals.push(savePoint(graphX, graphY));
    }
    ctx.fillStyle = "green";
}
function popMaze() {
    var usedPositions = [];
    var spawnPoint;
    var x = map[random(0, 9)].x;
    ctx.drawImage(chars.hero.img, x, 0, 50, 50);
    chars.hero.pos = (savePoint(x, 0));
    usedPositions.push(savePoint(x, 0));
    for (var g = 0; g < numberOfZombies; ++g) {
        do {
            spawnPoint = map[random(0, map.length - 1)];
        } while (arrayIncludesPoint(spawnPoint.x, spawnPoint.y, usedPositions));
        ctx.drawImage(zombiePic, spawnPoint.x, spawnPoint.y, 50, 50);
        var zombie = new Zombie(spawnPoint, g);
        chars.zombies.push(zombie);
        usedPositions.push(spawnPoint);
    }
}
function reGenMaze() {
    for (var _i = 0, map_1 = map; _i < map_1.length; _i++) {
        var i = map_1[_i];
        ctx.fillRect(i.x, i.y, 50, 50);
    }
    ctx.drawImage(heroPic, chars.hero.pos.x, chars.hero.pos.y, 50, 50);
    for (var _a = 0, _b = chars.zombies; _a < _b.length; _a++) {
        var i = _b[_a];
        ctx.drawImage(zombiePic, i.pos.x, i.pos.y, 50, 50);
    }
    ctx.fillStyle = 'gold';
    for (var _c = 0, goals_1 = goals; _c < goals_1.length; _c++) {
        var x = goals_1[_c];
        ctx.fillRect(x.x, x.y, 50, 50);
    }
    ctx.fillStyle = 'green';
    ctx.drawImage(heroPic, chars.hero.pos.x, chars.hero.pos.y, 50, 50);
}
function changeHeroPos(e) {
    var key = e.keyCode;
    var pos = chars.hero.pos;
    switch (key) {
        case 37:
            if (arrayIncludesPoint((pos.x - 50), pos.y, map)) {
                chars.hero.pos.x -= 50;
            }
            break;
        case 38:
            if (arrayIncludesPoint(pos.x, (pos.y - 50), map)) {
                chars.hero.pos.y -= 50;
            }
            break;
        case 39:
            if (arrayIncludesPoint((pos.x + 50), pos.y, map)) {
                chars.hero.pos.x += 50;
            }
            break;
        case 40:
            if (arrayIncludesPoint(pos.x, (pos.y + 50), map)) {
                chars.hero.pos.y += 50;
            }
            break;
    }
}
function changeZombiesPos() {
    var heroPos = chars.hero.pos;
    for (var _i = 0, _a = chars.zombies; _i < _a.length; _i++) {
        var i = _a[_i];
        var zomPos = i.pos;
        var difference = savePoint((zomPos.x - heroPos.x), (zomPos.y - heroPos.y));
        if (difference.x > 0) {
            if (arrayIncludesPoint((zomPos.x - 50), zomPos.y, map)) {
                i.pos.x -= 50;
            }
        }
        else if (difference.x < 0) {
            if (arrayIncludesPoint(zomPos.x + 50, zomPos.y, map)) {
                i.pos.x += 50;
            }
        }
        if (difference.y > 0) {
            if (arrayIncludesPoint(zomPos.x, zomPos.y - 50, map)) {
                i.pos.y -= 50;
            }
        }
        else if (difference.y < 0) {
            if (arrayIncludesPoint(zomPos.x, zomPos.y + 50, map)) {
                i.pos.y += 50;
            }
        }
    }
}
function arrayIncludesPoint(lat, long, a) {
    for (var _i = 0, a_1 = a; _i < a_1.length; _i++) {
        var x = a_1[_i];
        if (x.x === lat && x.y === long) {
            return true;
        }
    }
    return false;
}
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function savePoint(x, y) {
    var obj = { x: x, y: y };
    return obj;
}
function clearMaze() {
    ctx.clearRect(0, 0, 800, 800);
}
function samePoint(a, b) {
    if (a.x === b.x && a.y === b.y) {
        return true;
    }
}
function infected() {
    for (var _i = 0, _a = chars.zombies; _i < _a.length; _i++) {
        var z = _a[_i];
        if (samePoint(chars.hero.pos, z.pos)) {
            return true;
        }
    }
    return false;
}
function reachedGoal() {
    for (var _i = 0, goals_2 = goals; _i < goals_2.length; _i++) {
        var e = goals_2[_i];
        if (samePoint(e, chars.hero.pos)) {
            return true;
        }
    }
    return false;
}
window.addEventListener('keydown', function (e) {
    changeHeroPos(e);
    clearMaze();
    reGenMaze();
});
var start = document.getElementById('startGame');
start.addEventListener('click', function () {
    var span = document.getElementById('top');
    var directions = document.createTextNode("Click the canvas and get ready to run. Make it to\n    a golden square at the bottom of the map and you win. Don't and get eaten.");
    span.replaceChild(directions, start);
    setTimeout(function () {
        function mainLoop() {
            changeZombiesPos();
            clearMaze();
            reGenMaze();
            if (infected()) {
                clearInterval(interval);
                alert("you lose!");
                span.replaceChild(start, directions);
            }
            else if (reachedGoal()) {
                clearInterval(interval);
                alert("you win!");
                span.replaceChild(start, directions);
            }
        }
        numberOfZombies = parseInt(document.getElementById('numberOfZombies').value);
        genMaze();
        popMaze();
        var interval = setInterval(mainLoop, 750);
    }, 3000);
});
