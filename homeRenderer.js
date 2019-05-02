var QRCode = require('qrcode');
var userID; 
var roomData;
var roomIndex;
var toastr = require("toastr");
			
socket = io.connect('https://noomamiddleware.azurewebsites.net/', {
		'connect timeout': 5000,
		'reconnectionAttempts': 3
	});
	
function connectToChannel(channelID)
{
	var obj = {};
	obj.channelID = channelID;
	var sendObj = JSON.stringify(obj);
	
	console.log("connecting to channel: " + channelID);
	socket.emit('channel', JSON.parse(sendObj));
}

socket.on('connect', function () {
	console.log("I HAVE CONNECTED TO SOCKET!");
});

	socket.on('chat', function (messageData) {
		console.log("I HAVE RECIEVED A MESSAGE!");
		console.log(messageData.sendDate);
		var msg = createMessage(messageData);
		var channelContainer = document.getElementById("channelContainer");
		channelContainer.appendChild(msg);
	});

window.onload = function() {
	
	document.getElementById("userTxt").innerHTML = "User: " + localStorage.getItem("name");
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
		
        ajaxObj.open("GET", "https://noomamiddleware.azurewebsites.net/rooms/"+userID+"?search="+searchInput, true);
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

  if (roomIndex == undefined || roomIndex == null)
  {
	toastr.warning("Select a room to view first");
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
	
	 $( "#tabs" ).show( "slide", { direction: "up" }, "slow" );
	 
  Array.prototype.slice.call(document.querySelectorAll('li')).forEach(function(element){
    // remove the selected class
    element.classList.remove('selectedRoom');
  });
	
		var joinCode = roomData[roomIndex].joinCode;
		document.getElementById("joinCode").value = joinCode;
		var qrCanvas = document.getElementById('qrCanvas');

	
	QRCode.toCanvas(qrCanvas, joinCode,{ width: 200 }, function (error) {
	  if (error) console.error(error)
	  console.log('success!');
	})	  
		
	//set settings fields
	document.getElementById("roomNameInput").value = roomData[roomIndex].roomName;
	document.getElementById("eventDateInput").value = roomData[roomIndex].eventDate;
	
	roomElement.classList.add("selectedRoom");
	
	setTitle(roomData[roomIndex].roomName);
	getChannels(roomData[roomIndex].roomID);
	changeTab(null, "Channels");
}


function setTitle(title)
{
	document.getElementById("roomTitle").innerHTML = title;
}

function logout()
{
	window.location.href = 'index.html'
}


function confirmRoomEdit(data)
{
	console.log(data);
	if (data != null)
	{
		var response = JSON.parse(data);
		console.log(response[0].status);
		if (response[0].status == "Success")
		{
			document.getElementById("settingSaveBtn").removeAttribute("disabled");
			toastr.success("Room Edited Successfully!");
			
			clearRoomList();
			getRoomList(createRoomList);
		}
		else
		{
			document.getElementById("settingSaveBtn").removeAttribute("disabled");
		}
	}	
}

function saveRoomSettings()
{
	document.getElementById("settingSaveBtn").setAttribute("disabled", true);
	var ajaxObj = new XMLHttpRequest();
	ajaxObj.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			console.log(" complete!");
			confirmRoomEdit(this.responseText);
		} else if (this.readyState == 4) {
			console.log("Error, Couldn't get response");
		}
	};
	
	console.log("save room settings!");
	var roomName = document.getElementById("roomNameInput").value;
	var eventDate = document.getElementById("eventDateInput").value;
	
	var roomID = roomData[roomIndex].roomID;

		
	ajaxObj.open("PUT", "https://noomamiddleware.azurewebsites.net/rooms/"+roomID, true);
    ajaxObj.setRequestHeader("Content-Type", "application/json");
	
	var body = {};
	body.roomName = roomName;
	body.eventDate = eventDate;
	
	var send = JSON.stringify(body);
	console.log(send);
	ajaxObj.send(send);	

}


function resetTabs()
{
 $( "#tabs" ).hide( "slide", { direction: "up" }, "slow" );
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }	
  
  document.getElementById("Default").style.display = "block";
  
}


