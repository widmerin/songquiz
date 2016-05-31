/**
 * Created by mj, iw, yh on 29.05.2016
 */


//nav.js for navigation in gui
 var setView;
 var left;
 var right;

//Pages (section)
var LOGIN;
var REG;
var START;
var GAME;
var SCORE;
var COVER;
var INTRO;
var GAMEOVER;

$(document).ready(function() {

    //Pages (section)
    LOGIN = $("#login");
    REG = $("#reg");
    START = $("#start");
    GAME = $("#game");
    SCORE = $("#score");
    COVER = $("#cover");
    INTRO = $("#intro");
    GAMEOVER = $("#gameover");

    //Buttons
    var btLogin = $("#btLogin");
    var btPlay = $("#btPlay");
    var btNew = $("#btNew");
    var btLogout = $("#btLogout");
    var btLogoutSmall = $("#btLogoutSmall");
    var btPlayAgain = $("#btPlayAgain");
    var guessButtons = $(".btGuess"); 

    btLogout.hide();
    btLogoutSmall.hide();

     
    //************View Handler**********************
    setView = function(left, right){
        //hide all
        LOGIN.hide();
        REG.hide();
        START.hide();
        GAME.hide();
        SCORE.hide();
        INTRO.hide();
        COVER.hide();
        GAMEOVER.hide();
        //show the one given
        left.show();
        right.show();
    }

  	//**************Button Handler****************

    //Play Button
    btPlay.click(function(e){
        e.preventDefault();
        setView(COVER,GAME);
         guessButtons.prop('disabled', false);
        //play first song (after this play further songs by clicking next button)
        $.getScript('js/app.js', function () {
            oneGameSet();
        });
    });

    //Play Button
    btPlayAgain.click(function(e){
        e.preventDefault();
        setView(START,SCORE);
    });

    //Register new account Button
    btNew.click(function(e){
        e.preventDefault();
        setView(INTRO,REG);
    });

    //Login Button
    btLogin.click(function(e) {
        e.preventDefault();
        //alert('Login prozess');
        $.ajax({
            type: 'GET',
            url: "http://"+document.domain+"/songquiz/api/user",
            success: function(){
                console.log('erfolgreich');
                btLogout.show();
                btLogoutSmall.show();
                getHighscore();
                setView(START,SCORE);// this will call after PHP method execution.
            },
            error: function () {
                console.log('bad');
                        //only if passed, not here - delete after login works!
                        btLogout.show();
                        btLogoutSmall.show();
                        getHighscore();
                        //_______until here_______
                setView(START,SCORE);
            },
        });
    });

    //call Logout
    btLogoutSmall.click(function(){
        btLogout.click();
    });

    //Logout Button TODO: actual logout
    btLogout.click(function(e) {
        e.preventDefault();
        btLogout.hide();
        btLogoutSmall.hide();
        setView(INTRO,LOGIN);
    });

//end of document
});