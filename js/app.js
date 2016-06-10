/**
 * Created by mj, iw, yh on 10.06.2016
 * @ FHNW iCompetence webeng FS2016
 */
    // Variables
    var counter = 0;                             //counter of played songs
    var rightAnswers = 0;                        //counter of correct guessed songs
    var data = [];                               //data array with 4 tracks
    var correct;                                 //random number from 0-3 - the correct song
    var audio = new Audio();                     //audio that gets played
    var billboard;
    var gameOfNr = $('#count :selected').val();  //number of songs in gameset to play
    var guessButtons = $(".btGuess");

    //Get Billboard Artists from DB
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
    function getTrack(tracki, nerdOrNot) {
        var query;
        var limit;
        //if nerd niveau - difficult music
        if (nerdOrNot == 'nerd') {
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
                //count up tracki
                tracki++;
                //after the 4th song call setMetadata
                if(tracki>3){
                    setMetaData();
                }else{
                    //call recursivly until 4 songs ready
                    getTrack(tracki, nerdOrNot);
                }
            }
        });
    }


    //get artists names into GUI
    function setMetaData() {
        $("#guess0").text(data[0].artists[0].name);
         $("#guess1").text(data[1].artists[0].name);
         $("#guess2").text(data[2].artists[0].name);
         $("#guess3").text(data[3].artists[0].name);
         $("#next").find("i").removeAttr("class");
         $("#next").find("i").addClass("fa fa-forward faa-horizontal animated-hover");
        //play song
        playRandomSong();
    }

    function playRandomSong() {
        //choose a random song to play (0,1,2,3) (which will be the (one) correct answer)
        correct = Math.floor((Math.random() * 3) + 1);
     //   console.log("correct"+correct);
        //get correct previewUrl
        audio.src = data[correct].preview_url;
        //play correct song
        audio.play();
        //add up counter of played songs
        counter++;
        //if no guess was made until song played - animate next button
        audio.addEventListener('ended', function () {
            $('#next').find("i").addClass("animated");
        });
    }

    //start game logic
    function oneGameSet() {
        //clear the array with the songs
        data.length = 0;
        //get count of songs to play in this set
        gameOfNr = $('#count :selected').val();
        //nerdOrNot (or newbie)
        var nerdOrNot = $('#nerd :selected').val();
        //get music; start with first song index=0 and nerdOrNot
        getTrack(0, nerdOrNot);
    }

    function resetButtons() {
        //clear button text
        $(".btGuess").text("");
         //clear special css classes
        $(".btGuess").removeClass('btn-correct');
        $(".btGuess").removeClass('btn-correctWouldHaveBeen');
        $(".btGuess").removeClass('btn-wrong');
        
        $(".btGuess").addClass("btn-violet btGuess");
        //enable buttons
        $(".btGuess").prop('disabled', false);
        //clear last correct song
        $("#CorArtist").text("");
    }

    function resetCounters() {
        //clear counters
        counter = 0;    //counter of played songs
        rightAnswers = 0; //correct answered
    }

    // BUTTON HANDLERS
    // single choice buttons
    function buttonGuess(button){
        //which button was pressed? -> this.id
        var id = button.id;
        //disable guess buttons
        guessButtons.prop('disabled', true);
        //show album cover

         $('#cover').find('.fa-volume-up').hide();
        $("#cover").find("img").attr("src", data[correct].album.images[1].url);
        //write meta data artist and song under cover img
        $("#CorArtist").text(data[correct].artists[0].name+' '+ data[correct].name);
        //correct button is "guess"+correct
        if (id == 'guess' + correct) {
            //correct was clicked: highlight
            button.setAttribute("class", "btn-violet btGuess btn-correct");
            //count up correct guesses
            rightAnswers++;
        } else {
            //wrong answer
            //highlight failed
            button.setAttribute("class", "btn-violet btGuess btn-wrong");
            //highlight correct
            $("[id*=" + correct + "]").addClass("btn-correctWouldHaveBeen");
        }
    };

    //next Button
    function buttonNext(){
        //stop audio playing (if still...)
        audio.pause();
        //reset Buttons
        resetButtons();
        //hide cover, show speaker again
        $("#cover").find("img").attr("src", "img/speaker.png");
        //play next song until counter reaches gameOfNr
        if (counter < gameOfNr) {
            //load next play
            oneGameSet();
        } else {
            //save score
            addScore(gameOfNr, rightAnswers);
            //show score and pie
            var gameover = $('#gameover').find('p');
                gameover.empty();
                gameover.text("You've got " + rightAnswers + " out of " + gameOfNr + " songs right.");

            //set View
            setView(GAMEOVER, SCORE);
            showPie();
            //delete counters
            resetCounters();
        }
    };
//end of document