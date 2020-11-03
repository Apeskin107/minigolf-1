var roomCode
var playerNum
var ready = false

  while(!ready) {
    bruh()
  }
    function bruh() {
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
    console.log(snapshot.val().started)
  
    });
    }
