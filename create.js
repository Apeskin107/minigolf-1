  var games = new Array()
  var rootRef = firebase.database().ref()
	rootRef.on('child_added', function(data) {
		games.push(data.key);
  }); 
  var gameStart = false
function setup() {
  var numPlayers = 0
  while(numPlayers != 2 && numPlayers != 3 && numPlayers != 4)
    numPlayers = window.prompt("How many players will be in your party? (2-4)")
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
  firebase.database().ref(roomCode + "/time").set({
    creationDate: new Date().getTime()
  });
  firebase.database().ref(roomCode + "/numPlayers").set({
    numPlayers: numPlayers,
    players: 1
  });
  firebase.database().ref(roomCode + "/numPlayers").set({
    numPlayers: numPlayers,
    players: 1
  });
  firebase.database().ref(roomCode + "/started").set({
    started: 0
  });
  firebase.database().ref(roomCode + "/gameInfo").set({
    gameBoard: "1111111111111111111111111111111111111111111111111111111111111111",
    playerTurn: 1,
    holeX: 65,
    holeY: 65,
    ballX: 977,
    ballY: 977,
    holeNum: 1,
    currStrokes: 0
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
  myCanvas = createCanvas(1545,1040)
  background(0,127,0)
  textAlign(CENTER)
  textSize(128)
  fill(255,0,0)
  text('Room Code: ' + roomCode,773,521)
  var myFunc = function(data) {console.log(data.val()); if(data.val() == numPlayers){gameStart = true; firebase.database().ref(roomCode + "/started").set({started: 1}); firebase.database().ref(roomCode + "/numPlayers").off('child_changed', myFunc);}}
  firebase.database().ref(roomCode + "/numPlayers").on('child_changed', myFunc);
}
function draw() {
  myCanvas.position((window.innerWidth-1545)/2, (window.innerHeight-1040)/2)
  if(gameStart) {

  }
}

