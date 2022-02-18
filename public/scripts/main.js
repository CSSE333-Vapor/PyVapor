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
rhit.requestAPI = null;
rhit.gamesManager = null;
rhit.reviewManager = null;

// md5 encrypt from https://www.cnblogs.com/lqqmigo/p/13583105.html
rhit.md5 = function MD5(instring) {
	var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase        */
	var b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance   */

	/*
	 * These are the functions you'll usually want to call
	 * They take string arguments and return either hex or base-64 encoded strings
	 */
	function hex_md5(s) {
		return rstr2hex(rstr_md5(str2rstr_utf8(s)));
	}

	function b64_md5(s) {
		return rstr2b64(rstr_md5(str2rstr_utf8(s)));
	}

	function any_md5(s, e) {
		return rstr2any(rstr_md5(str2rstr_utf8(s)), e);
	}

	function hex_hmac_md5(k, d) {
		return rstr2hex(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)));
	}

	function b64_hmac_md5(k, d) {
		return rstr2b64(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)));
	}

	function any_hmac_md5(k, d, e) {
		return rstr2any(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)), e);
	}

	/*
	 * Perform a simple self-test to see if the VM is working
	 */
	function md5_vm_test() {
		return hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72";
	}

	/*
	 * Calculate the MD5 of a raw string
	 */
	function rstr_md5(s) {
		return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
	}

	/*
	 * Calculate the HMAC-MD5, of a key and some data (raw strings)
	 */
	function rstr_hmac_md5(key, data) {
		var bkey = rstr2binl(key);
		if (bkey.length > 16) bkey = binl_md5(bkey, key.length * 8);

		var ipad = Array(16),
			opad = Array(16);
		for (var i = 0; i < 16; i++) {
			ipad[i] = bkey[i] ^ 0x36363636;
			opad[i] = bkey[i] ^ 0x5C5C5C5C;
		}

		var hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
		return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
	}

	/*
	 * Convert a raw string to a hex string
	 */
	function rstr2hex(input) {
		try {
			hexcase
		} catch (e) {
			hexcase = 0;
		}
		var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
		var output = "";
		var x;
		for (var i = 0; i < input.length; i++) {
			x = input.charCodeAt(i);
			output += hex_tab.charAt((x >>> 4) & 0x0F) +
				hex_tab.charAt(x & 0x0F);
		}
		return output;
	}

	/*
	 * Convert a raw string to a base-64 string
	 */
	function rstr2b64(input) {
		try {
			b64pad
		} catch (e) {
			b64pad = '';
		}
		var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		var output = "";
		var len = input.length;
		for (var i = 0; i < len; i += 3) {
			var triplet = (input.charCodeAt(i) << 16) |
				(i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) |
				(i + 2 < len ? input.charCodeAt(i + 2) : 0);
			for (var j = 0; j < 4; j++) {
				if (i * 8 + j * 6 > input.length * 8) output += b64pad;
				else output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
			}
		}
		return output;
	}

	/*
	 * Convert a raw string to an arbitrary string encoding
	 */
	function rstr2any(input, encoding) {
		var divisor = encoding.length;
		var i, j, q, x, quotient;

		/* Convert to an array of 16-bit big-endian values, forming the dividend */
		var dividend = Array(Math.ceil(input.length / 2));
		for (i = 0; i < dividend.length; i++) {
			dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
		}

		/*
		 * Repeatedly perform a long division. The binary array forms the dividend,
		 * the length of the encoding is the divisor. Once computed, the quotient
		 * forms the dividend for the next step. All remainders are stored for later
		 * use.
		 */
		var full_length = Math.ceil(input.length * 8 /
			(Math.log(encoding.length) / Math.log(2)));
		var remainders = Array(full_length);
		for (j = 0; j < full_length; j++) {
			quotient = Array();
			x = 0;
			for (i = 0; i < dividend.length; i++) {
				x = (x << 16) + dividend[i];
				q = Math.floor(x / divisor);
				x -= q * divisor;
				if (quotient.length > 0 || q > 0)
					quotient[quotient.length] = q;
			}
			remainders[j] = x;
			dividend = quotient;
		}

		/* Convert the remainders to the output string */
		var output = "";
		for (i = remainders.length - 1; i >= 0; i--)
			output += encoding.charAt(remainders[i]);

		return output;
	}

	/*
	 * Encode a string as utf-8.
	 * For efficiency, this assumes the input is valid utf-16.
	 */
	function str2rstr_utf8(input) {
		var output = "";
		var i = -1;
		var x, y;

		while (++i < input.length) {
			/* Decode utf-16 surrogate pairs */
			x = input.charCodeAt(i);
			y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
			if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
				x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
				i++;
			}

			/* Encode output as utf-8 */
			if (x <= 0x7F)
				output += String.fromCharCode(x);
			else if (x <= 0x7FF)
				output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F),
					0x80 | (x & 0x3F));
			else if (x <= 0xFFFF)
				output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
					0x80 | ((x >>> 6) & 0x3F),
					0x80 | (x & 0x3F));
			else if (x <= 0x1FFFFF)
				output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
					0x80 | ((x >>> 12) & 0x3F),
					0x80 | ((x >>> 6) & 0x3F),
					0x80 | (x & 0x3F));
		}
		return output;
	}

	/*
	 * Encode a string as utf-16
	 */
	function str2rstr_utf16le(input) {
		var output = "";
		for (var i = 0; i < input.length; i++)
			output += String.fromCharCode(input.charCodeAt(i) & 0xFF,
				(input.charCodeAt(i) >>> 8) & 0xFF);
		return output;
	}

	function str2rstr_utf16be(input) {
		var output = "";
		for (var i = 0; i < input.length; i++)
			output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
				input.charCodeAt(i) & 0xFF);
		return output;
	}

	/*
	 * Convert a raw string to an array of little-endian words
	 * Characters >255 have their high-byte silently ignored.
	 */
	function rstr2binl(input) {
		var output = Array(input.length >> 2);
		for (var i = 0; i < output.length; i++)
			output[i] = 0;
		for (var i = 0; i < input.length * 8; i += 8)
			output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
		return output;
	}

	/*
	 * Convert an array of little-endian words to a string
	 */
	function binl2rstr(input) {
		var output = "";
		for (var i = 0; i < input.length * 32; i += 8)
			output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
		return output;
	}

	/*
	 * Calculate the MD5 of an array of little-endian words, and a bit length.
	 */
	function binl_md5(x, len) {
		/* append padding */
		x[len >> 5] |= 0x80 << ((len) % 32);
		x[(((len + 64) >>> 9) << 4) + 14] = len;

		var a = 1732584193;
		var b = -271733879;
		var c = -1732584194;
		var d = 271733878;

		for (var i = 0; i < x.length; i += 16) {
			var olda = a;
			var oldb = b;
			var oldc = c;
			var oldd = d;

			a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
			d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
			c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
			b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
			a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
			d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
			c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
			b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
			a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
			d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
			c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
			b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
			a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
			d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
			c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
			b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

			a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
			d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
			c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
			b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
			a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
			d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
			c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
			b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
			a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
			d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
			c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
			b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
			a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
			d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
			c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
			b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

			a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
			d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
			c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
			b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
			a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
			d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
			c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
			b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
			a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
			d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
			c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
			b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
			a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
			d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
			c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
			b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

			a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
			d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
			c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
			b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
			a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
			d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
			c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
			b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
			a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
			d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
			c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
			b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
			a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
			d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
			c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
			b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

			a = safe_add(a, olda);
			b = safe_add(b, oldb);
			c = safe_add(c, oldc);
			d = safe_add(d, oldd);
		}
		return Array(a, b, c, d);
	}

	/*
	 * These functions implement the four basic operations the algorithm uses.
	 */
	function md5_cmn(q, a, b, x, s, t) {
		return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
	}

	function md5_ff(a, b, c, d, x, s, t) {
		return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
	}

	function md5_gg(a, b, c, d, x, s, t) {
		return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
	}

	function md5_hh(a, b, c, d, x, s, t) {
		return md5_cmn(b ^ c ^ d, a, b, x, s, t);
	}

	function md5_ii(a, b, c, d, x, s, t) {
		return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
	}

	/*
	 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	 * to work around bugs in some JS interpreters.
	 */
	function safe_add(x, y) {
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF);
	}

	/*
	 * Bitwise rotate a 32-bit number to the left.
	 */
	function bit_rol(num, cnt) {
		return (num << cnt) | (num >>> (32 - cnt));
	}

	return hex_md5(instring);
}

