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

    //************View Handler**********************
    var setView = function(view){
        //hide all
        LOGIN.hide();
        REG.hide();
        START.hide();
        GAME.hide();
        SCORE.hide();
        //show the one given
        view.show();
    }




  	//**************Button Handler****************

    //Play Button
    btPlay.click(function(e){
        e.preventDefault();
        setView(GAME);
    });

    //Play Button
    btNew.click(function(e){
        e.preventDefault();
        setView(REG);
    });

    //Play Button
    btLogin.click(function(e){
        e.preventDefault();
        setView(START);
    });

});