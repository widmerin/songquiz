//Score JS

// The root URL for the RESTful services
var rootURL = "http://localhost/songquiz/api/score";

function addScore() {
	console.log("domain"+document.domain);
	console.log('addScore'+scoreToJSON()+' url'+rootURL);
	$.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: rootURL,
		dataType: "json",
		data: scoreToJSON(),
		success: function(data, textStatus, jqXHR){
			console.log('Saved Score')
		},
		error: function(jqXHR, textStatus, errorThrown){
			console.log('addscore error: ' + textStatus);
		}
	});
}

function getHighscore() {
	console.log('getHighscore');
	$.ajax({
		type: 'GET',
		url: 'http://localhost/songquiz/api/score/highscore',
		dataType: "json", 
		success: renderHighscoreList
	});
	console.log("test");
}


function scoreToJSON() {
	return JSON.stringify({
		"userid": "1", 
		"playedQuestions": "10", 
		"correctAnswers": "20"
		});
}

function getUserID(){
	return 1;
}

function getPlayedQuestions(){
	return 10;
}

function getCorrectAnswers(){
	return 5;
}

//addScore();


function renderHighscoreList(data) {
	console.log("render");
	
	var list = data == null ? [] : (data.highscore instanceof Array ? data.highscore : [data.highscore]);

	//Empty Score Table
	$('#score').find('tbody').children('tr').remove();

	//Add Highscore to Score Table
	$.each(list, function(index, highscore) {
		$('#score').find('tbody').append('<tr><td>'+(index+1)+'.</td><td>' + highscore.username + '</td><td>'+ Math.round(highscore.total).toFixed(2) +' %</td></tr>');
	});
}