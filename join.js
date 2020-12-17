var golfX = 0
var golfY = 0
var velY = 0
var velX = 0
var holeX, holeY
var checkX, checkY
var myCanvas
var roomCode
var playerNum
var ready = false
var gameStart = false
var grid = new Array(8);
function setup() {
  myCanvas = createCanvas(1545,1040)
  strokeCap(PROJECT)
  for (var i = 0; i < 8; i++) {
    grid[i] = new Array(8)
  }
  getCode()
}
function draw() {
  myCanvas.position((window.innerWidth-1545)/2, (window.innerHeight-1040)/2)
  if(gameStart){
    clear()
    drawCourse(0)
    drawCourse(1)
  }
}

function getCode() {
  roomCode = -1
  while(roomCode < 0 || roomCode > 9999)
    roomCode = window.prompt("Enter the host's room code: ")
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
  var validRoom
  firebase.database().ref(roomCode + "/started").once('value').then(function(snapshot) {
    if(snapshot.val() == null) {
      window.alert("This room does not exist!")
      getCode()
    }
    else if(snapshot.val().started == 1) {
      window.alert("This room has already started!")
      getCode()
    }
    else {
      firebase.database().ref(roomCode + "/numPlayers").once('value').then(function(snapshot2) {
        if(snapshot2.val().numPlayers == snapshot2.val().players){
          window.alert("An error has occured!")
          getCode()
        }
        firebase.database().ref(roomCode + "/numPlayers/players").transaction(function(snapshot3) {
          playerNum = snapshot3 + 1;
          gameStart = true
          firebase.database().ref(roomCode + "/gameInfo/gameBoard").once('value').then( function(data) {
		        var pushedBoard = data.val();
            var stringNum = 0
            for(var i = 0; i < 8; i++) {
              for(var j = 0; j < 8; j++) {
                grid[i][j] = parseInt(pushedBoard.substring(stringNum,stringNum+1))
                stringNum++
              }
            }
          }); 
          firebase.database().ref(roomCode + "/gameInfo/holex").once('value').then( function(data) {
		        holeX = holex 
          });
          firebase.database().ref(roomCode + "/gameInfo/holey").once('value').then( function(data) {
		        holeY = holey
          });
          return snapshot3 + 1;
        });
      })
    }
  });
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