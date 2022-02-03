/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author Zeen Wang
 * S1G2 CSSE333
 */

/** namespace. */
var rhit = rhit || {};

/** globals */
rhit.variableName = "";
rhit.url = "http://127.0.0.1:8080/"
rhit.userManager = null;

/** function and class syntax examples */
rhit.functionName = function () {
	/** function body */
};


/* Controls the login page (login.html) */
rhit.LoginPageController = class {
	constructor() {
		console.log("LoginPage");
		document.querySelector("#submitSignIn").onclick = (params) => {
			const username = document.querySelector("#username").value
			const password = document.querySelector("#password").value
			console.log(rhit.url + 'signUp');
			fetch(rhit.url + 'signUp', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						'username': username,
						'hash': password
					})
				})
				.then(response => {
					console.log("status is " + response.status);
					return response.json();
				})
				.then(data => {
					console.log(data);
					if (data.status == 0) {
						rhit.userManager.signIn(username);	
						console.log("Successful SignUp");
						console.log("Redirecting");
						window.location.href = '/home.html';
					}
				})
				.catch(error => console.log("Request failed", error));

		}
	}


}

/* Controls the homepage (index.html) */
rhit.HomePageController = class {
	constructor() {

	}

	methodName() {

	}

	get isSignedIn() {

	}
}


/* Controls the game pages (Names TBD)  */
rhit.GamePageController = class {
	constructor() {

	}

	methodName() {

	}
}

/* Manages the User class */
rhit.UserManager = class {
	constructor() {
		this._user = null;
	}

	signIn(username) {
		this._user = username;
	}

	signOut() {
		this._user = null;
	}

	get isSignedIn() {
		return !!this._user;
	}

	get uid() {
		return this._user.uid;
	}
}

/* User class, to store information about a user of Vapor */
rhit.User = class {
	constructor() {

	}

	methodName() {

	}
}

rhit.checkForRedirects = function () {
	if (document.querySelector("#loginPage") && rhit.userManager.isSignedIn) {
		window.location.href = "/home.html";
	}
	if (!document.querySelector("#loginPage") && !rhit.userManager.isSignedIn) {
		window.location.href = "/login.html";
	}
};

rhit.initializePage = function () {
	if (document.querySelector("#loginPage")) {
		console.log("You are on the login page");
		new rhit.LoginPageController();
	}

	// if (document.querySelector("#homePage")) {
	// 	console.log("You are on the list page");
	// 	rhit.fbMovieQuotesManager = new rhit.FBMovieQuotesManager();
	// 	new rhit.ListPageController();
	// }

	// if (document.querySelector("#gamePage")) {
	// 	console.log("You are on the detail page");
	// 	//new rhit.ListPageController();
	// 	//const movieQuoteId = rhit.storage.getMovieQuoteId();
	// 	const queryString = window.location.search;
	// 	const urlParams = new URLSearchParams(queryString);
	// 	const movieQuoteId = urlParams.get("id");
	// 	console.log(`Detail page for ${movieQuoteId}`);


	// 	if (!movieQuoteId) {
	// 		console.log("Error! Missing movie quote id!");
	// 		window.location.herf = "/";
	// 	}

	// 	rhit.fbSingleQuoteManager = new rhit.FBSingleQuoteManager(movieQuoteId);
	// 	new rhit.DetailPageController(movieQuoteId);
	// }
};


/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	rhit.userManager = new this.UserManager();
	rhit.checkForRedirects();
	rhit.initializePage();
};

rhit.main();