  var holeX, holeY, xPos, yPos, numZeros, good, courseToPush
  var good = false
  var golfX = 977
  var golfY = 977
  var velY = 0
  var velX = 0
  var checkX, checkY
  var myCanvas
  var grid = new Array(8);
  var numHoles = -1
  var games = new Array()




var warmingUp = false
var released = false
var distance
var greenFriction = 45
var rand
var output
var win = false
var ballSize = 10
var numPlayers1 = 0
var strokes = 0
var scores
var curHole = 1
var curPlayer = 1
var nextPlayer = false
var wait = 180
var gameOver = false
var winners = [false, false, false, false]
var winner
var addPosX = 0
var addPosY = 0
var curX
var curY
var prevBallX
var prevBallY


  var rootRef = firebase.database().ref()
	rootRef.on('child_added', function(data) {
		games.push(data.key);
  }); 
   
  var gameStart = false
function setup() {
  myCanvas = createCanvas(1545,1040)
  strokeCap(PROJECT)
  for (var i = 0; i < 8; i++) {
    grid[i] = new Array(8)
  }
  generateCourse()
  var numPlayers1 = 0
  while(numPlayers != 2 && numPlayers != 3 && numPlayers != 4)
    numPlayers = window.prompt("How many players will be in your party? (2-4)")
  while (numHoles <= 0 || numHoles > 18) {
    numHoles = window.prompt("Enter a valid number of holes (1-18):")
  }
  
  var goodCode = false
  var roomCode
  while(!goodCode) {
    goodCode = true
    roomCode = (int)(Math.random() * 10000)
    if(roomCode < 10) {
      roomCode = "000" + roomCode
    }
    else if(roomCode < 100) {
      roomCode = "00" + roomCode
    }
    else if(roomCode < 1000) {
      roomCode = "0" + roomCode
    }
    else {
      roomCode = "" + roomCode
    }
    for(var i = 0; i < games.length; i++) {
      if(roomCode === games[i]) {
        goodCode = false
      }
    }
  } 

  firebase.database().ref(roomCode + "/updater").set({
    updateNum: 0
  });

  firebase.database().ref(roomCode + "/time").set({
    creationDate: new Date().getTime()
  });
  firebase.database().ref(roomCode + "/numHoles").set({
    numHoles: numHoles
  });
  firebase.database().ref(roomCode + "/numPlayers").set({
    numPlayers: numPlayers1,
    players: 1
  });
  firebase.database().ref(roomCode + "/started").set({
    started: 0
  });
  firebase.database().ref(roomCode + "/gameInfo").set({
    gameBoard: courseToPush,
    playerTurn: 1,
    holex: holeX,
    holey: holeY,
    ballVelX: 977,
    ballVelY: 977,
    holeNum: 1,
    currStrokes: 0,
    ballReleased: false
  });
  if(numPlayers == 2) {
    firebase.database().ref(roomCode + "/scores").set({
      player1: 0,
      player2: 0
    });
  }
  if(numPlayers == 3) {
    firebase.database().ref(roomCode + "/scores").set({
      player1: 0,
      player2: 0,
      player3: 0
    });
  }
  if(numPlayers == 4) {
    firebase.database().ref(roomCode + "/scores").set({
      player1: 0,
      player2: 0,
      player3: 0,
      player4: 0
    });
  }
  background(0,127,0)
  textAlign(CENTER)
  textSize(128)
  fill(255,0,0)
  text('Room Code: ' + roomCode,773,521)
  var myFunc = function(data) {console.log(data.val()); if(data.val() == numPlayers1){gameStart = true; firebase.database().ref(roomCode + "/started").set({started: 1}); firebase.database().ref(roomCode + "/numPlayers").off('child_changed', myFunc);}}
  firebase.database().ref(roomCode + "/numPlayers").on('child_changed', myFunc);

  firebase.database().ref(roomCode + "/updater").on('child_changed', function(data) {
		update();
  }); 
}

