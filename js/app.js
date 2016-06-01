/**
 * Created by mj on 29.05.2016
 */
    // Variables
    var guessButtons = $(".btGuess");   //all 4 Guess Buttons
    var GUESS0 = $("#guess0");          //GUI Buttons Guesses
    var GUESS1 = $("#guess1");
    var GUESS2 = $("#guess2");
    var GUESS3 = $("#guess3");
    var btNext = $("#next");
    var gameOfNr = $('#count :selected').val();   //number of songs in gameset to play
    var counter = 1;                             //counter of played songs
    var rightAnswers = 0;                        //counter of correct guessed songs
    var data = [];                               //data array with 4 tracks
    var correct;                                 //random number from 0-3
    var audio = new Audio();                     //audio that gets played
    var coverImg = $("#cover").find("img");
    var artists;

    //Get Artists from DB
    function getArtists() {
        $.ajax({
            type: 'GET',
            url: apiURL+'/billboard',
            dataType: "json",
            success: function(data){
                artists = data;
            },
            error: function(){
                console.log('no Artitsts!');
            }

        });
    }
    getArtists();
    var randomNumber = Math.floor(Math.random() * 100);
    var artist = artists[randomNumber].get('artist');
    console.log(artist);

    //get randomized query string for spotify query with artists from billboard
    function randomArtistQuery() {
        var randomNumber = Math.floor(Math.random() * 100);
        var artist = artists[randomNumber].get('artist');
        console.log(artist);
        return randomString(1, 'abcdefghijklmnopqrstuvwxyz') + ' artist:' + artist;
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
    function getTrack(query) {
        var randomNumber = Math.floor(Math.random() * 50);
        $.ajax({
            url: 'https://api.spotify.com/v1/search?limit=50',
            data: {
                q: query,
                type: 'track'
            },
            success: function (response) {
                data[data.length] = response.tracks.items[randomNumber];
            }
        });
    }

    //call 4 different tracks with songName and ArtistName randomized by one letter in spotify query
    function get4Tracks() {
        //clear the array
        data.length = 0;
        for (var i = 0; i < 4; i++) {
            getTrack(randomLetterQuery());
            //  TODO: call this if user is Newbie
            // getTrack(randomArtistQuery());
        }
    }

    //get artists names into GUI
    function setMetaData() {
        GUESS0.text(data[0].artists[0].name);
        GUESS1.text(data[1].artists[0].name);
        GUESS2.text(data[2].artists[0].name);
        GUESS3.text(data[3].artists[0].name);
    }

    function playRandomSong() {
        //choose a random song to play (0,1,2,3) (which will be the (one) correct answer)
        correct = Math.floor((Math.random() * 3) + 1);
        //DEBUG: console.log('correct song shall be ' + correct);
        //get correct previewUrl
        audio.src = data[correct].preview_url;
        //play correct song
        audio.play();
        //if no guess was made until song played - click next automatically
        audio.addEventListener('ended', function () {
            btNext.trigger( "click" );
        });
    }

    //do game logic
    function oneGameSet() {
        //get count of songs to play in this set
        gameOfNr = $('#count :selected').val();
        //get music
        get4Tracks();
        //getArtistNames and update GUI
        window.setTimeout(setMetaData, 2000);
        //play one of the songs at random
        window.setTimeout(playRandomSong, 2000);
    }

    function resetButtons() {
        //clear button text
        guessButtons.text("");
        //clear special css classes
        $(".btGuess").removeAttr("class");
        guessButtons.addClass("btn-violet btGuess");
        //enable buttons
        guessButtons.prop('disabled', false);
    }

    function resetCounters() {
        //clear counters
        counter = 1;    //counter of played songs
        rightAnswers = 0;
    }

    //BUTTON HANDLERS

    guessButtons.click(function (event) {
        //which button was pressed? -> this.id
        var id = this.id;
        event.preventDefault();
        //disable guess buttons
        guessButtons.prop('disabled', true);
        //show album cover
        coverImg.attr("src", data[correct].album.images[1].url);
        //correct button is "guess"+correct
        if (id == 'guess'+correct) {
            //correct was clicked: highlight
            this.setAttribute("class", "btn-violet btGuess btn-correct");
            console.log('correct is ' + id);
            //count up correct guesses
            rightAnswers++;
        } else {
            //wrong answer
            console.log('false is ' + id+ ' '+'GUESS'+correct);
            //highlight failed
            this.setAttribute("class", "btn-violet btGuess btn-wrong");
            //highlight correct
            $("[id*=" + correct + "]").addClass("btn-correctWouldHaveBeen");
        }
    });

    //next Button
    btNext.click(function (event) {
        event.preventDefault();
        //add up counter of played songs
        counter++;
        //stop audio playing (if still...)
        audio.pause();
        //reset Buttons
        resetButtons();
        //hide cover, show speaker again
        coverImg.attr("src", "img/speaker.png");
        //play next song until counter reaches gameOfNr
        if (counter <= gameOfNr) {
            //load next play
            oneGameSet();
        } else {
            //save score
            addScore(gameOfNr, rightAnswers);
            //reload Highscore section
            getHighscore();
            //Empty
            $('#gameover').find('p').empty();
            $('#gameover').find('p').text("You've got "+rightAnswers+" out of "+ gameOfNr+" songs right.");
           setView(GAMEOVER, SCORE);
           showPie();
        }
    });

//end of document