// From https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
/**
 * @param {String} HTML representing a single element
 * @return {Element}
 */
function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim(); // Never return a text node of whitespace as the result
	template.innerHTML = html;
	return template.content.firstChild;
}

rhit.RequestAPI = class {
	constructor(url) {
		this._url = url;
		this._headers = new Headers({
			'Content-Type': 'application/json'
		})
	}

	async signIn(username, password) {
		return fetch(rhit.url + 'login', {
				method: 'POST',
				headers: this._headers,
				body: JSON.stringify({
					'username': username,
					'hash': rhit.md5(password)
				})
			})
			.then(response => {
				console.log("status is " + response.status);
				return response.json();
			})
			.catch(error => console.log("Request failed", error));
	}



	async signUp(username, password) {
		return fetch(rhit.url + 'signUp', {
				method: 'POST',
				headers: this._headers,
				body: JSON.stringify({
					'username': username,
					'hash': rhit.md5(password)
				})
			})
			.then(response => {
				console.log("status is " + response.status);
				return response.json();
			})
			.catch(error => console.log("Request failed", error));
	}

	async getSalt(username) {
		return fetch(this._url + 'getSalt', {
				method: 'POST',
				headers: this._headers,
				body: JSON.stringify({
					'username': username
				})
			})
			.then(response => {
				console.log("status is " + response.status);
				return response.json();
			})
			.then(data => {
				console.log(data);
				if (data.status == 0) {
					return data.salt;
				}
			})
			.catch(error => console.log("Request failed", error));
	}

	async addGame(game) {
		console.log(game);
		return fetch(this._url + 'createGame', {
				method: 'POST',
				headers: this._headers,
				body: JSON.stringify({
					'name': game.name,
					'description': game.description,
					'version': game.version,
					'download': game.download,
					'price': game.price,
					'releaseDate': game.releaseDate
				})
			})
			.then(response => {
				console.log("status is " + response.status);
				return response.json();
			})
			.catch(error => console.log("Request failed", error));
	}

	async getAllGamesPage(pageNum, maxNum) {
		return fetch(this._url + 'getAllGames', {
				method: 'POST',
				headers: this._headers,
				body: JSON.stringify({
					'pageNum': pageNum,
					'maxNum': maxNum
				})
			})
			.then(response => {
				console.log("status is " + response.status);
				return response.json();
			})
			.then(data => {
				console.log(data);
				if (data.status == 0) {
					console.log(data.games);
					return data.games;
				} else {
					console.log(data);
				}
			})
			.catch(error => console.log("Request failed", error));
	}

	async getAllGames() {
		return fetch(this._url + 'getAllGames', {
				method: 'POST',
				headers: this._headers
			})
			.then(response => {
				console.log("status is " + response.status);
				return response.json();
			})
			.then(data => {
				console.log(data);
				if (data.status == 0) {
					console.log(data.games);
					return data.games;
				} else {
					console.log(data);
				}
			})
			.catch(error => console.log("Request failed", error));
	}

	async getAllGamesByName() {
		return fetch(this._url + 'getAllGamesByName', {
				method: 'POST',
				headers: this._headers
			})
			.then(response => {
				console.log("status is " + response.status);
				return response.json();
			})
			.then(data => {
				console.log(data);
				if (data.status == 0) {
					console.log(data.games);
					return data.games;
				} else {
					console.log(data);
				}
			})
			.catch(error => console.log("Request failed", error));
	}

	async deleteGame(gid) {
		return fetch(this._url + 'deleteGame', {
				method: 'POST',
				headers: this._headers,
				body: JSON.stringify({
					'gid': gid
				})
			})
			.then(response => {
				console.log("status is " + response.status);
				return response.json();
			})
			.catch(error => console.log("Request failed", error));
	}

	async addUserOwnGame(uid,gid) {
		return fetch(this._url + 'addUserOwnGame', {
				method: 'POST',
				headers: this._headers,
				body: JSON.stringify({
					'uid': uid,
					'gid': gid
					
				})
			})
			.then(response => {
				console.log("status is " + response.status);
				
				return response.json();
			})
			.catch(error => console.log("Request failed", error));
	}

	async getUserGames(uid) {
		return fetch(this._url + 'getUserGames', {
				method: 'POST',
				headers: this._headers,
				body: JSON.stringify({
					'uid': uid
				})
			})
			.then(response => {
				console.log("status is " + response.status);
				return response.json();
			})
			.then(data => {
				console.log(data);
				if (data.status == 0) {
					console.log(data.gids);
					let list = JSON.parse('['+ data.gids + ']')
					return list;
				} else {
					console.log(data);
				}
			})
			.catch(error => console.log("Request failed", error));
	}

	async deleteUserGame(uid,gid) {
		return fetch(this._url + 'deleteUserGame', {
				method: 'POST',
				headers: this._headers,
				body: JSON.stringify({
					'uid': uid,
					'gid': gid
				})
			})
			.then(response => {
				console.log("status is " + response.status);
				return response.json();
			})
			.catch(error => console.log("Request failed", error));
	}	


	async getUserReview(uid) {
		return fetch(this._url + 'getUserReview', {
				method: 'POST',
				headers: this._headers,
				body: JSON.stringify({
					'uid': uid
				})
			})
			.then(response => {
				console.log("status is " + response.status);
				return response.json();
			})
			.catch(error => console.log("Request failed", error));
	}
	async getSpecificReview(uid,gid) {
		return fetch(this._url + 'getSpecificReview', {
				method: 'POST',
				headers: this._headers,
				body: JSON.stringify({
					'uid': uid,
					'gid': gid
				})
			})
			.then(response => {
				console.log("status is " + response.status);
				return response.json();
			})
			.catch(error => console.log("Request failed", error));
	}

	async getUserProfile(uid) {
		return fetch(this._url + 'getUserProfile', {
				method: 'POST',
				headers: this._headers,
				body: JSON.stringify({
					'uid': uid
				})
			})
			.then(response => {
				console.log("status is " + response.status);
				return response.json();
			})
			.catch(error => console.log("Request failed", error));
	}
	
	async addReview(uid, gid, title, content, rating) {
		return fetch(this._url + 'addReview', {
				method: 'POST',
				headers: this._headers,
				body: JSON.stringify({
					'uid': uid,
					'gid': gid,
					'title': title,
					'content': content,
					'rating': rating,
				})
			})
			.then(response => {
				console.log("status is " + response.status);
				
				return response.json();
			})
			.catch(error => console.log("Request failed", error));
	}

	async updateReview(rid,title,content,rating) {
		return fetch(this._url + 'updateReview', {
				method: 'POST',
				headers: this._headers,
				body: JSON.stringify({
					'rid': rid,
					'title': title,
					'content': content,
					'rating': rating
				})
			})
			.then(response => {
				console.log("status is " + response.status);
				
				return response.json();
			})
		
			.catch(error => console.log("Request failed", error));
	}
	async updateUserProfile(uid,address,email,phone,role) {
		return fetch(this._url + 'updateUserProfile', {
				method: 'POST',
				headers: this._headers,
				body: JSON.stringify({
					'uid': uid,
					'address': address,
					'email': email,
					'phone': phone,
					'role': role
				})
			})
			.then(response => {
				console.log("status is " + response.status);
				
				return response.json();
			})
		
			.catch(error => console.log("Request failed", error));
	}

	async deleteReview(uid, rid) {
		console.log(uid, rid);
		return fetch(this._url + 'deleteReview', {
				method: 'POST',
				headers: this._headers,
				body: JSON.stringify({
					'uid': uid,
					'rid': rid
				})
			})
			.then(response => {
				console.log("status is " + response.status);
				return response.json();
			})
			.catch(error => console.log("Request failed", error));
	}

	async getGamesByCategory(cid) {
		return fetch(this._url + 'getGamesByCategory', {
				method: 'POST',
				headers: this._headers,
				body: JSON.stringify({
					'cid': cid
					
				})
			})
			.then(response => {
				console.log("status is " + response.status);
				return response.json();
			})
			
			.catch(error => console.log("Request failed", error));
	}

	async getReviewByGame(gid) {
		return fetch(this._url + 'getGameReview', {
				method: 'POST',
				headers: this._headers,
				body: JSON.stringify({
					'gid': gid
				})
			})
			.then(response => {
				console.log("status is " + response.status);
				return response.json();
			})
			.then(data => {
				console.log(data);
				if (data.status == 0) {
					console.log(data.reviews);
					return data.reviews;
				} else {
					console.log(data);
				}
			})
			.catch(error => console.log("Request failed", error));
	}

	async getSpecificGameByUser(uid, gid) {
		return fetch(this._url + 'getGameByUser', {
				method: 'POST',
				headers: this._headers,
				body: JSON.stringify({
					'gid': gid,
					'uid': uid
				})
			})
			.then(response => {
				console.log("status is " + response.status);
				return response.json();
			})
			.then(data => {
				console.log(data);
				if (data.status == 0) {
					console.log(data.game);
					return data.game;
				} else {
					console.log(data);
				}
			})
			.catch(error => console.log("Request failed", error));
	}

	async getBillingInfoByUser(uid) {
		return fetch(this._url + 'getBillingInfoByUser', {
				method: 'POST',
				headers: this._headers,
				body: JSON.stringify({
					'uid': uid
				})
			})
			.then(response => {
				console.log("status is " + response.status);
				return response.json();
			})
			
			.catch(error => console.log("Request failed", error));
	}

	async deleteBillingInfo(bid) {
		return fetch(this._url + 'deleteBillingInfo', {
				method: 'POST',
				headers: this._headers,
				body: JSON.stringify({
					'bid': bid
				})
			})
			.then(response => {
				console.log("status is " + response.status);
				return response.json();
			})
			.catch(error => console.log("Request failed", error));
	}

	async addBillingInfo(CCNumber,NameOnCard,uID,ExpDate,SecurityCode) {
		return fetch(this._url + 'addBillingInfo', {
				method: 'POST',
				headers: this._headers,
				body: JSON.stringify({
					'CCNumber': CCNumber,
					'NameOnCard': NameOnCard,
					'uID': uID,
					'ExpDate': ExpDate,
					'SecurityCode': SecurityCode,
				})
			})
			.then(response => {
				console.log("status is " + response.status);
				
				return response.json();
			})
		
			.catch(error => console.log("Request failed", error));
	}
}


