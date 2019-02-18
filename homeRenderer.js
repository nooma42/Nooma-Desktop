var QRCode = require('qrcode');


socket = io.connect('http://localhost:9001', {
		'connect timeout': 5000,
		'reconnectionAttempts': 3
	});
	
	
socket.on('connect', function () {
	var mainContent = document.getElementById("mainContent")
	var newMsg = document.createElement("p");
	newMsg.innerHTML = "Connected!";
	mainContent.appendChild(newMsg);
});

window.onload = function() {
	console.log("loaded page!");
	clearRoomList();
	getRoomList();
};

function clearRoomList(){	
	var roomList = document.getElementById("roomList");
	while (roomList.hasChildNodes()) {   
	roomList.removeChild(roomList.firstChild);
	}
}

function getRoomList(){
	
}

function createRoomList(){
	
}

function changeTab(evt, tabName) {

	
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  
    if (tabName == "JoinCode")
  {
	var qrCanvas = document.getElementById('qrCanvas');

	
	QRCode.toCanvas(qrCanvas, 'AAAA-AAAA',{ width: 200 }, function (error) {
	  if (error) console.error(error)
	  console.log('success!');
	})	  
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

function roomSelect(clickedID) {
	console.log("click room " + clickedID + "!");
}

function logout()
{
		window.location.href = 'index.html'
}