function confirmRoomDeletion(data) {
	console.log(data);
	if (data != null)
	{
		var response = JSON.parse(data);
		console.log(response[0].status);
		if (response[0].status == "Success")
		{
			document.getElementById("removeRoomBtn").removeAttribute("disabled");
			toastr.success("Room Deleted Successfully!");
			clearRoomList();
			getRoomList(createRoomList);
			setTitle("");
			roomIndex = null;
			resetTabs();
		}
		else
		{
			document.getElementById("removeRoomBtn").removeAttribute("disabled");
		}
	}
}

function removeRoom()
{
	console.log("trying to remove room..");
	document.getElementById("removeRoomBtn").setAttribute("disabled", true);
	console.log("close");
	 var ajaxObj = new XMLHttpRequest();
       ajaxObj.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(" complete!");
                confirmRoomDeletion(this.responseText);
            } else if (this.readyState == 4) {
                console.log("Error, Couldn't get response");
            }
        };
		
	var roomID = roomData[roomIndex].roomID;
	ajaxObj.open("DELETE", "https://noomamiddleware.azurewebsites.net/rooms/"+roomID, true);
    ajaxObj.setRequestHeader("Content-Type", "application/json");

    ajaxObj.send();
}

function openPicker(idVal)
{
	//get current date, so that dates in the past can't be picked
	var dateToday = new Date();
	$( "#" + idVal).datepicker({minDate: dateToday, dateFormat: 'dd/mm/y' }).datepicker("show");
}

function addRoomOverlay()
{
	var modalContent = document.createElement("div");
	modalContent.classList.add('modal-content');

	var closeModalBtn = document.createElement("span");
	closeModalBtn.classList.add('close');
	closeModalBtn.innerHTML = "&times;";
	closeModalBtn.onclick = function() {closeModal()};
	
	var modalTitle = document.createElement("p");
	modalTitle.classList.add('popupTitle');
	modalTitle.innerHTML = "Add Room";
	
	var roomNameInput = document.createElement("input");
	roomNameInput.id = "newRoomNameInput";
	roomNameInput.placeholder = "Room Name";

	var roomDateInput = document.createElement("input");
	roomDateInput.id = "newRoomDateInput";
	roomDateInput.placeholder = "Event Date";
	roomDateInput.readOnly = true;
	roomDateInput.onclick = function(){openPicker(roomDateInput.id)}
	
	var addModalBtn  = document.createElement("button");
	addModalBtn.id = "addRoomModBtn";
	addModalBtn.onclick = function(){addRoom()};
	addModalBtn.innerHTML = "Add Room";
	
	modalContent.appendChild(closeModalBtn);
	modalContent.appendChild(modalTitle);
	modalContent.appendChild(roomNameInput);
	modalContent.appendChild(roomDateInput);
	modalContent.appendChild(addModalBtn);

	createModal(modalContent);
}



function confirmRoomAddition(data) {
	console.log(data);
	if (data != null)
	{
		var response = JSON.parse(data);
		console.log(response[0].status);
		if (response[0].status == "Success")
		{
			document.getElementById("addRoomModBtn").setAttribute("disabled", false);
			toastr.success("Room Added Successfully!");
			
			var modal = document.getElementById('myModal');
			modal.style.display = "none";
			
			clearRoomList();
			getRoomList(createRoomList);
		}
		else
		{
			document.getElementById("addRoomModBtn").setAttribute("disabled", false);
		}
	}
}


function addRoom()
{
	document.getElementById("addRoomModBtn").setAttribute("disabled", true);
	 var ajaxObj = new XMLHttpRequest();
       ajaxObj.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(" complete!");
				confirmRoomAddition(this.responseText);
            } else if (this.readyState == 4) {
                console.log("Error, Couldn't get response");
            }
        };
		
	ajaxObj.open("POST", "https://noomamiddleware.azurewebsites.net/rooms/"+userID, true);
    ajaxObj.setRequestHeader("Content-Type", "application/json");
	
	var body = {};
	var newRoomName = document.getElementById("newRoomNameInput").value;
	var newRoomDate = document.getElementById("newRoomDateInput").value;
	
	body.roomName = newRoomName;
	body.eventDate = newRoomDate;
	
	var send = JSON.stringify(body);
	console.log(send);
	ajaxObj.send(send);
}