/* Controls the login page (login.html) */
rhit.LoginPageController = class {
	constructor() {
		console.log("LoginPage");
		document.querySelector("#submitSignUp").onclick = (params) => {
			const username = document.querySelector("#inputUsername").value;
			const password = document.querySelector("#inputPassword").value;
			const errorLabel = document.querySelector("#errorMessage");
	
			if (username == '' || password == '') {
				errorLabel.innerHTML = 'Username or Password cannot be NULL';
				return;
			}

			rhit.userManager.signUp(username, password, this.updatePage.bind(this));
			this.disableBtn();
		}

		document.querySelector("#submitSignIn").onclick = (params) => {
			const username = document.querySelector("#inputUsername").value;
			const password = document.querySelector("#inputPassword").value;
			const errorLabel = document.querySelector("#errorMessage");
	
			if (username == '' || password == '') {
				errorLabel.innerHTML = 'Username or Password cannot be NULL';
				return;
			}

			rhit.userManager.signIn(username, password, this.updatePage.bind(this));
			this.disableBtn();
		}
	}

	disableBtn() {
		const SignUpBtn = document.querySelector("#submitSignUp");
		const SignInBtn = document.querySelector("#submitSignIn");
		SignInBtn.disabled = "disabled";
		SignUpBtn.disabled = "disabled";
	}

	enableBtn(){
		const SignUpBtn = document.querySelector("#submitSignUp");
		const SignInBtn = document.querySelector("#submitSignIn");
		SignInBtn.disabled = "";
		SignUpBtn.disabled = "";
	}

	updatePage(status, msg) {
		const errorLabel = document.querySelector("#errorMessage");
		this.enableBtn();
		if(status == 0) {
			console.log("Redirecting");
			window.location.href = '/gameList.html';
		} else {
			errorLabel.innerHTML = msg;
		}
	}
}

