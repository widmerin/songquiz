/**
 * Created by iw on 30.05.2016
 */



//var apiURL = "http://localhost:8080

//Save Highscore DB
function addScore(playedQuestions, correctAnswers)  {
	$.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: apiURL+'score',
		dataType: "json",
		data: scoreToJSON(playedQuestions, correctAnswers),
		success: function(data){
			console.log('Saved Score:'+data['userid']);
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
		$('#score').find('tbody').append('<tr><td>'+(index+1)+'.</td><td>' + highscore.username + '</td><td>'+ Math.round(highscore.total).toFixed(2) +' %</td></tr>');
	});
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