function update() {
  firebase.database().ref(roomCode + "/gameInfo").once('value').then( function(data) {
    curPlayer = data.val().playerTurn;
    strokes = data.val().currStrokes;
    curHole = data.val().holeNum;
    holeX = data.val().holex;
    holeY = data.val().holey;
    velX = data.val().ballVelX;
    velY = data.val().ballVelY;
    released = data.val().ballReleased; 
    var pushedBoard = data.val().gameBoard;
    var stringNum = 0
    for(var i = 0; i < 8; i++) {
      for(var j = 0; j < 8; j++) {
        grid[i][j] = parseInt(pushedBoard.substring(stringNum,stringNum+1))
        stringNum++
      }
    }
  }); 
}

function draw() {
  myCanvas.position((window.innerWidth-1545)/2, (window.innerHeight-1040)/2)
  if(gameStart) {
    clear()
    drawCourse(0)
    drawCourse(1)




  fill(25)
  strokeWeight(0)
  circle(holeX, holeY, 20)
  fill(230)
  strokeWeight(.5)
  if(win && dist(holeX, holeY, golfX, golfY) < 8)
  {
    if (ballSize > 6) {
      ballSize -= .17
    }
    else {
      wait--
      if(wait < 0) {
        nextPlayer = true
      }
    }
  }
  var rgbAtPoint
    rgbAtPoint = get(Math.floor(golfX), Math.floor(golfY))
      if(rgbAtPoint[0] == 240) {
        greenFriction = 5
      }
      else
        greenFriction = 45
    if(rgbAtPoint[1] == 127) {
        golfX = prevBallX
        golfY = prevBallY
      }
  prevBallX = golfX
  prevBallY = golfY
  circle(golfX, golfY, ballSize)
  if (warmingUp) {
    win = false
    strokeWeight(1)
    /*
    golfX is x coordinate of the golf ball
    golfY is y coordinate of the golf ball
    mouseX is the x coordinate of the mouse
    mouseY is the y coordinate of the mouse
    curX is the x coordinate of the original mouse click
		curY is the y coordinate of the original mouse click
    so:
    the vector is (golfX , golfY) -> (golfX - mouseX+curX, golfY - mouseY+curY)
    */
    var diffX = -curX + mouseX
    var diffY = -curY + mouseY
    line(golfX, golfY, golfX - diffX, golfY - diffY) //change this a little
    distance = dist(golfX, golfY, mouseX, mouseY) //+addedDistance
    velX = (curX - mouseX)/9
    velY = (curY - mouseY)/9
  }
  else if(released) {
    if (sqrt(sq(velX-velX/greenFriction)+sq(velY-velY/greenFriction)) > 100) {
      released = false
      strokes--
      scores[curPlayer-1]--
    }
    else {
      
    if (dist(holeX, holeY, golfX, golfY) < 8 && !win && sqrt(sq(velY)+ sq(velX)) < 6) {
      velX = .25*velX/abs(velX)
      velY = .25*velY/abs(velY)
      win = true
    }
    else if (dist(holeX, holeY, golfX, golfY) < 8 && !win && sqrt(sq(velY)+ sq(velX)) >= 3) {
      velX -= velX/greenFriction
      velY -= velY/greenFriction
      velX -= velX/greenFriction
      velY -= velY/greenFriction
    }
    if (win && dist(holeX, holeY, golfX+velX, golfY+velY) > 8) {
      velX *= -1
      velY *= -1
    }
    
    golfX += velX
    golfY += velY
    velX -= velX/greenFriction
    velY -= velY/greenFriction
    if(velY > -0.05 && velY < 0.05 && velX > -0.05 && velX < 0.05)
    {
      released = false
      velX = 0
      velY = 0
    }
    }
  }





  }
}

function mousePressed() {
  if(!released && !win && warmingUp == false && curPlayer == 1) { 
    curX = mouseX
 		curY = mouseY
    warmingUp = true
  }
}