/* Controls the gamePage (index.html) */
rhit.GamePageController = class {
	constructor(gid) {
		this._game = null;
		rhit.singleGameManager = new rhit.SingleGameManager(gid);
		rhit.reviewManager = new rhit.ReviewManager(gid);

		rhit.singleGameManager.update(gid, this.updatePage.bind(this));
		rhit.reviewManager.update(gid, this.updateReview.bind(this));

		const reviewInput = document.querySelector("#newReview");
		reviewInput.onkeydown = (event) => {
			if(event.key === 'Enter') {
				console.log(reviewInput.value);
				rhit.reviewManager.addReview(reviewInput.value, this.updateReview.bind(this));
				reviewInput.value = "";
			}
		}
		// download, price, purchased, category
	}

	updatePage(game) {
		this._game = game;
		document.querySelector("#title").innerHTML = game.name;
		document.querySelector("#gameName").innerHTML = game.name;
		document.querySelector("#gameDescription").innerHTML = game.description;
		document.querySelector("#gameVersion").innerHTML = "v " + game.version;
	}

	updateReview(msg) {
		if(msg != 0) {
			const reviewInput = document.querySelector("#newReview");
			reviewInput.placeholder = msg;
			return;
		}
		const newList = htmlToElement('<div id="reviewContainer"></div>');
		const oldList = document.querySelector("#reviewContainer");
		for(let i = 0; i < rhit.reviewManager.length; i++) {
			let review = rhit.reviewManager.getReviewAt(i);
			console.log(review);
			const newReview = this._createReview(review);
			newList.appendChild(newReview);
		}
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);

		const delbtns = document.querySelectorAll(".delbtn");
		console.log(delbtns);
		for(let btn of delbtns) {
			btn.onclick = (event) => {
				rhit.reviewManager.deleteReview(btn.dataset.rid, this.updateReview.bind(this));
			}
		}
	}


	_createReview(review) {
		console.log(review.uid == rhit.userManager.uid);
		if(review.uid == rhit.userManager.uid | rhit.userManager.isAdmin) {
			return htmlToElement(`
				<div class="review">
					<!-- the comment body -->
					<div class="review-body">
						<h5>${review.title}</h5>
						<p>${review.content}</p>
					</div>
					<!-- comments toolbar -->
					<div class="review-toolbar">
						<ul>
							<li><i class="fa fa-calendar"></i>${review.time}</li>
							<li><i class="fa fa-pencil"></i>
								<span class="user">${review.username}</span>
							</li>
							<li>
								<button class="btn delbtn" data-rid="${review.rid}"><i class="fa fa-trash"></i></button>
							</li>
						</ul>
					</div>
				</div>`
			);
		} else {
			return htmlToElement(`
				<div class="review">
					<!-- the comment body -->
					<div class="review-body">
						<h5>${review.title}</h5>
						<p>${review.content}</p>
					</div>
					<!-- comments toolbar -->
					<div class="review-toolbar">
						<ul>
							<li><i class="fa fa-calendar"></i>${review.time}</li>
							<li><span class="user"><i class="fa fa-pencil"></i>
								${review.username}</span>
							</li>
						</ul>
					</div>
				</div>`
			);
		}
	}
}