function createMessage(messageData)
{
	console.log("same!");
	var messageContainer = document.createElement("div");
	messageContainer.classList.add('messageContainer');
	
	
	var sendDate = new Date(messageData.sendDate);
	
	var timeString = sendDate.toLocaleTimeString(undefined, {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	})

	var messageTitle = document.createElement("p");
	messageTitle.classList.add('messageTitle');
	messageTitle.innerHTML = messageData.username + " - " + messageData.sendDate;
	
	var messageContent = document.createElement("p");
	messageContent.classList.add('messageContent');
	messageContent.innerHTML = messageData.messageContent;
	
	var deleteBtn = document.createElement("img");
	deleteBtn.classList.add('deleteMsgBtn');
	deleteBtn.src = "assets/cancel.svg";
	deleteBtn.onclick = "removeMessage()";
	
	messageContainer.appendChild(messageTitle);
	messageContainer.appendChild(messageContent);
	messageContainer.appendChild(deleteBtn);
	
	return messageContainer;
}

function channelChatResponse(data, channelID)
{
	if (data != null)
	{
		var response = JSON.parse(data);
		
		//reset message contents...
		var channelContainer = document.getElementById("channelContainer");
		channelContainer.innerHTML = "";
		console.log(response.length);
		for (var i = response.length-1; i >= 0; i--)
		{
			console.log("%% "+ response[i].sendDate);
			var message = createMessage(response[i]);
			console.log(message);
			channelContainer.appendChild(message);
		}
		
		//now connect to the socket for future messages...
		connectToChannel(channelID);
	}
}

function getChannelChat()
{
	var channelID = document.getElementById("channelSelect").value;
	
	if (channelID == undefined)
	{
		return;
	}
	
	 var ajaxObj = new XMLHttpRequest();
       ajaxObj.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(" complete!");
				channelChatResponse(this.responseText, channelID);
            } else if (this.readyState == 4) {
                console.log("Error, Couldn't get response");
            }
        };
		
	ajaxObj.open("GET", "https://noomamiddleware.azurewebsites.net/channelMessages/"+channelID, true);
    ajaxObj.setRequestHeader("Content-Type", "application/json");

	ajaxObj.send();
}

function channelResponse(data)
{
	if (data != null)
	{
		var response = JSON.parse(data);
		
		var channelSelecter = document.getElementById("channelSelect");
		channelSelecter.innerHTML = '';
		console.log(response.length);
		for (var i = 0; i < response.length; i++)
		{
			console.log(response[i].channelID + " - " + response[i].channelName);
			var channel = document.createElement("option");
			channel.value = response[i].channelID;
			channel.text = response[i].channelName;
			channelSelecter.appendChild(channel);
		}
		
		//if there is atleast one, load the first channels chat history
		if(response.length > 0)
		{
			getChannelChat(response[0].channelID);
		}
	}
}

function getChannels(roomID)
{
			var channelContainer = document.getElementById("channelContainer");
		channelContainer.innerHTML = "";
		
	 var ajaxObj = new XMLHttpRequest();
       ajaxObj.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(" complete!");
				channelResponse(this.responseText);
            } else if (this.readyState == 4) {
                console.log("Error, Couldn't get response");
            }
        };
		
	ajaxObj.open("GET", "https://noomamiddleware.azurewebsites.net/channels/"+roomID, true);
    ajaxObj.setRequestHeader("Content-Type", "application/json");

	ajaxObj.send();	
}

function closeModal()
{
	var modal = document.getElementById('myModal');
	modal.style.display = "none";
}

function createModal(modalContent)
{
	var modal = document.getElementById('myModal');
	modal.innerHTML = "";

	modal.appendChild(modalContent);
	
	modal.style.display = "block";
}

function channelDeleteResponse(data)
{
	console.log("data:" +data);
	if(data != null)
	{
		var response = JSON.parse(data);
		if (response[0].status == "Success")
		{
			document.getElementById("deleteModalBtn").setAttribute("disabled", false);
			toastr.success("Channel Deleted Successfully!");
			closeModal();
			getChannels(roomData[roomIndex].roomID);
		}
		else
		{
			document.getElementById("deleteModalBtn").setAttribute("disabled", false);
		}
	}
}