function keyPressed() {
  if(!released && !win && keyCode === 32 && warmingUp == false && curPlayer == 1) {
    curX = mouseX
 		curY = mouseY
    warmingUp = true
  }
  if(keyCode === 49) {
    

    firebase.database().ref(roomCode + "/numPlayers/numPlayers").once('value').then( function(data) {
		  var newNumPlayers = numPlayers;

      firebase.database().ref(roomCode + "/numPlayers").set({
        numPlayers: newNumPlayers,
      });

    });
          


    firebase.database().ref(roomCode + "/started").set({
      started: 1
    });
  }
}

function mouseReleased() {
  if (warmingUp && dist(curX, curY, mouseX, mouseY) > 5.5 && curPlayer == 1) {
    warmingUp = false
    released = true
    strokes++
    scores[curPlayer-1] ++
  }
  else if (warmingUp && curPlayer == 1) {
    warmingUp = false
  }
}

function keyReleased() {
  if (warmingUp && dist(curX, curY, mouseX, mouseY) > 5.5 && keyCode === 32 && curPlayer == 1) {
    warmingUp = false
    released = true
    strokes++
    scores[curPlayer-1] ++
  }
  else if (warmingUp && curPlayer == 1) {
    warmingUp = false
  }
}


function generateCourse() {
  holeX = floor(random(25,106))
  holeY = floor(random(25,106))

  while (good == false) {
    for(var i = 0; i < 8; i++) {
      for(var j = 0; j < 8; j++) {
        grid[i][j] = 0
      }
    }
    grid[7][7] = 1
    xPos = 7
    yPos = 7
    while (grid[0][0] == 0) {
      rand = floor(random(0,4))
      if (rand == 0 && yPos != 0) { //up
        yPos--
      }
      else if (rand == 1 && yPos != 7) { //down
        yPos++
      }
      else if (rand == 2 && xPos != 0) { //left
        xPos--
      }
      else if (rand == 3 && xPos != 7) { //right
        xPos++
      }
      grid[xPos][yPos] = 1
    }
    numZeros = 0
    for(var i = 0; i < 8; i++) {
      for(var j = 0; j < 8; j++) {
        if (grid[i][j] == 0) {
          numZeros++
        }
      }
    }
    if (numZeros > 20) {
      good = true
    }
  }
  for(var i = 0; i < 8; i++) {
    for(var j = 0; j < 8; j++) {
      if (grid[i][j] == 1 && (floor(random()*10)==0)) {
        if((i != 7 || j != 7) && (i != 0 || j != 0))
          grid[i][j] = 2;
      }
    }
  }
  courseToPush = ""
  for(var i = 0; i < 8; i++) {
    for(var j = 0; j < 8; j++) {
      courseToPush += grid[i][j]
    }
  }
  console.log(courseToPush)
  for(var i = 0; i < 8; i++) {
    output = ""
    for(var j = 0; j < 8; j++) {
      output += grid[j][i] + " "
    }
    console.log(output)
  }
}






function drawBorders(left, right, up, down, xCor, yCor) {
  fill(255)
  strokeCap(PROJECT)
  strokeWeight(4)
  if (left && grid[xCor-1][yCor] == 0) {
    line(130*xCor,130*yCor,130*xCor,130*(yCor+1))
    dontSkip(130*xCor, 130*yCor, 130*xCor, 130*(yCor+1), golfX+checkX, golfY+checkY, 7, true)
  }
  if (right && grid[xCor+1][yCor] == 0) {
    line(130*(xCor+1),130*yCor,130*(xCor+1),130*(yCor+1))
    dontSkip(130*(xCor+1), 130*yCor, 130*(xCor+1), 130*(yCor+1), golfX, golfY, 7, true)
  }
  if (up && grid[xCor][yCor-1] == 0) {
    line(130*xCor,130*yCor,130*(xCor+1),130*yCor)
    dontSkip(130*xCor, 130*yCor, 130*(xCor+1), 130*yCor, golfX, golfY, 7, false)
  }
  if (down && grid[xCor][yCor+1] == 0) {
    line(130*xCor,130*(yCor+1),130*(xCor+1),130*(yCor+1))
    dontSkip(130*xCor, 130*(yCor+1), 130*(xCor+1), 130*(yCor+1), golfX, golfY, 7, false)
  }
}

