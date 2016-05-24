//Score JS

// The root URL for the RESTful services
var apiURL = "http://"+document.domain+"/songquiz/api/";

function addScore(playedQuestions, correctAnswers)  {
	$.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: apiURL+'score',
		dataType: "json",
		data: scoreToJSON(playedQuestions, correctAnswers),
		success: function(){
			console.log('Saved Score')
		},
		error: function(){
			console.log('addscore error:');
		}
	});
}

function getHighscore() {
	console.log('getHighscore http://'+document.domain+'/score/highscore');
	$.ajax({
		type: 'GET',
		url: apiURL+'/score/highscore',
		dataType: "json", 
		success: renderHighscoreList
	});
}


function scoreToJSON(playedQuestions, correctAnswers) {
	return JSON.stringify({
		"userid": getUserID(), 
		"playedQuestions": playedQuestions, 
		"correctAnswers": correctAnswers
		});
}

//ToDo: UserId auslesen
function getUserID(){
	return 1;
}



function renderHighscoreList(data) {
	//Save highscore data in list	
	var list = data == null ? [] : (data.highscore instanceof Array ? data.highscore : [data.highscore]);

	//Empty Score Table
	$('#score').find('tbody').children('tr').remove();

	//Show Highscore in Score Table
	$.each(list, function(index, highscore) {
		$('#score').find('tbody').append('<tr><td>'+(index+1)+'.</td><td>' + highscore.username + '</td><td>'+ Math.round(highscore.total).toFixed(2) +' %</td></tr>');
	});
}