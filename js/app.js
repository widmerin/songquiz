/**
 * Created by mjair on 02.05.16.
 *
 * based on Snippet by http://jsfiddle.net/JMPerez/0u0v7e1b/
 */

// Variables
var audioObject = null;
var GUESS0 = $("#guess0");
var GUESS1 = $("#guess1");
var GUESS2 = $("#guess2");
var GUESS3 = $("#guess3");
var ARTIST0;
var ARTIST1;
var ARTIST2;
var ARTIST3;
var correct;    //random number from 1-4
var audio4; //array with 4 audioObjects from spotify


var fetchTracks = function (albumId, callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/albums/' + albumId,
        success: function (data) {
            getAudio(data);
        }
    });
};

//create Audio Array
var getAudio = function(data){
    for (var i=0; i<4; i++){
        audio4[i] = new Audio(data.tracks.items[i].preview_url);
    }


}

//save artists names
var setArtist = function(){
    ARTIST0 = response[0].artist;
    ARTIST1 = response[1].artist;
    ARTIST2 = response[2].artist;
    ARTIST3 = response[3].artist;
}

//fill GUI with artists
var fillArtist = function(){
    GUESS0.text(ARTIST0);
    GUESS1.text(ARTIST1);
    GUESS2.text(ARTIST2);
    GUESS3.text(ARTIST3);
}

//choose a random song to play (0,1,2,3) (which will be the one correct answer)
correct =  Math.floor((Math.random() * 3) + 1);
//play correct song



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