/*
Draws the borders that don't border the array. Also is the main draw method.
*/
function drawCourse(mode) {
  for (var x = 0; x < 8; x++) {
    for (var y = 0; y < 8; y++) {
      if(grid[x][y] == 2)
        fill(240,230,140)
      else
        fill(0,255,0)
      strokeWeight(0)
      if (x == 0 && y == 0) {
        if (mode == 0) {
          square(0,0,130)
        }
        else {
          drawBorders(false, true, false, true, 0, 0)
          strokeWeight(8)
 				  strokeCap(SQUARE)
          line(0,0,0,130)
          dontSkip(0, 0, 0, 130, golfX, golfY, 7, true)
          strokeWeight(8)
 				  strokeCap(SQUARE)
          line(0,0,130,0)
          dontSkip(0, 0, 130, 0, golfX, golfY, 7, false)
        }
      }
      else if (x == 0 && y == 7) {
        if (grid[x][y] != 0) {
          if (mode == 0) {
            square(0,910,130)
          }
          else {
            drawBorders(false, true, true, false, 0, 7)
            strokeWeight(8)
 				 	  strokeCap(SQUARE)
            line(0,1040,0,910)
            dontSkip(0, 1040, 0, 910, golfX, golfY, 7, true)
            strokeWeight(8)
 					  strokeCap(SQUARE)
            line(0,1040,130,1040)
            dontSkip(0, 1040, 130, 1040, golfX, golfY, 7, false)
          }
        }
      }
      else if (x == 7 && y == 0) {
        if (grid[x][y] != 0) {
          if (mode == 0) {
            square(910,0,130)
          }
          else {
            drawBorders(true, false, false, true, 7, 0)
            strokeWeight(8)
 				 	  strokeCap(SQUARE)
            line(1040,0,910,0)
            dontSkip(1040, 0, 910, 0, golfX, golfY, 7, false)
            strokeWeight(4)
 				 	  strokeCap(PROJECT)
            line(1040,0,1040,130)
            dontSkip(1040, 0, 1040, 130, golfX, golfY, 7, true)
          }
        }
      }
      else if (x == 7 && y == 7) {
        if (mode == 0) {
          square(910,910,130)
        }
        else {
          drawBorders(true, false, true, false, 7, 7)
          line(1040,1040,1040,910)
          dontSkip(1040, 1040, 1040, 910, golfX, golfY, 7, true)
          strokeWeight(8)
 				  strokeCap(SQUARE)
          line(1040,1040,910,1040)
          dontSkip(1040, 1040, 910, 1040, golfX, golfY, 7, false)
        }
      }
      else if (x == 7) {
        if (grid[x][y] != 0) {
          if (mode == 0) {
            square(910,y*130,130)
          }
          else {
            drawBorders(true, false, true, true, 7, y)
            line(1040,y*130,1040,(y+1)*130)
            dontSkip(1040, y*130, 1040, (y+1)*130, golfX, golfY, 7, true)
          }
        }
      }
      else if (x == 0) {
        if (grid[x][y] != 0) {
          if (mode == 0) {
            square(0,y*130,130)
          }
          else {
            drawBorders(false, true, true, true, 0, y)
         	  strokeWeight(8)
 					  strokeCap(SQUARE)
            line(0,y*130,0,(y+1)*130)
            dontSkip(0, y*130, 0, (y+1)*130, golfX, golfY, 7, true)
          }
        }
      }
      else if (y == 7) {
        if (grid[x][y] != 0) {
          if (mode == 0) {
            square(x*130,910,130)
          }
          else {
            drawBorders(true, true, true, false, x, 7)
    	      strokeWeight(8)
 					  strokeCap(SQUARE)
            line(x*130,1040,(x+1)*130,1040)
            dontSkip(x*130, 1040, (x+1)*130, 1040, golfX, golfY, 7, false)
          }
        }
      }
      else if (y == 0) {
        if (grid[x][y] != 0) {
          if (mode == 0) {
            square(x*130,0,130)
          }
          else {
            drawBorders(true, true, false, true, x, 0)
     	      strokeWeight(8)
 				 	  strokeCap(SQUARE)
            line(x*130,0,(x+1)*130,0)
            dontSkip(x*130, 0, (x+1)*130, 0, golfX, golfY, 7, false)
          }
        }
      }
      else if (grid[x][y] != 0){
        if (mode == 0) {
          square(x*130,y*130,130)
        }
        else {
          drawBorders(true, true, true, true, x, y)
        }
      }
    }
  }
}

