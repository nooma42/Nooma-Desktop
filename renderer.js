var toastr = require("toastr");

function setResults(data) {
	if (data != null)
	{
		if (data == "Error")
		{
			toastr.error("Problem logging in!");
			return;
		}
		console.log(data);
		var response = JSON.parse(data);
		if (response.userID)
		{
			localStorage.setItem("userID",response.userID)
			window.location.href = 'home.html'
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
	//window.location.href = 'home.html'
	callAjax(setResults);
}

function openRegister() {
	document.getElementById("registerContainer").style.display = "block";
	document.getElementById("loginContainer").style.display = "none";
}

function registerBack() {
	document.getElementById("registerContainer").style.display = "none";
	document.getElementById("loginContainer").style.display = "block";
}

function setResults2(data) {
	if (data != null)
	{
		console.log(data);
		var response = JSON.parse(data);
		console.log(response[0].status);
		if (response[0].status == "Success")
		{
			registerBack();
			toastr.success('Please sign in', "Registration Successful!");
		}
		else if  (response[0].status == "emailTaken")
		{
			toastr.error('That email is in use, please use a different email address', 'Email In Use!')
		}
	}
}

function callAjax2(body, callback) {
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
		
	ajaxObj.open("POST", "http://localhost:9001/users/", true);
	ajaxObj.setRequestHeader("Content-Type", "application/json");
	

	var send = JSON.stringify(body);
	console.log(send);
	ajaxObj.send(send);
}

function register() {
	console.log("reg event");
	//get values from inputs
	var firstName = document.getElementById("firstNameInput").value;
	var lastName = document.getElementById("lastNameInput").value;
	var email = document.getElementById("rEmailInput").value;
	var pwd = document.getElementById("pwdInput").value;
	var confirmPwd = document.getElementById("confirmPwdInput").value;
	
	
	//validation

	if (firstName == "")
	{
		toastr.error('Please enter your first name', 'First Name Missing!')
		return;		
	}
	if (lastName == "")
	{
		toastr.error('Please enter your last name', 'Last Name Missing!')
		return;				
	}
	if (email == "")
	{
		toastr.error('Please enter your email address', 'Email Missing!')
		return;				
	}
	if (pwd == "")
	{
		toastr.error('Please enter your password', 'Password Missing!')
		return;				
	}
	else if (pwd != confirmPwd)
	{
		toastr.error('Your password and confirmation password do not match', 'Passwords Don\'t Match!')
		return;
	}
	
	//all good, attempt to create user
	//{"firstName": "Jeff", "lastName": "Gold", "email": "jgold@email.com", "pwd": "X"}
	var body = {}
	body.firstName = firstName;
	body.lastName = lastName;
	body.email = email;
	body.pwd = pwd;
	callAjax2(body, setResults2);
}

