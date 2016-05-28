/**
 * Created by mj on 25.05.2016
 */

$(document).ready(function() {

// Variables
    var guessButtons = $(".btGuess");   //all 4 Guess Buttons
    var GUESS0 = $("#guess0");  //GUI Buttons Guesses
    var GUESS1 = $("#guess1");
    var GUESS2 = $("#guess2");
    var GUESS3 = $("#guess3");
    var btNext = $("#next");
    var gameOfNr = $('#count :selected').val();   //number of songs in gameset to play
    var counter = 1;    //counter of played songs
    var rightAnswers = 0;   //counter of correct guessed songs
    var data = [];     //data array with 4 tracks
    var correct;         //random number from 0-3
    var audio = new Audio();    //audio that gets played
    var coverImg = $("#cover").find("img");



    //get random single letter
    function randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    }

    //get randomized query string
    function randomLetterQuery(){
        return randomString(1, 'abcdefghijklmnopqrstuvwxyz')+' artist:' + randomString(1, 'abcdefghijklmnopqrstuvwxyz');
    }

    //get 1 track from spotify
    function getTrack(query) {
        $.ajax({
            url: 'https://api.spotify.com/v1/search?limit=1',
            data: {
                q: query,
                type: 'track'
            },
            success: function (response) {
                data[data.length]=response;
            }
        });
    }
    //debug log
    function logTracks(){
        console.log('track0 = '+data[0].tracks.items[0].preview_url);
    }


    //call 4 diffrent tracks with songName and ArtistName randomized by one letter in spotify query
    function get4Tracks(){
        data.length=0;  //clear the array
        for (var i=0;i<4;i++){
            getTrack(randomLetterQuery());
        }
    }

    //get artists names into GUI
    function setMetaData() {
        GUESS0.text(data[0].tracks.items[0].artists[0].name);
        GUESS1.text(data[1].tracks.items[0].artists[0].name);
        GUESS2.text(data[2].tracks.items[0].artists[0].name);
        GUESS3.text(data[3].tracks.items[0].artists[0].name);
    }

    function playRandomSong() {
        //choose a random song to play (0,1,2,3) (which will be the one correct answer)
        correct = Math.floor((Math.random() * 3) + 1);
        console.log('correct song shall be '+correct);
        //get correct previewUrl
        audio.src = data[correct].tracks.items[0].preview_url;
        //play correct song
        audio.play();
        //TODO: if no guess was made until song played - count as fail?
        audio.addEventListener('ended', function () {
            //evaluate failed and play next song?
        });
    }

    //do game logic
    function oneGameSet(){
        gameOfNr = $('#count :selected').val();
        get4Tracks();
        //debug log
        window.setTimeout(logTracks, 2000);
        //getArtistNames and update GUI
        window.setTimeout(setMetaData, 2000);
        //play one of the songs at random
        window.setTimeout(playRandomSong, 2000);
    }

function resetButtons(){
    //clear button text
    guessButtons.text("");
    //clear special css classes
    //guessButtons.removeAttribute("btn-correct");
    //guessButtons.removeAttribute("btn-correctWouldHaveBeen");
    guessButtons.removeAttribute("class");

    guessButtons.addClass("btn-violet");

}



    //BUTTON HANDLERS

    guessButtons.click(function (event) {
        //which button was pressed? -> this.id
        event.preventDefault();
        //disable guess buttons
        guessButtons.prop('disabled', true);
        //show album cover
        coverImg.attr("src",data[correct].tracks.items[0].album.images[1].url);

        //correct button is "guess"+correct
        if (this.id.contains(correct)) {
            //correct was clicked: highlight
            this.setAttribute("class", "btn-correct");
            console.log('correct is '+this.id);
            //count up correct guesses
            rightAnswers++;
        } else {
            //wrong answer
            console.log('false is '+this.id);
            //highlight failed
            this.setAttribute("class", "btn-wrong");
            //highlight correct
            $("[id*="+correct+"]").addClass("btn-correctWouldHaveBeen");
        }

    });

    //next Button
    btNext.click(function (event) {
        event.preventDefault();
        //add up counter of played songs
        counter++;
        //stop audio playing (if still...)
        audio.pause();
        //play next song until counter reaches gameOfNr
        if (counter<gameOfNr){
            //enable buttons again
            guessButtons.prop('disabled', false);
            //hide cover, show speaker again
            coverImg.attr("src","img/speaker.png");
            //reset Buttons
            resetButtons();
            //load next play
            oneGameSet();
        }else{
            getHighscore();
            // setView(START,SCORE);   //TODO: setView() not working from here ???
        }
    });

    //play first song (after this play further songs by clicking next button)
    oneGameSet();


//end of document
});