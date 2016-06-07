/**
 * Game functions
 *
 * Created by mj, iw, yh on 7.6.2016
 */
//var apiURL = "http://localhost:8080/songquiz/api/";
    // Variables
    var guessButtons = $(".btGuess");   //all 4 Guess Buttons
    var GUESS0 = $("#guess0");          //GUI Buttons Guesses
    var GUESS1 = $("#guess1");
    var GUESS2 = $("#guess2");
    var GUESS3 = $("#guess3");
    var btNext = $("#next");            //next Button
    var CorArtist = $("#CorArtist");         //Artist under cover img
    //var gameOfNr = $('#count :selected').val();  //number of songs in gameset to play
    //var nerdOrNot = $('#nerd :selected').val();  //nerdOrNot (or newbie)
    //var counter = 0;                             //counter of played songs
    //var rightAnswers = 0;                        //counter of correct guessed songs
    var data = [];                               //data array with 4 tracks
    var correct;                                 //random number from 0-3 - the correct song
    var audio = new Audio();                     //audio that gets played
    var coverImg = $("#cover").find("img");
    var billboard;
    var gamedataGlobal;

    //Get Artists from DB
    function getArtists() {
        $.ajax({
            type: 'GET',
            url: apiURL + '/billboard',
            dataType: "json",
            success: function (data) {
                billboard = data;
            },
            error: function () {
                console.log('no Artitsts!');
            }
        });
    }

    getArtists();

    //get randomized query string for spotify query with artists from billboard
    function randomArtistQuery() {
        var size = Object.keys(billboard).length;
        if (size < 12) {
            //if newbis billboard is played through (from 119 down to 12), get artists from sql again... and start all over
            getArtists();
        }
        var artist;
        while (typeof artist === 'undefined') {
            try {
                var randomNumber = Math.floor(Math.random() * (size - 1));
                artist = billboard[randomNumber].artist;
                delete billboard[randomNumber];
            } catch (e) {
                //nop
            }
        }
        return ' artist:' + artist;
    }

    //get random single letter for spotify query
    function randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    }

    //get randomized query string for spotify query
    function randomLetterQuery() {
        return randomString(1, 'abcdefghijklmnopqrstuvwxyz') + ' artist:' + randomString(1, 'abcdefghijklmnopqrstuvwxyz');
    }

    //get 1 track from spotify - limit max is 50 - pick one of them
    function getTrack(tracki, gamedata) {
        var query;
        var limit;
        //if nerd niveau - difficult music
        if (gamedata.nerdOrNot == 'nerd') {
            query = randomLetterQuery();
            limit = 50;
        } else {
            //call this if user is Newbie (chooses billboard famous artists)
            query = randomArtistQuery();
            limit = 10;
        }

        $.ajax({
            url: 'https://api.spotify.com/v1/search?limit=' + limit,   // ditto
            data: {
                q: query,
                type: 'track'
            },
            success: function (response) {
                //get count of returned tracks, can be less than limit depending on query
                var countResponse = response.tracks.items.length;
                //create random number of returned count
                var randomNumber = Math.floor(Math.random() * countResponse);
                //save one of the returned songs
                data[data.length] = response.tracks.items[randomNumber];
                console.log('tracki each: '+tracki);
                //count up tracki
                tracki++;
                //after the 4th song call setMetadata
                if(tracki>3){
                    setMetaData(gamedata);
                }else{
                    //call recursivly until 4 songs ready
                    getTrack(tracki, gamedata);
                }
            }
        });
    }

    //call 4 different tracks with songName and ArtistName randomized by one letter in spotify query
    function get4Tracks(gamedata) {
        //clear the array
        data.length = 0;
        //start fetching songs with index "tracki" 0
        getTrack(0,gamedata);
    }

    //get artists names into GUI
    function setMetaData(gamedata) {
        GUESS0.text(data[0].artists[0].name);
        GUESS1.text(data[1].artists[0].name);
        GUESS2.text(data[2].artists[0].name);
        GUESS3.text(data[3].artists[0].name);
        btNext.find("i").removeAttr("class");
        btNext.find("i").addClass("fa fa-forward faa-horizontal animated-hover");
        //play song
        playRandomSong(gamedata);
    }

    function playRandomSong(gamedata) {
        //choose a random song to play (0,1,2,3) (which will be the (one) correct answer)
        correct = Math.floor((Math.random() * 3) + 1);
        //get correct previewUrl
        audio.src = data[correct].preview_url;
        //play correct song
        audio.play();
        //add up counter of played songs
        //counter++;
        var c = gamedata.counter;
        c++;
        gamedata.counter = c.toString();
        //if no guess was made until song played - animate next button
        audio.addEventListener('ended', function () {
            btNext.find("i").addClass("animated");
        });
        //set gamedata to global var
        gamedataGlobal = gamedata;
    }

    //do game logic
    function oneGameSet(gamedata) {
        //get count of songs to play in this set
       // gameOfNr = $('#count :selected').val();
        //get music
        get4Tracks(gamedata);
        //getArtistNames and update GUI
        //window.setTimeout(setMetaData, 2000);
    }

    function resetButtons() {
        //clear button text
        guessButtons.text("");
        //clear special css classes
        $(".btGuess").removeAttr("class");
        guessButtons.addClass("btn-violet btGuess");
        //enable buttons
        guessButtons.prop('disabled', false);
        //clear last correct song
        CorArtist.text("");
    }