rhit.ReviewManager = class {
	constructor(gid) {
		this._reviewlist = [];
		this._gid = gid;
	}

	update(gid, callback) {
		rhit.requestAPI.getReviewByGame(gid).then(data => {
			console.log(data);
			for (let row of data) {
				const review = new rhit.Review(row['rID'], row['gID'], row['uID'], row['UserName'],row['Title'], row['Content'], row['Rating'], row['Time'], );
				this._reviewlist.push(review);
				console.log(review);
			}
			console.log(this._reviewlist);
			if(callback != null)
				callback(0);
		})
	}

	addReview(content, callback) {
		rhit.requestAPI.addReview(rhit.userManager.uid, this._gid, rhit.userManager.username, content, 5).then(data => {
			console.log(data);

			console.log(data);
			if (data.status == 0) {
				console.log(data.rid);
				const review = new rhit.Review(data.rid, this._gid, rhit.userManager.uid, rhit.userManager.username, rhit.userManager.username, content, 5, null);
				this._reviewlist.push(review);
				if(callback != null)
					callback(0);
			} else {
				callback(data.msg);
			}
		})
	}

	deleteReview(rid, callback) {
		rhit.requestAPI.deleteReview(rhit.userManager.uid, rid).then(data => {
			console.log(data);
			if (data.status == 0) {
				console.log("successfully delete the review");
				for(let i = 0; i < this.length; i++) {
					if(this.getReviewAt(i).rid == rid) {
						this._reviewlist.splice(i,1)
						break;
					}
				}
				if(callback != null)
					callback(0);
			}
		})
	}

	getReviewAt(index) {
		return this._reviewlist[index];
	}

	get length() {
		return this._reviewlist.length;
	}
}

rhit.Review = class {
	constructor(rid, gid, uid, username, title, content, rating, time) {
		this.rid = rid;
		this.gid = gid;
		this.uid = uid;
		this.username = username;
		this.title = title;
		this.content = content;
		this.rating = rating;
		this.time = time;
	}
}


