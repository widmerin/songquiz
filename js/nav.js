//nav.js for navigation in gui
$(document).ready(function() {
    

    //Pages (section)
    var LOGIN = $("#login");
    var REG = $("#reg");
    var START = $("#start");
    var GAME = $("#game");
    var SCORE = $("#score");

    //Buttons
    var btLogin = $("#btLogin");
    var btPlay = $("#btPlay");
    var btNew = $("#btNew");

  	//**************Button Handler****************

    //Play Button
    btPlay.click(function(e){
        e.preventDefault();
        GAME.show();
        START.hide();

    });

    //Play Button
    btNew.click(function(e){
        e.preventDefault();
        REG.show();
        LOGIN.hide();

    });

    //Play Button
    btLogin.click(function(e){
        e.preventDefault();
        START.show();
        LOGIN.hide();
    });

});