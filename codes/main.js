var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const fetch = require("node-fetch");
var helper = require('./helper');
//const cheerio = require('cheerio');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (request, response) {
	let part = request.query.part;
	if (part == 1) {
		response.sendFile(path.join(__dirname + '/part1.html'));
	} else if (part == 2) {
		response.sendFile(path.join(__dirname + '/part2.html'));
	} else if (part == 3) {
		response.sendFile(path.join(__dirname + '/part3.html'));
	} else if (part == 4) {
		response.sendFile(path.join(__dirname + '/part4.html'));
	} else if (part == 5) {
		response.sendFile(path.join(__dirname + '/part5.html'));
	} else {
		response.sendFile(path.join(__dirname + '/index.html'));
	}
});

app.post('/semantic-analysis', async function (request, response) {
	var urls_data = request.body.urls;
	console.log(urls_data);
	var all_url = urls_data.split(" ");
	if (all_url.length < 1) {
		response.send("Lütfen 1 den fazla url giriniz");
		response.end();
	}
	else {
		var main_url = all_url[0];
		for (i = 0; i < all_url.length; i++) {
			console.log(all_url[i]);
		}
		let all_text = [];
		for (i = 0; i < all_url.length; i++) {
			if (all_url[i]) {
				all_text[i] = await fetch(all_url[i]) // all_url[0].text = all_text[0] gibi 
					.then(res => res.text())
					.then(text => {
						return text;
					});
			}
		}
		console.log("first depth : ");
		let original_url_length = all_url.length;
		let urls;
		for (i = 0; i < all_text.length; i++) { // method ile link bulma  // 2. derinlik
			urls = helper.findUrls(all_text[i]);
			console.log(urls);
			for (j = 0; j < urls.length; j++) { // linkleri birleştirme
				all_url = all_url.concat(urls[j].toString());
			}
		}
		let sec_url_length = all_url.length;


		/*let sec_text = []; // 2. derinlik linklerinin html kodunu alma
		for(i=0;i<urls.length;i++){
			if(urls[i]){
				sec_text[i] = await fetch(urls[i])
				.then(res => res.text())
				.then(text => {
					return text;
				});
			}
		}
		console.log("secondary depth : ");
		let urls2;
		for(i=0;i<sec_text.length;i++){
			urls2 = helper.findUrls(sec_text[i]);
			console.log(urls2);
			for (j = 0; j < urls.length; j++) { // linkleri birleştirme
				all_url = all_url.concat(urls2.toString()); 
			}
			
		}*/

		console.log("original size : " + original_url_length);
		console.log("new size after adding secondary depth url : " + sec_url_length);
		//console.log("new size after adding third dept urls : "+all_url.length);

		var all_semantic_score = [];
		for (i = 1; i < all_url.length; i++) {
			let k = i - 1;
			try {
				for(l=0;l<100000000;l++); // delay için
				let url = "https://api.dandelion.eu/datatxt/sim/v1/?url1=" + main_url + "&url2=" + all_url[i] + "&lang=en&token=7727bc847f824f5daf0356514366e974"; // kendi hesabımın key'i 
				all_semantic_score[k] = await fetch(url)
					.then(res => res.json())
					.then(score => {
						return score;
					})
					.catch(err => {
						console.log(err);
					});
			} catch {
				continue;
			}
		}
		let res = [];
		for (i = 0; i < all_semantic_score.length; i++) {
			let j = i + 1;
			console.log(all_semantic_score[i]);
			let similarity = all_semantic_score[i].similarity * 100;
			res[i] = { url1: main_url, url2: all_url[j], score: "%" + similarity, }
			j++;
		}
		response.send(res);
		response.end();
	}


});

