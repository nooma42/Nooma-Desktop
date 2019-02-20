var QRCode = require('qrcode');
var userID; 
var roomData;
var roomIndex;

socket = io.connect('http://localhost:9001', {
		'connect timeout': 5000,
		'reconnectionAttempts': 3
	});
	
	
socket.on('connect', function () {
	var mainContent = document.getElementById("mainContent")
	var newMsg = document.createElement("p");
	newMsg.innerHTML = "Connected!";
	//mainContent.appendChild(newMsg);
});


window.onload = function() {
	
	var input = document.getElementById("searchRooms");
	input.addEventListener("keyup", function(event) {
	// Number 13 is the "Enter" key on the keyboard
	console.log(event.keyCode);
	  if (event.keyCode === 13) {
		// Cancel the default action, if needed
		event.preventDefault();
		// Trigger the button element with a click
		clearRoomList();
		getRoomList(createRoomList);
	  }
	});

	userID = localStorage.getItem("userID");
	console.log("loaded page! " + userID);
	clearRoomList();
	getRoomList(createRoomList);
};

function clearRoomList(){	
	var roomList = document.getElementById("roomList");
	while (roomList.hasChildNodes()) {   
	roomList.removeChild(roomList.firstChild);
	}
}

function getRoomList(callback) {
    if (userID != null) {
        var ajaxObj = new XMLHttpRequest();
        ajaxObj.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(" complete!");
                callback(this.responseText);
            } else if (this.readyState == 4) {
                console.log("Error, Couldn't get response");
            }
        };
		
        var searchInput = document.getElementById("searchRooms").value;
		console.log("input: " + searchInput);
		if(searchInput.length == 0)
		{
			console.log("empty search..");
			searchInput = "";
		}		
		
        ajaxObj.open("GET", "http://localhost:9001/rooms/"+userID+"?search="+searchInput, true);
        ajaxObj.setRequestHeader("Content-Type", "application/json");

        ajaxObj.send();
    }
}

function createRoomList(data) {
	if (data != null)
	{
		roomData = JSON.parse(data);
		console.log(roomData);

		for(var i = 0; i < roomData.length; i++)
		{
			var roomLi = document.createElement("li");
			roomLi.id = i;
			//roomData[i].roomID;
			roomLi.onclick =  function(){ roomSelect(this) }
			
			
			var roomNameTxt = document.createElement("p");
			roomNameTxt.innerHTML = roomData[i].roomName;
			roomNameTxt.className = "roomName";
	
			var roomDateTxt = document.createElement("p");
			roomDateTxt.innerHTML = roomData[i].eventDate;
			roomDateTxt.className = "roomDate";
			
			roomLi.appendChild(roomNameTxt);  
			roomLi.appendChild(roomDateTxt);  
			
			document.getElementById("roomList").appendChild(roomLi);  
			
		}
	}
}



function changeTab(evt, tabName) {

  if (roomIndex == undefined)
  {
	return;  
  }
  
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
		var joinCode = roomData[roomIndex].joinCode;
		document.getElementById("joinCode").value = joinCode;
		var qrCanvas = document.getElementById('qrCanvas');

	
	QRCode.toCanvas(qrCanvas, joinCode,{ width: 200 }, function (error) {
	  if (error) console.error(error)
	  console.log('success!');
	})	  
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

function roomSelect(roomElement) {
	roomIndex = roomElement.id;
	console.log("click room " + roomIndex + "!");
	roomElement.style.backgroundColor = "red";
	
	setTitle(roomData[roomIndex].roomName);
	
}


function setTitle(title)
{
	document.getElementById("roomTitle").innerHTML = title;
}

function logout()
{
		window.location.href = 'index.html'
}