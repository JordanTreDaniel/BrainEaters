////////////////////////////////
// GET CANVAS ELEMENT READY
////////////////////////////////
let canvas = <HTMLCanvasElement>document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');
ctx.fillStyle = 'green';
////////////////////////////////
// MAKE IMAGES
////////////////////////////////
// let zombieImgs = ['http://www.pngall.com/wp-content/uploads/2016/07/Zombie-PNG-Picture-180x180.png', 'http://www.pngall.com/wp-content/uploads/2016/07/Zombie-Download-PNG-180x180.png', 'http://www.pngall.com/wp-content/uploads/2016/07/Zombie-PNG-Image-180x180.png'];
let heroPic = new Image();
heroPic.src = "http://vignette3.wikia.nocookie.net/playstationallstarsfanfictionroyale/images/d/d3/Mewtwo.png/revision/latest?cb=20130409192330";
let zombiePic = new Image();
zombiePic.src = 'http://www.pngall.com/wp-content/uploads/2016/07/Zombie-PNG-Picture-180x180.png';
// zombiePic.src = "http://vignette3.wikia.nocookie.net/playstationallstarsfanfictionroyale/images/d/d3/Mewtwo.png/revision/latest?cb=20130409192330";

////////////////////////////////
// MAKE CHARS OBJECT
////////////////////////////////
let chars = {
  hero: {
    img: heroPic,
    pos: {x: 0, y: 0}
  },
  zombies: []
};
let numberOfZombies = 2;
let numberOfGoals = 2;
////////////////////////////////
// MAKE MAP
////////////////////////////////
let map = [];
let goals = [];
class Point {
  constructor(public x:number, public y:number){}
}
////////////////////////////////
// ZOMBIE CLASS
////////////////////////////////
class Zombie {
  constructor(public pos:Object, public id:number, public img=zombiePic) {}
}
////////////////////////////////
// CREATE MAZE AND FILL MAP OBJ
////////////////////////////////
function genMaze() {
  let graphX = 0;
  let graphY = 0;
  //make solid top row to give hero a fighting chance
  for(let y = 0; y < 16; y++) {
    ctx.fillRect(graphX, graphY, 50, 50);
    map.push(savePoint(graphX, graphY));
    graphX +=50;
  }
  //Loopz to loop through y's
  graphY = 50;
  for (let i = 1; i < 16; i++){
    let usedX = [];
    for (let j = 0; j < 12; j++) {
      do {
        graphX = (50 * (Math.floor(Math.random() * 16)));
      } while(arrayIncludesPoint(graphX, graphY, usedX));
      ctx.fillRect(graphX, graphY, 50, 50);
      map.push(savePoint(graphX, graphY));
      usedX.push({x: graphX, y:graphY});

    }
    graphY += 50;
  }
  graphY = 750;
  //Make 3 goal spots at bottom of map
  ctx.fillStyle = 'gold';
  for (let x = 0; x < numberOfGoals; x++) {
    do {
      graphX = 50 * (Math.floor(Math.random() * 16));
    } while(arrayIncludesPoint(graphX, graphY, goals) || !(arrayIncludesPoint(graphX, graphY, map)));
    ctx.fillRect(graphX, graphY, 50, 50);
    goals.push(savePoint(graphX, graphY));
  }
  ctx.fillStyle = "green";
}
////////////////////////////////
// POPULATE MAZE
////////////////////////////////
function popMaze() {
  let usedPositions = [];
  let spawnPoint;
  //populate in random column at top of MAZE
  let x = map[random(0, 9)].x;
  ctx.drawImage(chars.hero.img, x, 0, 50, 50);
  //save position
  chars.hero.pos = (savePoint(x, 0));
  usedPositions.push(savePoint(x, 0));
  //populate zombies in random points on map
  for (let g = 0; g < numberOfZombies; ++g) {
    //One zombie would be boring
    // zombiePic.src = zombieImgs[random(0, zombieImgs.length - 1)];
    //'do while' is so they don't pop on top of char or other zombies
    do {
      spawnPoint = map[random(0, map.length - 1)];
    } while(arrayIncludesPoint(spawnPoint.x, spawnPoint.y, usedPositions));
    ctx.drawImage(zombiePic, spawnPoint.x, spawnPoint.y, 50, 50);
    //add zombie to array;
    let zombie = new Zombie(spawnPoint, g);
    chars.zombies.push(zombie);
    usedPositions.push(spawnPoint);
  }
}
function reGenMaze(){
  // re-fill map
  for (let i of map) {
    ctx.fillRect(i.x, i.y, 50, 50);
  }
  //re-pop hero
  ctx.drawImage(heroPic, chars.hero.pos.x, chars.hero.pos.y, 50, 50);
  // re-pop zombies
  for (let i of chars.zombies) {
    ctx.drawImage(zombiePic, i.pos.x, i.pos.y, 50, 50);
  }
  //re-fill goals
  ctx.fillStyle = 'gold';
  for (let x of goals) {
    ctx.fillRect(x.x, x.y, 50, 50);
  }
  ctx.fillStyle = 'green';
  //re-pop hero even on goal
  ctx.drawImage(heroPic, chars.hero.pos.x, chars.hero.pos.y, 50, 50);
}
function changeHeroPos(e) {
  //get keyCode
  let key = e.keyCode;
  let pos = chars.hero.pos;
  //switch
  switch (key) {
    case 37:
      if (arrayIncludesPoint((pos.x - 50), pos.y, map)){
        chars.hero.pos.x -= 50;

      }
      break;
    case 38:
    if (arrayIncludesPoint(pos.x, (pos.y - 50), map)){
      chars.hero.pos.y -= 50;
    }
    break;
    case 39:
    if (arrayIncludesPoint((pos.x + 50), pos.y, map)){
      chars.hero.pos.x += 50;
    }
    break;
    case 40:
    if (arrayIncludesPoint(pos.x, (pos.y + 50), map)){
      chars.hero.pos.y += 50;
    }
    break;
  }
}
function changeZombiesPos() {
  let heroPos = chars.hero.pos;
  for(let i of chars.zombies) {
    let zomPos = i.pos;
    let difference = savePoint((zomPos.x - heroPos.x), (zomPos.y - heroPos.y));
    //if zom is to the right of hero
    if (difference.x > 0) {
      if (arrayIncludesPoint((zomPos.x - 50), zomPos.y, map)) {
        i.pos.x -= 50;
      }
      //if zombie is to left of hero
    } else if (difference.x < 0){
      if (arrayIncludesPoint(zomPos.x + 50, zomPos.y, map)) {
        i.pos.x += 50;
      }
    }
    //if zombie is above hero
    if (difference.y > 0) {
      if (arrayIncludesPoint(zomPos.x, zomPos.y - 50, map)) {
        i.pos.y -= 50;
      }
      //if zombie is below of hero
    } else if (difference.y < 0){
      if (arrayIncludesPoint(zomPos.x, zomPos.y + 50, map)) {
        i.pos.y += 50;
      }
    }
  }
}

