//nav.js for navigation in gui
$(document).ready(function() {
    

    //Pages (section)
    //var LOGIN = $("#login");
   // var REG = $("#reg");
    var START = $("#start");
    var GAME = $("#game");
  //  var SCORE = $("#score");

    //Buttons
    //var btLogin = $("#btlogin");
    var btPlay = $("#btplay");

  	//**************Button Handler****************

    //Play Button
    btPlay.click(function(e){
        e.preventDefault();
        //show map: 
        GAME.show();
        START.hide();

    });


});