/* not needed anymore
    function resetCounters() {
        //clear counters
        console.log('before reset: counter: ' + counter + ' and rightAnswers:' + rightAnswers);
        counter = 0;    //counter of played songs
        rightAnswers = 0; //correct answered
        console.log('after reset: counter: ' + counter + ' and rightAnswers:' + rightAnswers);
    }
*/
    //BUTTON HANDLERS
    guessButtons.click(function (event) {
        var gamedata = gamedataGlobal;
        //which button was pressed? -> this.id
        var id = this.id;
        event.preventDefault();
        //disable guess buttons
        guessButtons.prop('disabled', true);
        //show album cover
        $('#cover').find('.fa-volume-up').hide();
        coverImg.attr("src", data[correct].album.images[1].url);
        //write meta data artist and song under cover img
        CorArtist.text(data[correct].artists[0].name+' - '+ data[correct].name);
        //correct button is "guess"+correct
        if (id == 'guess' + correct) {
            //correct was clicked: highlight
            this.setAttribute("class", "btn-violet btGuess btn-correct");
            //count up correct guesses
            var ca = gamedata.correctAnswers;
            ca++;
            gamedata.correctAnswers = ca.toString();
            gamedataGlobal = gamedata;
        } else {
            //wrong answer
            //highlight failed
            this.setAttribute("class", "btn-violet btGuess btn-wrong");
            //highlight correct
            $("[id*=" + correct + "]").addClass("btn-correctWouldHaveBeen");
        }
    });

    //next Button
    btNext.click(function (event) {
        var gamedata = gamedataGlobal;
        event.preventDefault();
        //stop audio playing (if still...)
        audio.pause();
        //reset Buttons
        resetButtons();
        //hide cover, show speaker again
        coverImg.attr("src", "img/speaker.png");
        //play next song until counter reaches gameOfNr
        console.log('Next Bt: counter ' + gamedata.counter + ' of ' + gamedata.gameOfNr + ' rightAnswers:' + gamedata.correctAnswers);
        if (gamedata.counter < gamedata.gameOfNr) {
            //load next play
            oneGameSet(gamedata);
        } else {
            //save score
            addScore(gamedata.gameOfNr, gamedata.correctAnswers);
            //show score and pie
            var gameover = $('#gameover').find('p');
                gameover.empty();
                gameover.text("You've got " + gamedata.correctAnswers + " out of " + gamedata.gameOfNr + " songs right.");
            //reload Highscore section
            getHighscore();
            //set View
            setView(GAMEOVER, SCORE);
            showPie();
            //delete counters
            //resetCounters();
        }
    });
//end of document