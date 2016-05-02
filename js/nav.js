//nav.js for navigation in gui
$(document).ready(function() {
    

    //Pages (section)
    var LOGIN = $("#login");
    var REG = $("#reg");
    var START = $("#start");
    var GAME = $("#game");
    var SCORE = $("#score");
    var COVER = $("#cover");
    var INTRO = $("#intro");



    //Buttons
    var btLogin = $("#btLogin");
    var btPlay = $("#btPlay");
    var btNew = $("#btNew");

    //************View Handler**********************
    var setView = function(left, right){
        //hide all
        LOGIN.hide();
        REG.hide();
        START.hide();
        GAME.hide();
        SCORE.hide();
        INTRO.hide();
        COVER.hide();
        //show the one given
        left.show();
        right.show();
    }




  	//**************Button Handler****************

    //Play Button
    btPlay.click(function(e){
        e.preventDefault();
        setView(COVER,GAME);
    });

    //Register new account Button
    btNew.click(function(e){
        e.preventDefault();
        setView(INTRO,REG);
    });

    //Login Button
    btLogin.click(function(e){
        e.preventDefault();
        setView(START,SCORE);
    });

});