rhit.GamesManager = class {
	constructor() {
		this._gamelist = [];
		this._usergames = [];
		this.getUserGames(rhit.userManager.uid, null);
		rhit.categoryManager = new rhit.CategoryManager();
	}

	addGame(game, callback) {
		rhit.requestAPI.addGame(game).then(data => {
			if (data.status == 0) {
				game.gid = data.gid;
				this._gamelist.push(game);
				console.log(game);
				console.log(this._gamelist);
				callback();
			} else {
				console.log(data.msg);
			}
			
		})
	}

	updateByPage(pageNum, maxNum, callback) {
		rhit.requestAPI.getAllGames(pageNum, maxNum).then(data => {
			for (let row of data) {
				const game = new rhit.Game(row["gID"], row["Name"], row["Description"], row["Version"],
					 row["Download"], row["Price"], row["ReleaseDate"], false);
				this._gamelist.push(game);
				console.log(game);
			}
			console.log(this._gamelist);
			if(callback != null)
				callback();
		})
	}

	update(callback) {
		rhit.requestAPI.getAllGames().then(data => {
			this._gamelist = [];
			for (let row of data) {
				let cid = '[' + row['cids'] + ']'
				const game = new rhit.Game(row["gID"], row["Name"], row["Description"], row["Version"], row["Download"],
					 row["Price"], row["ReleaseDate"], JSON.parse(cid), this._usergames.includes(row["gID"]));
				this._gamelist.push(game);
				//console.log(game);
			}
			console.log(this._gamelist);
			if(callback != null)
				callback();
		})
	}

	deleteGame(gid, callback) {
		rhit.requestAPI.deleteGame(gid).then(data => {
			console.log(data);
			if (data.status == 0) {
				console.log("successfully delete the game");
				for(let i = 0; i < this.length; i++) {
					if(this.getGameAt(i).gid == gid) {
						this._gamelist.splice(i,1)
						break;
					}
				}
				if(callback != null)
					callback();
			} else {
				//
			}
		})
	}

	getUserGames(uid, callback) {
		rhit.requestAPI.getUserGames(uid).then(data => {
			console.log(data);
			this._usergames = data;
			console.log(this._gamelist);
			if(callback != null)
				callback();
		})
	}

	purchaseGame(uid, gid, callback) {
		rhit.requestAPI.addUserOwnGame(uid, gid).then(data => {
			console.log(data);
			if (data.status == 0) {
				console.log("successfully purchased the game");
				for(let i = 0; i < this.length; i++) {
					if(this.getGameAt(i).gid == gid) {
						this.getGameAt(i).purchased = true;
						break;
					}
				}
				if(callback != null)
					callback();
			} else {
				//
			}
		})
	}


	deleteUserGame(uid, gid, callback) {
		rhit.requestAPI.deleteUserGame(uid, gid).then(data => {
			console.log(data);
			if (data.status == 0) {
				console.log("successfully delete the game");
				for(let i = 0; i < this.length; i++) {
					if(this.getGameAt(i).gid == gid) {
						this.getGameAt(i).purchased = false;
						break;
					}
				}
				for(let i = 0; i < this.userGameNumber; i++) {
					if(this.getUserGameAt(i).gid == gid) {
						this._usergames.splice(i,1)
						break;
					}
				}
				if(callback != null)
					callback();
			} else {
				//
			}
		})
	}

	getGameAt(index) {
		return this._gamelist[index];
	}

	getUserGameAt(index) {
		return this._usergames[index];
	}


	get length() {
		return this._gamelist.length;
	}

	get userGameNumber() {
		return this._usergames.length;
	}
}

rhit.SingleGameManager = class {
	constructor(gid) {
		this._game = null;
		this.update(gid);
		rhit.categoryManager = new rhit.CategoryManager();
	}

	update(gid, callback) {
		
		rhit.requestAPI.getSpecificGameByUser(rhit.userManager.uid, gid).then(data => {
			console.log(data);
			const uid = data['uID'];
			
			let cid = '[' + data['cids'] + ']'
			console.log(cid);
			const game = new rhit.Game(data["gID"], data["Name"], data["Description"], data["Version"], data["Download"], data["Price"], data["ReleaseDate"], JSON.parse(cid), !!uid == rhit.userManager.uid);
			this._game = game;
			console.log(this._game);
			if(callback != null)
				callback(this._game);
		})
	}

}

rhit.CategoryManager = class {
	constructor() {
		this._categoryList = [];
	}

	update(callback) {
		rhit.requestAPI.getAllCategory().then(data => {
			this._categoryList = [];
			for (let row of data) {
				const category = new rhit.Category(row["cID"], row["Name"]);
				this._categoryList.push(category);
			}
			console.log(this._categoryList);
			if(callback != null)
				callback();
		})
	}

	get length() {
		return this._categoryList.length;
	}

}

rhit.Category = class {
	constructor(cid, name) {
		this.cid = cid;
		this.name = name;
	}
}

rhit.Game = class {
	constructor(gid, name, description, version, download, price, releaseDate, category, purchased) {
		this.gid = gid;
		this.name = name;
		this.description = description;
		this.version = version;
		this.download = download;
		this.price = price;
		this.releaseDate = releaseDate;
		this.category = category
		this.purchased = purchased;
	}
}

