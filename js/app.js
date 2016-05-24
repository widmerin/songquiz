/**
 * Created by mjair on 02.05.16.
 *
 * based on Snippet by http://jsfiddle.net/JMPerez/0u0v7e1b/
 */

$(document).ready(function() {

// Variables
    var guessButtons = $("#btGuess");   //all 4 Guess Buttons
    var GUESS0 = $("#guess0");  //GUI Buttons Guesses
    var GUESS1 = $("#guess1");
    var GUESS2 = $("#guess2");
    var GUESS3 = $("#guess3");
    var ARTIST0;     //Artist names (String)
    var ARTIST1;
    var ARTIST2;
    var ARTIST3;
    var track0;     //tracks
    var track1;
    var track2;
    var track3;
    var correct;         //random number from 0-3
    var audio = new Audio();    //audio that gets played

    function randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    }

    //get track from spotify
    var getTrack = function searchTracks(query) {
        $.ajax({
            url: 'https://api.spotify.com/v1/search?limit=1',
            data: {
                q: query,
                type: 'track'
            },
            success: function (response) {
               // console.log(response);
                track0 = response;
                return response;
            }
        });
    }

    //call 4 diffrent tracks with songName and ArtistName randomized by one letter in spotify query
    var randomLetterQuery = function(){
        return randomString(1, 'abcdefghijklmnopqrstuvwxyz')+' artist:' + randomString(1, 'abcdefghijklmnopqrstuvwxyz');
    }
    track0 = getTrack(randomLetterQuery());
    track1 = getTrack(randomLetterQuery());
    track2 = getTrack(randomLetterQuery());
    track3 = getTrack(randomLetterQuery());



    //get artist names and previewUrl to correct song for playing
    var getSongData = function () {
        //choose a random song to play (0,1,2,3) (which will be the one correct answer)
        correct = Math.floor((Math.random() * 3) + 1);
        console.log('correct song shall be '+correct);
        //get correct previewUrl
        var correcttrack = 'track'+correct;
        audio.src = correcttrack.preview_url;
        //getArtistNames and update GUI
        setArtist();
        //play correct song
        audio.play();
        //TODO: if no guess was made until song played - count as fail?
        audio.addEventListener('ended', function () {
            //evaluate failed and play next song?
        });
    }

//save artists names in var and set to GUI
    var setArtist = function () {
        //ARTIST0 = track0.tracks.items[0].artists[0].name;
        console.log(track0.toString());
       // console.log(track1);
       // console.log(track2);
       // console.log(track3);

        //    ARTIST1 = data.tracks.items[1].artists[0].name;
        //      ARTIST2 = data.tracks.items[2].artists[0].name;
//        ARTIST3 = data.tracks.items[3].artists[0].name;

       // GUESS0.text(ARTIST0);
       // GUESS1.text(ARTIST1);
       // GUESS2.text(ARTIST2);
       // GUESS3.text(ARTIST3);

    }

setArtist();

    //set gui with meta info
    //getSongData();

    //play one of the songs at random









    guessButtons.on('click', function (e) {
        //which button was pressed? -> target
        var target = e.target;
        console.log(target);
        //correct button contains class guess"i" if correct=="i"
        if (target !== null && target.classList.contains(correct)) {
            //correct answer
            //TODO: target.highlight
            //TODO: show album cover
            //TODO: count point
            //TODO: play next song after clicking next button?
        } else {
            //wrong answer
            //TODO: target.highlight failed
            //TODO: correct.highlight
            //TODO: show album cover
            //TODO: play next song after clicking next button?
        }
    });

    //next Button
    $("#next").on("click", function (event) {
        event.preventDefault();
        //TODO: play next song
    });


//end of document
});