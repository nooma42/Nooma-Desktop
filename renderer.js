

function setResults(data) {
	if (data != null)
	{
		console.log(data);
		if (data == "true")
		{
			window.location.href = 'home.html'
		}
		else
		{
			
		}
	}
}

function callAjax(callback) {
	var ajaxObj = new XMLHttpRequest();
	ajaxObj.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			console.log(" complete!");
			callback(this.responseText);
		} 
		else if (this.readyState == 4) {
			console.log("Error, Couldn't get response");
		}
	};
		
	ajaxObj.open("POST", "http://localhost:9001/authenticate/", true);
	ajaxObj.setRequestHeader("Content-Type", "application/json");
	


var emailInput = document.getElementById("emailInput");
var passwordInput = document.getElementById("passwordInput");


	var body = {};
	console.log(emailInput.value);
	body.email = emailInput.value;
	body.pwd = passwordInput.value;
	//var body ={"email": "jgold@email.com", "pwd": "X"}
	var send = JSON.stringify(body);
	console.log(send);
	ajaxObj.send(send);
}


function login() {
	window.location.href = 'home.html'
	//callAjax(setResults);

}
