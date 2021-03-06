/**
 * Created by mj, iw, yh on 10.06.2016
 * @ FHNW iCompetence webeng FS2016
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

// The root URL for the RESTful services
var apiURL = "http://"+document.domain+"/songquiz/api/";
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
    var btNext = $("#next");            //next Button
    var CorArtist = $("#CorArtist");         //Artist under cover img
    var CorSong = $("#CorSong");             //Song under cover img
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
        oneGameSet();
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
        //input fields login or
        var userInputR = $("#regEmail");
        var pwInputR = $("#regPassword");
        var userR = userInputR.val();
        var pwR = pwInputR.val();
        if (userR.length==0 || pwR.length==0){
            userInputR.addClass("login-wrong");
            pwInputR.addClass("login-wrong");
            alert("Please, fill in both fields to register.");
            //exit function
            return;
        }
        $.ajax({
            type: 'POST',
            url: "http://"+document.domain+"/songquiz/api/user/add",
            contentType: 'application/json',
            dataType: "json",
            data: loginToJSON(userR, pwR),
            success: function(response){
                if (response.success) {
                    // It was true
                    setView(INTRO,LOGIN);
                }
                else if (response.errmsg === 1) {
                    // It was false
                    userInputR.addClass("login-wrong");
                    pwInputR.addClass("login-wrong");
                    document.getElementById("regfail").innerHTML = "Nickname already exists";
                    setView(INTRO,REG);// this will call after PHP method execution
                }
                else if (response.errmsg === 2) {
                    // It was false
                    userInputR.addClass("login-wrong");
                    pwInputR.addClass("login-wrong");
                    document.getElementById("regfail").innerHTML = "Registration failed, please try again";
                    setView(INTRO,REG);// this will call after PHP method execution
                }
             },
            error: function (response) {
                setView(INTRO,REG);
            },
        });
    });

    //Back to Loginpage
    REG.find("#home").click(function(e){
        e.preventDefault();
        setView(INTRO,LOGIN);
    });    

    //Login Button
    btLogin.click(function(e) {
        e.preventDefault();
        var userInput = $("#email");
        var pwInput = $("#password");
        var user = userInput.val();
        var pw = pwInput.val();
        if (user.length==0 || pw.length==0){
            userInput.addClass("login-wrong");
            pwInput.addClass("login-wrong");
            alert("Please, fill in both fields to login.");
            //exit function
            return;
        }
        $.ajax({
            type: 'POST',
            url: "http://"+document.domain+"/songquiz/api/user",
            contentType: 'application/json',
            dataType: "json",
            data: loginToJSON(user, pw),
            success: function(response){
                if (response.success) {
                    // Login was true
                    btLogout.show();
                    btLogoutSmall.show();
                    getHighscore();
                    setView(START,SCORE);
                } else {
                    // Login was false
                    userInput.addClass("login-wrong");
                    pwInput.addClass("login-wrong");
                    document.getElementById("loginfail").innerHTML = "login failed";
                }
            },
            error: function () {
                console.log('error login');
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

    //Logout Button
    btLogout.click(function(e) {
        e.preventDefault();
        $.ajax({
            type: 'GET',
            url: apiURL+'/user',
             success: function(response){
                //reload page
                location.reload(true); 
             },
            error: function () {
                    console.log('error logout');
                },
        });
       
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
        $('body').css('background', 'url(' + selectBG + ') no-repeat center center fixed');
        $('body').css('background-size', 'cover');
    }

    guessButtons.click(function (event) {
        event.preventDefault();
        buttonGuess(this);
    });

    btNext.click(function (event) {
        event.preventDefault();
        buttonNext();
    });
//end of document
});