/* Controls the game pages (Names TBD)  */
rhit.ListPageController = class {
	constructor(cid) {
		this._page = 1;
		this._pageItems = 10;
		this._status = 0;
		this._cid = cid;
		this.clearPage();

		rhit.gamesManager = new rhit.GamesManager();
		

		const welcomeLabel = document.querySelector("#welcomeLabel");
		const addNewGameBtn = document.querySelector("#addNewGame");
		const showMyGamesBtn = document.querySelector("#showMyGames");
		const showAllGamesBtn = document.querySelector("#showAllGames");
		
		if(rhit.userManager.isAdmin) {
			this._status = 2;
			welcomeLabel.innerHTML = "Welcome, System Admin";
			addNewGameBtn.hidden = "";
			showMyGamesBtn.hidden = "hidden";
			showAllGamesBtn.hidden = "hidden";
			this.updatePage();
		}

		document.querySelector("#accountBtn").onclick = (event) => {
			window.location.href = `/account.html?id=${rhit.userManager.uid}`;
		}

		showMyGamesBtn.onclick = (event) => {
			this._status = 1;
			addNewGameBtn.hidden = "hidden";
			showMyGamesBtn.hidden = "hidden";
			showAllGamesBtn.hidden = "";
			rhit.gamesManager.getUserGames(rhit.userManager.uid, this.updatePage.bind(this));
		}

		showAllGamesBtn.onclick = (event) => {
			this._status = 0;
			addNewGameBtn.hidden = "hidden";
			showMyGamesBtn.hidden = "";
			showAllGamesBtn.hidden = "hidden";
			this._page = 1;
			rhit.gamesManager.update(this.updatePage.bind(this))
		}
		
		document.querySelector("#submitAddGame").onclick = (event) => {
			const name = document.querySelector("#gameName");
			const description = document.querySelector("#gameDesc");
			const version = document.querySelector("#versionNo");
			const price = document.querySelector("#price");
			const download = document.querySelector("#downloadNum");
			const releaseDate = document.querySelector("#releaseDate");
			let game = new rhit.Game(-1, name.value, description.value, version.value, download.value, price.value, releaseDate.value, false)
			rhit.gamesManager.addGame(game, this.updatePage.bind(this));
		}

		document.querySelector("#signOutBtn").onclick = (event) => {
			rhit.userManager.signOut().then(() => {
				window.location.href = "/login.html";
			});
		}

		rhit.gamesManager.update(this.updatePage.bind(this))
		// window.onscroll = this.scrollToRefresh();
	}

	updateDropdown() {
		const newDropdown = htmlToElement(`<div id="categoryDropdown" class="dropdown-menu" aria-labelledby="dropdownMenuButton"></div>`);
		const oldDropdown = document.querySelector("#categoryDropdown");

		for(let i = 0; i < rhit.gamesManager.length; i++) {
			console.log(i);
			let game = rhit.gamesManager.getGameAt(i);
			if(this._status != 1 || game.purchased) {
				const newCard = this._createCard(game);
				list.appendChild(newCard);
			}

		}
		oldDropdown.removeAttribute("id");
		oldDropdown.hidden = true;
		oldDropdown.parentElement.appendChild(newList);
	}
	
	clearPage() {
		//Make a new quoteListContainer
		const newList = htmlToElement('<div id="gameContainer" class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3"></div>');
		const oldList = document.querySelector("#gameContainer");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);
	}

	// scrollToRefresh() {
	// 	//滑动
	// 	let scrollTop = 0;
	// 	if (document.documentElement && document.documentElement.scrollTop) {
	// 		scrollTop = document.documentElement.scrollTop;
	// 	} else if (document.body) {
	// 		scrollTop = document.body.scrollTop;
	// 	}

	// 	//获取当前可视范围的高度
	// 	let clientHeight = 0;
	// 	if (document.body.clientHeight && document.documentElement.clientHeight) {
	// 		clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
	// 	} else {
	// 		clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
	// 	}

	// 	//获取文档完整的高度
	// 	let scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);

	// 	if (scrollTop + clientHeight == scrollHeight) {
	// 		console.log("Already Reach the bottom");
	// 		rhit.gamesManager.updateGame(this._page + 1, this._pageItems, this.updatePage);
	// 	}
	// }

	updatePage() {
		console.log("I need to update the list on the page!");
		this._page++;
		//Make a new quoteListContainer
		this.clearPage();
		const list = document.querySelector("#gameContainer");


		for(let i = 0; i < rhit.gamesManager.length; i++) {
			console.log(i);
			let game = rhit.gamesManager.getGameAt(i);
			//console.log(game);
			if(this._status != 1 || game.purchased) {
				const newCard = this._createCard(game);
				list.appendChild(newCard);
			}

		}
		
		const delBtns = document.querySelectorAll(".card-body .btn-outline-warning");
		const purchaseBtns = document.querySelectorAll(".card-body .btn-outline-success");
		const viewBtns = document.querySelectorAll(".card-body .btn-outline-primary");
		console.log(delBtns);
		for(let btn of delBtns) {
			if(this._status == 2) {
				btn.onclick = (event) => {
					rhit.gamesManager.deleteGame(event.target.dataset.gid, this.updatePage.bind(this));
				}
			} else {
				btn.onclick = (event) => {
					rhit.gamesManager.deleteUserGame(rhit.userManager.uid, event.target.dataset.gid, this.updatePage.bind(this));
				}
			}
		}

		for(let btn of purchaseBtns) {
			btn.onclick = (event) => {
				rhit.gamesManager.purchaseGame(rhit.userManager.uid, event.target.dataset.gid, this.updatePage.bind(this));
			}
		}
		

		for(let btn of viewBtns) {
			//console.log(btn);
			btn.onclick = (event) => {
				//console.log(event.target);
				window.location.href = `/game.html?id=${event.target.dataset.gid}`;
			}
		}

	}

	_createCard(game) {
		if(this._status == 2 || game.purchased) {
			return htmlToElement(`
				<div id="gameCard-${game.gid}" class="col">
					<div class="card shadow-sm">
						<svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg"
							role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false">
							<title>Placeholder</title>
							<rect width="100%" height="100%" fill="#55595c" /><text x="50%" y="50%" fill="#eceeef"
							dy=".3em">${game.name}</text>
						</svg>
						<div class="card-body">
							<p class="card-text">${game.description}</p>
							<div class="d-flex justify-content-between align-items-center">
							<div class="btn-group">
								<button id="btn-view-${game.gid}" type="button" class="btn btn-sm btn-outline-primary" data-gid="${game.gid}">View</button>
								<button id="btn-delete-${game.gid}" type="button" class="btn btn-sm btn-outline-warning" data-gid="${game.gid}">Delete</button>
							</div>
							<small class="text-muted">Downloads: ${game.download}</small>
							</div>
						</div>
					</div>
				</div>
			`);
		} else {
			return htmlToElement(`
				<div id="gameCard-${game.gid}" class="col">
					<div class="card shadow-sm">
						<svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg"
							role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false">
							<title>Placeholder</title>
							<rect width="100%" height="100%" fill="#55595c" /><text x="50%" y="50%" fill="#eceeef"
							dy=".3em">${game.name}</text>
						</svg>
						<div class="card-body">
							<p class="card-text">${game.description}</p>
							<div class="d-flex justify-content-between align-items-center">
							<div class="btn-group">
								<button id="btn-view-${game.gid}" type="button" class="btn btn-sm btn-outline-primary" data-gid="${game.gid}">View</button>
								<button id="btn-purchase-${game.gid}" type="button" class="btn btn-sm btn-outline-success" data-gid="${game.gid}">Purchase</button>
							</div>
							<small class="text-muted">Downloads: ${game.download}</small>
							</div>
						</div>
					</div>
				</div>
			`);
		}
	}


}

