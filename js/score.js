/**
 * Created by mj, iw, yh on 10.06.2016
 * @ FHNW iCompetence webeng FS2016
 */

//Save Score in DB
function addScore(playedQuestions, correctAnswers)  {
	$.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: apiURL+'score',
		dataType: "json",
		data: scoreToJSON(playedQuestions, correctAnswers),
		success: function(data){
            //reload Highscore section
            getHighscore();
			//get Userscore
			getUserscore();
		},
		error: function(data){
			console.log('addscore error:');
		}
	});
}

//Get Highscore from DB
function getHighscore() {
	$.ajax({
		type: 'GET',
		url: apiURL+'/score/highscore',
		dataType: "json", 
		success: function(data){
			renderHighscoreList(data);
		},
		error: function(data){
			console.log('get highscore error:'+data);
		}
	});
}

//Get Userscore from DB
function getUserscore() {
	$.ajax({
		type: 'GET',
		url: apiURL+'/score/user',
		dataType: "json",
		success: function(data){
			renderUserscore(data);
		},
		error: function(data){
			console.log('get highscore error:'+data);
		}
	});
}

//Create JSON with Score Data
function scoreToJSON(playedQuestions, correctAnswers) {
	return JSON.stringify({
		"playedQuestions": playedQuestions, 
		"correctAnswers": correctAnswers
		});
}

//Show Highscore in HTML
function renderHighscoreList(data) {
	//Save highscore data in list	
	var list = data == null ? [] : (data.highscore instanceof Array ? data.highscore : [data.highscore]);

	//Empty Score Table
	$('#score').find('tbody').children('tr').remove();

	//Show Highscore in Score Table
	$.each(list, function(index, highscore) {
		$('#score').find('tbody').append('<tr><td>'+(index+1)+'.&nbsp;</td><td>' + highscore.username + '</td><td>'+ Math.round(highscore.total).toFixed(0) +' % of&nbsp;</td><td>'+ highscore.played +'</td><td>&nbsp;songs</td></tr>');

	});
}

//Show Highscore in HTML
function renderUserscore(data) {
	//write userScore
	$('#gameover').find('p').last().text('Overall score is: '+Math.round(data.userscore[0].total).toFixed(0)+'% of '+data.userscore[0].played+' songs');
}

//Draw Pie with Score
function showPie() {

	// calculate percentage wrong/correct answers
	$correctPer = 100/gameOfNr*rightAnswers;
	$wrongPer = 100-$correctPer;
    //create chart
	if($wrongPer<1){
		//no wrongs
		chart  = new CanvasJS.Chart("chartContainer",
			{
				backgroundColor: "transparent",
				animationEnabled: true,
				animationDuration: 2000,
				width: 250,
				height: 250,
				data: [
					{
						type: "pie",
						indexLabelFontFamily: "Verdana",
						indexLabelFontSize: 20,
						startAngle:0,
						indexLabelFontColor: "MistyRose",
						indexLabelLineColor: "darkgrey",
						indexLabelPlacement: "inside",
						toolTipContent: "",
						showInLegend: false,
						indexLabel: "#percent%",
						dataPoints: [
							{  y: $correctPer, name: "Correct", color: "#67B27A" },
						]
					}
				]
			});
	}else if ($correctPer<1){
		//no corrects
		chart  = new CanvasJS.Chart("chartContainer",
			{
				backgroundColor: "transparent",
				animationEnabled: true,
				animationDuration: 2000,
				width: 250,
				height: 250,
				data: [
					{
						type: "pie",
						indexLabelFontFamily: "Verdana",
						indexLabelFontSize: 20,
						startAngle:0,
						indexLabelFontColor: "MistyRose",
						indexLabelLineColor: "darkgrey",
						indexLabelPlacement: "inside",
						toolTipContent: "",
						showInLegend: false,
						indexLabel: "#percent%",
						dataPoints: [
							{  y: $wrongPer, name: "Wrong", color: "#E14658" }
						]
					}
				]
			});
	}else{
		//full chart
		chart  = new CanvasJS.Chart("chartContainer",
			{
				backgroundColor: "transparent",
				animationEnabled: true,
				animationDuration: 2000,
				width: 250,
				height: 250,
				data: [
					{
						type: "pie",
						indexLabelFontFamily: "Verdana",
						indexLabelFontSize: 20,
						startAngle:0,
						indexLabelFontColor: "MistyRose",
						indexLabelLineColor: "darkgrey",
						indexLabelPlacement: "inside",
						toolTipContent: "",
						showInLegend: false,
						indexLabel: "#percent%",
						dataPoints: [
							{  y: $correctPer, name: "Correct", color: "#67B27A" },
							{  y: $wrongPer, name: "Wrong", color: "#E14658" }
						]
					}
				]
			});
	};
    chart.render();
}