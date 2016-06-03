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
    var btReg = $("#btReg");
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
        //show the ones given
        setRandomBGImage();
        left.show();
        right.show();
        //if right = score und screen = mobile and left = GAMEOVER -> hide score!
        if($(window).width()<641 && left==GAMEOVER && right==SCORE){
            SCORE.hide();
        }
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
        resetCounters();
        setView(START,SCORE);
    });

    //Register new account Button
    btNew.click(function(e){
        e.preventDefault();
        setView(INTRO,REG);
    });

    //Register account Button
    btReg.click(function(e){
        e.preventDefault();
        //alert('Login proz setView(INTRO,REG);ess');
        var user = $("#regEmail").val();
        var pw = $("#regPassword").val();
        //console.log('getUser http://'+document.domain+'/songquiz/api/user');
        $.ajax({
            type: 'POST',
            url: "http://"+document.domain+"/songquiz/api/user/add",
            //url: "http://localhost:8080/songquiz/api/user/add",
            contentType: 'application/json',
            dataType: "json",
            data: loginToJSON(user, pw),
            success: function(response){
                //console.log('erfolgreich');
                //alert(response.success);//console.log(response.toString());
                if (response.success) {
                    // It was true
                    console.log('Reg success');
                    setView(INTRO,LOGIN);
                }
                else if (response.errmsg === 1) {
                    // It was false
                    console.log('Reg fail');
                    console.log('Username schon vorhanden');
                    setView(INTRO,REG);// this will call after PHP method execution
                }
                else if (response.errmsg === 2) {
                    // It was false
                    console.log('Reg fail');
                    console.log('Username konnte nicht registriert werden');
                    setView(INTRO,REG);// this will call after PHP method execution
                }
                //getHighscore();
                //setView(INTRO,LOGIN);// this will call after PHP method execution.
            },
            error: function (response) {
                console.log('bad');
                //console.log(response.toString());
                //only if passed, not here - delete after login works!
                //btLogout.show();
                //btLogoutSmall.show();
                //getHighscore();
                //_______until here_______
                setView(INTRO,REG);
            },
        });
    });

    //Login Button
    btLogin.click(function(e) {
        e.preventDefault();
        var user = $("#email").val();
        var pw = $("#password").val();
        //console.log('getUser http://'+document.domain+'/songquiz/api/user');
        $.ajax({
            type: 'POST',
            url: "http://"+document.domain+"/songquiz/api/user",
            //url: "http://localhost:8080/songquiz/api/user",
            contentType: 'application/json',
            dataType: "json",
            data: loginToJSON(user, pw),
            success: function(response){
                console.log('login erfolgreich');
                if (response.success) {
                    // Login was true
                    btLogout.show();
                    btLogoutSmall.show();
                    getHighscore();
                    setView(START,SCORE);
                }
                else {
                    // Login was false
                    var pwInput = $("#password");
                    pwInput.addClass("login-wrong");
                    pwInput.val("login failed");
                    //setView(INTRO,LOGIN); we are here already...
                }
            },
            error: function (response) {
                console.log('bad');
                //console.log(response.toString());
                        //only if passed, not here - delete after login works!
                        //btLogout.show();
                        //btLogoutSmall.show();
                        //getHighscore();
                        //_______until here_______
                setView(START,SCORE);
            },
        });
    });

    //Create JSON with login data
    function loginToJSON(user, pw) {
        return JSON.stringify({
            "user": user,
            "pw": pw
        });
    }

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

        function setRandomBGImage() {

        if($(window).width()>640){
            //Desktop BG Images
            var images=['img/Background1.jpg',
            'img/Background2.jpg',
            'img/Background3.jpg',
            'img/Background4.jpg',
            'img/Background5.jpg',
            'img/Background6.jpg'];
        } else {
             //Responsive BG Images
            var images=['img/Background1_mobile.jpg',
            'img/Background2_mobile.jpg',
            'img/Background3_mobile.jpg',
            'img/Background4_mobile.jpg',
            'img/Background5_mobile.jpg',
            'img/Background6_mobile.jpg'];
        }
        selectBG = images[Math.floor(Math.random() * images.length)];
        console.log(selectBG);
        $('body').css('background', 'url(' + selectBG + ') no-repeat center center fixed');
        $('body').css('background-size', 'cover');
    }

//end of document
});