app.post('/indexing-sorting', async function (request, response) {
	var urls_data = request.body.urls;
	console.log(urls_data);
	var all_url = urls_data.split(" ");
	if (urls_data.length < 1) {
		response.send("LÜTFEN 1'DEN FAZLA URL GİRİNİZ")
		response.end();
	}
	else {
		var main_url = all_url[0];
		let all_text = [];
		for (i = 0; i < all_url.length; i++) {
			if (all_url[i]) {
				all_text[i] = await fetch(all_url[i]) // all_url[0].text = all_text[0] gibi 
					.then(res => res.text())
					.then(text => {
						return text;
					});
			}
		}
		console.log("first depth : ");
		let original_url_length = all_url.length;
		let urls;
		for (i = 0; i < all_text.length; i++) { // method ile link bulma  // 2. derinlik
			urls = helper.findUrls(all_text[i]);
			console.log(urls);
			for (j = 0; j < urls.length; j++) { // linkleri birleştirme
				all_url = all_url.concat(urls[j].toString());
			}
		}
		let sec_url_length = all_url.length;


		/*let sec_text = []; // 2. derinlik linklerinin html kodunu alma
		for (i = 0; i < urls.length; i++) {
			if (urls[i]) {
				sec_text[i] = await fetch(urls[i])
					.then(res => res.text())
					.then(text => {
						return text;
					});
			}
		}
		console.log("secondary depth : ");
		let urls2;
		for (i = 0; i < sec_text.length; i++) {
			urls2 = helper.findUrls(sec_text[i]);
			console.log(urls2);
			for (j = 0; j < urls2.length; j++) { // linkleri birleştirme
				all_url = all_url.concat(urls2[j].toString());
			}

		}*/

		console.log("original size : " + original_url_length);
		console.log("new size after adding secondary depth url : " + sec_url_length);
		//console.log("new size after adding third dept urls : " + all_url.length);

		let k = 0; // score'ların karşılaştırılması 
		let all_score = [];
		for (j = 1; j < all_url.length; j++) {
			k = j - 1;
			try {
				all_score[k] = await fetch('http://localhost:3000/similarity_score', {
					method: 'POST',
					credentials: 'omit',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ 'url1': all_url[0], 'url2': all_url[j] }),
				})
					.then(res => res.text())
					.then(result => {
						return result;
					});
			} catch {
				continue;
			}
		}
		let res = [];
		for (i = 0; i < all_score.length; i++) {
			let sim = all_score[i].split(" ");
			let simil = Number(sim[2]);
			let similarity = simil * 100;
			res[i] = { index: i, url1: main_url, url2: all_url[i+1], score: "% " + similarity };
		}

		res = helper.Indexing(res);

		response.send(res);
		response.end();
	}

});

app.post('/similarity_score', async function (request, response) {
	var url1 = request.body.url1;
	var url2 = request.body.url2;

	if (url1 && url2) {
		let text1 = await fetch(url1)
			.then(res => res.text())
			.then(text => {
				return text;
			});
		let text2 = await fetch(url2)
			.then(res => res.text())
			.then(text => {
				return text;
			});
		let score = helper.textCosineSimilarity(text1, text2);
		console.log(score);
		response.send("Similarity score: " + score.toFixed(5));
		response.end();
	} else {
		response.send('Please check URL 1 or URL 2. Both of them must be non-empty!');
		response.end();
	}
});

app.post('/keyword_extract', async function (request, response) {
	var url = request.body.url;
	if (url) {
		let result = await fetch(url)
			.then(res => res.text())
			.then(text => {
				var hist = helper.wordCountMap(text);
				var sortable = [];
				for (var item in hist) {
					sortable.push([item, hist[item]]);
				}
				sortable.sort(function (a, b) {
					return b[1] - a[1];
				});
				return sortable.slice(0, 5); // max 5 element
			})
		response.send(result);
		response.end();
	} else {
		response.send('Please enter URL!');
		response.end();
	}
});

app.post('/word_freq', async function (request, response) {
	var url = request.body.url;
	if (url) {
		let result = await fetch(url)
			.then(res => res.text())
			.then(text => {
				var hist = helper.wordCountMap(text);
				var sortable = [];
				for (var item in hist) {
					sortable.push([item, hist[item]]);
				}
				sortable.sort(function (a, b) {
					return b[1] - a[1];
				});
				return sortable;
			})
		response.send(result);
		response.end();
	} else {
		response.send('Please enter URL!');
		response.end();
	}
});

app.get('/home', function (request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

console.log("http://localhost:3000 working")
app.listen(3000);