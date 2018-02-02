function logout( username ) {
	if (document.all) {
		// IE clears HTTP Authentication
		document.execCommand("ClearAuthenticationCache");
	}
	var request = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("MSXML2.XMLHTTP.3.0");
	
	request.open("GET", "/forcelogout.txt", false, username , "logout" );
	request.send("");
	if ( window.location.search == "" ) {
		window.location = "/logout.html?check"
	}
}

