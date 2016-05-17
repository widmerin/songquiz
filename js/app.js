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
    var correct;         //random number from 0-3
    var audioObject;    //preview_url audioObject from spotify
    var data;           //fetched spotify data




//Search spotify music
    var searchTracks = function () {
        $.ajax({
            url: 'https://api.spotify.com/v1/search',
            data: {
                q: '',
                type: 'track'
            },
            success: function (response) {
                data = response;
            }
        });
    };

    searchTracks();

//get 4 tracks from spotify
//TODO: correct api call for 4 songs out of pop, rock or billboard playlist ?
    var albumId = '2rlYmTiGNtMRju9TKvf8i5';
    var fetchTracks = function (albumId) {
        $.ajax({
            url: 'https://api.spotify.com/v1/albums/' + albumId,
            success: function (data) {
                getSongData(data);
            }
        });
    };

//get artist names and previewUrl to correct song for playing
    var getSongData = function (data) {
        //choose a random song to play (0,1,2,3) (which will be the one correct answer)
        correct = Math.floor((Math.random() * 3) + 1);
        console.log(correct);
        //get correct previewUrl
        audioObject = new Audio(data.tracks.items[correct].preview_url);
        //getArtistNames and update GUI
        setArtist();
        //play correct song
        audioObject.play();
        //TODO: if no guess was made until song played - count as fail?
        audioObject.addEventListener('ended', function () {
            //evaluate failed and play next song?
        });

    }

//save artists names in var and set to GUI
    var setArtist = function () {
        ARTIST0 = data.tracks.items[0].artist;
        ARTIST1 = data.tracks.items[1].artist;
        ARTIST2 = data.tracks.items[2].artist;
        ARTIST3 = data.tracks.items[3].artist;

        GUESS0.text(ARTIST0);
        GUESS1.text(ARTIST1);
        GUESS2.text(ARTIST2);
        GUESS3.text(ARTIST3);

    }


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


/*
 Snippet by http://jsfiddle.net/JMPerez/0u0v7e1b/

 // find template and compile it
 var templateSource = document.getElementById('results-template').innerHTML,
 template = Handlebars.compile(templateSource),
 resultsPlaceholder = document.getElementById('results'),
 playingCssClass = 'playing',
 audioObject = null;

 var fetchTracks = function (albumId, callback) {
 $.ajax({
 url: 'https://api.spotify.com/v1/albums/' + albumId,
 success: function (response) {
 callback(response);
 }
 });
 };

 var searchAlbums = function (query) {
 $.ajax({
 url: 'https://api.spotify.com/v1/search',
 data: {
 q: query,
 type: 'album'
 },
 success: function (response) {
 resultsPlaceholder.innerHTML = template(response);
 }
 });
 };

 results.addEventListener('click', function (e) {
 var target = e.target;
 if (target !== null && target.classList.contains('cover')) {
 if (target.classList.contains(playingCssClass)) {
 audioObject.pause();
 } else {
 if (audioObject) {
 audioObject.pause();
 }
 fetchTracks(target.getAttribute('data-album-id'), function (data) {
 audioObject = new Audio(data.tracks.items[0].preview_url);
 audioObject.play();
 target.classList.add(playingCssClass);
 audioObject.addEventListener('ended', function () {
 target.classList.remove(playingCssClass);
 });
 audioObject.addEventListener('pause', function () {
 target.classList.remove(playingCssClass);
 });
 });
 }
 }
 });

 document.getElementById('search-form').addEventListener('submit', function (e) {
 e.preventDefault();
 searchAlbums(document.getElementById('query').value);
 }, false);
 */