function resetCourse() {
  golfX = 977
  golfY = 977
  velX = 0
  velY = 0
  prevBallX = 977
  prevBallY = 977
  warmingUp = false
  released = false
  good = false
  win = false
  ballSize = 10
  strokes = 0
  nextPlayer = false
  wait = 180
}

function dontSkip(a,b,c,d,e,f,g,dir) { //when dir, bounce x
  var ogCheckX = 0
  var ogCheckY = 0
  checkX = 0
  checkY = 0
  for(var i = 0; i < 300; i++) {
    if(i % 3 == 0) {
      ogCheckX += velX/100
      ogCheckY += velY/100
      if(lineCircle(a, b, c, d, e+ogCheckX, f+ogCheckY, g)) {
        //console.log("BOUNCE!")
        if (dir) velX *= -0.95
        else velY *= -0.95
        break
      }
    }
    else if(i % 3 == 1) {
      checkX = ogCheckX + 1
      checkY = ogCheckY
    }
    else {
      checkX = ogCheckX
      checkY = ogCheckY + 1
    }
    if(i % 3 != 0 && lineCircle(a, b, c, d, e+checkX, f+checkY, g)) {
      //console.log("BOUNCE!")
      if (dir) velX *= -0.95
      else velY *= -0.95
      break
    }
  }
}




function lineCircle(x1, y1, x2, y2, cx, cy, r) {
  // is either end INSIDE the circle?
  // if so, return true immediately
  var inside1 = pointCircle(x1,y1, cx,cy,r);
  var inside2 = pointCircle(x2,y2, cx,cy,r);
  if (inside1 || inside2) return true;

  // get length of the line
  var distX = x1 - x2;
  var distY = y1 - y2;
  var len = sqrt( (distX*distX) + (distY*distY) );

  // get dot product of the line and circle
  var dot = ( ((cx-x1)*(x2-x1)) + ((cy-y1)*(y2-y1)) ) / pow(len,2);

  // find the closest point on the line
  var closestX = x1 + (dot * (x2-x1));
  var closestY = y1 + (dot * (y2-y1));

  // is this point actually on the line segment?
  // if so keep going, but if not, return false
  var onSegment = linePoint(x1,y1,x2,y2, closestX,closestY);
  if (!onSegment) return false;

  // get distance to closest point
  distX = closestX - cx;
  distY = closestY - cy;
  var distance = sqrt( (distX*distX) + (distY*distY) );

  if (distance <= r) {
    return true;
  }
  return false;
}


// POINT/CIRCLE
function pointCircle(px, py, cx, cy, r) {

  // get distance between the point and circle's center
  // using the Pythagorean Theorem
  var distX = px - cx;
  var distY = py - cy;
  var distance = sqrt( (distX*distX) + (distY*distY) );

  // if the distance is less than the circle's
  // radius the point is inside!
  if (distance <= r) {
    return true;
  }
  return false;
}


// LINE/POINT
function linePoint(x1, y1, x2, y2, px, py) {

  // get distance from the point to the two ends of the line
  var d1 = dist(px,py, x1,y1);
  var d2 = dist(px,py, x2,y2);

  // get the length of the line
  var lineLen = dist(x1,y1, x2,y2);

  // since floats are so minutely accurate, add
  // a little buffer zone that will give collision
  var buffer = 0.1;    // higher # = less accurate

  // if the two distances are equal to the line's
  // length, the point is on the line!
  // note we use the buffer here to give a range,
  // rather than one #
  if (d1+d2 >= lineLen-buffer && d1+d2 <= lineLen+buffer) {
    return true;
  }
  return false;
}