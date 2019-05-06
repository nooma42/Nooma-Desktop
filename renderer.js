var toastr = require("toastr");

function setResults(data) {
	if (data != null)
	{
		if (data == "Error")
		{
			document.getElementById("loginBtn").removeAttribute("disabled");
			toastr.error("Login Incorrect!");
			return;
		}
		console.log(data);
		var response = JSON.parse(data);
		if (response.lecturerID)
		{
			localStorage.setItem("userID",response.lecturerID);
			localStorage.setItem("name",response.name);
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
			document.getElementById("loginBtn").removeAttribute("disabled");
		}
	};
		
	ajaxObj.open("POST", "https://noomamiddleware.azurewebsites.net/authenticateLecturer/", true);
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
	document.getElementById("loginBtn").setAttribute("disabled", true);
	callAjax(setResults);
}

function openRegister() {
	document.getElementById("registerContainer").style.display = "block";
	document.getElementById("loginContainer").style.display = "none";
}

function registerBack() {
	clearRegisterForm();
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
			document.getElementById("registerBtn").removeAttribute("disabled");
			toastr.success('Please sign in', "Registration Successful!");
			clearRegisterForm();
		}
		else if  (response[0].status == "emailTaken")
		{
			document.getElementById("registerBtn").removeAttribute("disabled");
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
		
	ajaxObj.open("POST", "https://noomamiddleware.azurewebsites.net/lecturer/", true);
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
	if (firstName.length > 50)
	{
		toastr.error('First Name entered is too long', 'First Name Too Long!')
		return;		
	}
	if (lastName == "")
	{
		toastr.error('Please enter your last name', 'Last Name Missing!')
		return;				
	}
	if (lastName.length > 50)
	{
		toastr.error('Last Name entered is too long', 'Last Name Too Long!')
		return;		
	}
	if (email == "")
	{
		toastr.error('Please enter your email address', 'Email Missing!')
		return;				
	}
	if (!validateEmail(email))
	{
		toastr.error('Please enter a valid email address', 'Email Invalid!')
		return;						
	}
	if (pwd == "")
	{
		toastr.error('Please enter your password', 'Password Missing!')
		return;				
	}
	if (pwd.length < 8)
	{
		toastr.error('Please enter a password with atleast 8 characters', 'Password Too Short!')
		return;					
	}
	//bcrypt max length limits here, 50 is sensible
	if (pwd.length > 50)
	{
		toastr.error('Please enter a shorter password','Password Too Long')
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
	document.getElementById("registerBtn").setAttribute("disabled", true);
	callAjax2(body, setResults2);
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function clearRegisterForm()
{
	document.getElementById("firstNameInput").value = "";
	document.getElementById("lastNameInput").value = "";
	document.getElementById("rEmailInput").value = "";
	document.getElementById("pwdInput").value = "";
	document.getElementById("confirmPwdInput").value = "";	
}