/* Manages the User class */
rhit.UserManager = class {
	constructor() {
		this._user = rhit.storage.getUser();
	}

	async signIn(username, password, callback) {
		rhit.requestAPI.signIn(username, password).then(data => {
			console.log(data);
			this._user = new rhit.User(data.uid, username);
			rhit.storage.setUser(this._user);
			if (data.status == 0) {
				rhit.requestAPI.getUserProfile(data.uid).then(data => {
					console.log(data);
					this._user.address = data.content['Address'];
					this._user.email = data.content['E-mail'];
					this._user.phone = data.content['Phone'];
					this._user.role = data.content['role'];
					rhit.storage.setUser(this._user);
					console.log(this._user);
					callback(0, "Success");
				})
			} else {
				callback(-1, data.msg);
			}
		})
	}

	async signUp(username, password, callback) {
		rhit.requestAPI.signUp(username, password).then(data => {
			console.log(data);
			if (data.status == 0) {
				this._user = new rhit.User(data.uid, username);
				rhit.storage.setUser(this._user);
				rhit.requestAPI.getUserProfile(data.uid).then(data => {
					console.log(data.content);
					this._user.address = data.content['Address'];
					this._user.email = data.content['E-mail'];
					this._user.phone = data.content['Phone'];
					this._user.role = data.content['role'];
					rhit.storage.setUser(this._user);
					callback(0, "Success");
				})
			} else {
				callback(-1, data.msg);
			}
		})
	}

	async signOut() {
		this._user = null;
		rhit.storage.setUser(null);
	}

	get isAdmin() {
		return this._user.role == "admin"
	}

	get isSignedIn() {
		return !!this._user;
	}

	get uid() {
		return this._user.uid;
	}

	get username() {
		return this._user.username;
	}
}

/* User class, to store information about a user of Vapor */
rhit.User = class {
	constructor(uid, username) {
		this.uid = uid;
		this.username = username;
		this.address = null;
		this.email = null;
		this.phone = null;
		this.role = null;
	}
}


rhit.storage = rhit.storage || {};
rhit.storage.VAPOR_USER = 'VaporUser';

rhit.storage.getUser = function () {
	const user = JSON.parse(localStorage.getItem(rhit.storage.VAPOR_USER));
	console.log(user);
	if (!user) {
		console.log("No User found in the storage");
	}
	return user;
};
rhit.storage.setUser = function (user) {
	console.log(`${user}`);
	localStorage.setItem(rhit.storage.VAPOR_USER, JSON.stringify(user));
};

rhit.checkForRedirects = function () {
	if (document.querySelector("#loginPage") && rhit.userManager.isSignedIn) {
		window.location.href = "/gameList.html";
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

	if (document.querySelector("#listPage")) {
		console.log("You are on the list page");

		new rhit.ListPageController();
	}

	if (document.querySelector("#gamePage")) {
		console.log("You are on the detail page");
		//new rhit.ListPageController();
		//const movieQuoteId = rhit.storage.getMovieQuoteId();
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const gid = urlParams.get("id");
		console.log(`Detail page for ${gid}`);

		if (!gid) {
			console.log("Error! Missing movie quote id!");
			window.location.herf = "/gameList.html";
		}

		
		new rhit.GamePageController(gid);
	}
};


/* Main */
/** function and class syntax examples */
rhit.main = function () {
	// console.log("Ready");
	rhit.userManager = new this.UserManager();
	rhit.requestAPI = new this.RequestAPI(rhit.url)
	rhit.checkForRedirects();

	rhit.initializePage();
	rhit.requestAPI.getBillingInfoByUser(1).then(data => {

		console.log(data);
		console.log(data.status);
		console.log(data.msg);
		if (data.status == 0) {
			//rhit.userManager.signIn(new rhit.User(data.uid, username));
			console.log("status=0");
			// console.log("Redirecting");
			// window.location.href = '/index.html';
		} else {
			console.log("error")
			//errorLabel.innerHTML = data.msg;
		}
	})
};

rhit.main();