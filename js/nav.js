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
    var btLogout = $("#btLogout");
    var btLogoutSmall = $("#btLogoutSmall");
    btLogout.hide();
    btLogoutSmall.hide();

    //GUI elements for game logic handled in app.js

    addScore(333,33);
    
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
        //play first song (after this play further songs by clicking next button)
        $.getScript('js/app.js', function () {
            oneGameSet();
        });
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