////////////////////////////////
// UTILITY FUNCTIONS
////////////////////////////////

//Function to see if array includes a point
function arrayIncludesPoint(lat:number, long:number, a) {
  for (let x of a) {
    if (x.x === lat && x.y === long){
      return true;
    }
  }
  return false;
}

//Function to get random whole number inclusive,
//take from http://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Function to save Point
function savePoint(x, y) {
  let obj = {x: x, y: y};
  return obj;
}

//Function to clear canvas
function clearMaze() {
  ctx.clearRect(0, 0, 800, 800);
}
//Function to toggle pressedIt so only arrow keys move zombies
// function togglePressedIt() {
//   if (pressedIt === true) {
//     pressedIt = false;
//   } else {
//     pressedIt = true;
//   }
// }
//Function to comare two points for equality
function samePoint(a, b) { //HOW COULD I EXPLICITLY REQUIRE OBJECTS AS PARAMETERS?
  if (a.x === b.x && a.y === b.y) {
      return true;
    }
}
//Function to check whether you have been caught by the zombies
function infected() {
  for (let z of chars.zombies){
    if (samePoint(chars.hero.pos, z.pos)) {
      return true;
    }
  }
  return false;
}
//Function to check whether or not you have reached the goals
function reachedGoal() {
  for (let e of goals) {
    if (samePoint(e, chars.hero.pos)){
      return true;
    }
  }
  return false;
}

window.addEventListener('keydown', (e) => {
  changeHeroPos(e);
  clearMaze();
  reGenMaze();
});

let start = document.getElementById('startGame');
start.addEventListener('click', () => {
  let span = document.getElementById('top');
  let directions = document.createTextNode(`Click the canvas and get ready to run. Make it to
    a golden square at the bottom of the map and you win. Don't and get eaten.`);
  span.replaceChild(directions, start);
  setTimeout(() => {
    function mainLoop() {
    changeZombiesPos();
    clearMaze();
    reGenMaze();
    if (infected()) {
      //Zombies chill bc they know they caught you
      clearInterval(interval);
      //You Lose function over function here:
      alert("you lose!");
      //Option to reset game:
      span.replaceChild(start, directions);
    } else if (reachedGoal()) {
      //Zombies chill bc they know they caught you
      clearInterval(interval);
      alert("you win!");
      //Option to reset game:
      span.replaceChild(start, directions);
    }
  }
    numberOfZombies = parseInt((<HTMLInputElement>document.getElementById('numberOfZombies')).value);
    genMaze();
    popMaze();
    let interval = setInterval(mainLoop, 750); //It's annoying that I cannot reference interval from
    //outside of this anonymous function
  }, 3000);
});
