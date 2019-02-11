
function setResults(data) {
	if (data != null)
	{
		console.log(data);
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
			console.log("Error, Question data could not be aquired...");
		}
	};
		
	ajaxObj.open("POST", "http://localhost:9001/authenticate/", true);
	ajaxObj.setRequestHeader("Content-Type", "application/json");
	
	var body ={"email": "jgold@email.com", "pwd": "X"}
	var send = JSON.stringify(body);
	console.log(send);
	ajaxObj.send(send);
}


function login() {
	console.log("clicky!");
	callAjax(setResults);

}