function confirmDeleteChannel(channelID)
{ 
	console.log("delete channel id " + channelID);
	document.getElementById("deleteModalBtn").setAttribute("disabled", true);
	
	 var ajaxObj = new XMLHttpRequest();
       ajaxObj.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(" complete!");
				channelDeleteResponse(this.responseText);
            } else if (this.readyState == 4) {
                console.log("Error, Couldn't get response");
            }
        };
		
	ajaxObj.open("DELETE", "https://noomamiddleware.azurewebsites.net/channel/"+channelID, true);
    ajaxObj.setRequestHeader("Content-Type", "application/json");

	ajaxObj.send();		
}

function deleteChannel()
{
	var channelSelect = document.getElementById("channelSelect");
	
	var channelID = channelSelect.value;	
	var i = channelSelect.selectedIndex;
    var channelName = channelSelect.options[i].text;
	
	var modalContent = document.createElement("div");
	modalContent.classList.add('modal-content');

	var closeModalBtn = document.createElement("span");
	closeModalBtn.classList.add('close');
	closeModalBtn.innerHTML = "&times;";
	closeModalBtn.onclick = function() {closeModal()};
	
	var modalTitle = document.createElement("p");
	modalTitle.classList.add('popupTitle');
	modalTitle.innerHTML = "Delete Channel";
	
	var deleteModalContent = document.createElement("p");
	deleteModalContent.id = "modalText";
	deleteModalContent.innerHTML = "Are you sure you want to delete the \"" + channelName + "\" channel for the \"" + roomData[roomIndex].roomName + "\" room?";
	
	var deleteModalBtn = document.createElement("button");
	deleteModalBtn.id = "deleteModalBtn";
	deleteModalBtn.onclick = function(){confirmDeleteChannel(channelID)};
	deleteModalBtn.innerHTML = "Delete Channel";
	
	modalContent.appendChild(closeModalBtn);
	modalContent.appendChild(modalTitle);
	modalContent.appendChild(deleteModalContent);
	modalContent.appendChild(deleteModalBtn);
	
	createModal(modalContent);
	 
}

function channelAddResponse(data)
{
	if(data != null)
	{
		var response = JSON.parse(data);
		
		if (response[0].status == "Success")
		{
			document.getElementById("addModalBtn").setAttribute("disabled", false);
			toastr.success("Channel Added Successfully!");
			closeModal();
			getChannels(roomData[roomIndex].roomID);
		}
	}
}

function confirmAddChannel()
{
	var channelName = document.getElementById("newChannelNameInput").value;
	document.getElementById("addModalBtn").setAttribute("disabled", true);
	
	 var ajaxObj = new XMLHttpRequest();
       ajaxObj.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(" complete!");
				channelAddResponse(this.responseText);
            } else if (this.readyState == 4) {
                console.log("Error, Couldn't get response");
            }
        };
		
	ajaxObj.open("POST", "https://noomamiddleware.azurewebsites.net/channels/"+roomData[roomIndex].roomID, true);
    ajaxObj.setRequestHeader("Content-Type", "application/json");

	var body = {};
	body.channelName = channelName;
	
	var send = JSON.stringify(body);
	ajaxObj.send(send);	
}

function addChannel()
{
	var modalContent = document.createElement("div");
	modalContent.classList.add('modal-content');

	var closeModalBtn = document.createElement("span");
	closeModalBtn.classList.add('close');
	closeModalBtn.innerHTML = "&times;";
	closeModalBtn.onclick = function() {closeModal()};
	
	var modalTitle = document.createElement("p");
	modalTitle.classList.add('popupTitle');
	modalTitle.innerHTML = "Add Channel";
	
	var channelNameInput = document.createElement("input");
	channelNameInput.id = "newChannelNameInput";
	channelNameInput.placeholder = "Channel Name";

	var addModalBtn  = document.createElement("button");
	addModalBtn.id = "addModalBtn";
	addModalBtn.onclick = function(){confirmAddChannel()};
	addModalBtn.innerHTML = "Add Channel";
	
	modalContent.appendChild(closeModalBtn);
	modalContent.appendChild(modalTitle);
	modalContent.appendChild(channelNameInput);
	modalContent.appendChild(addModalBtn);

	createModal(modalContent);
}