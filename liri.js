var fs = require('fs');
var keysJs = require("./keys.js");
var Twitter = require('twitter');
var SpotifyWebApi = require('spotify-web-api-node');
var request = require('request');
var spotifyApi = new SpotifyWebApi({
    clientId: keysJs.spotifyKeys.Client_ID,
    clientSecret: keysJs.spotifyKeys.Client_Secret,
    redirectUri: 'http://www.example.com/callback'
});

//needed for switch: gets whatever is at position 2, 
// so switch knows which function to run 
var action = process.argv[2];

//creates switch so that you can run each function seperately
switch (action) {
    case 'my-tweets':
        myTweets();
        break;
    case 'spotify-this-song':
        spotifyThisSong();
        break;
    case 'movie-this':
        movieThis();
        break;
    case 'do-what-it-says':
        doWhatItSays();
        break;
};

//Shows 20 tweets
function myTweets(userName) {

    var client = new Twitter({
        consumer_key: keysJs.twitterKeys.consumer_key,
        consumer_secret: keysJs.twitterKeys.consumer_secret,
        access_token_key: keysJs.twitterKeys.access_token_key,
        access_token_secret: keysJs.twitterKeys.access_token_secret
    });

    var userName = 'trrenicker';
    var params = {
        screen_name: userName,
        count: 20
    };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            console.log(tweets);
        }

    });

}

//takes in the song name and searches for info about it
function spotifyThisSong(song) {

    song = process.argv[3];

    spotifyApi.searchTracks(song, function(err, data) {
        console.log(data);
        // for (var i = 0; i < 5; i++) {
        //     if (data.tracks.items[i] != undefined) {
        //         console.log('Artist: ' + data.tracks.items[i].artists[0].name)
        //         console.log('Song: ' + data.tracks.items[i].name)
        //         console.log('Album: ' + data.tracks.items[i].album.name)
        //         console.log('Preview Url: ' + data.tracks.items[i].preview_url)
        //     }
        // }
        // if (error) {
        //     console.log('Error occurred: ' + error);
        //     return;
        // }
    });
}

//displays info about a movie
function movieThis() {

    movie = process.argv[3];

    request('http://www.omdbapi.com/?t=' + movie + '&y=&plot=short&r=json&tomatoes=true&apikey=40e9cece', function(error, response, body) {
        if (!error && response.statusCode == 200) { //200 = successful request
            var movieText =
                "Title: " + JSON.parse(body)["Title"] + "\n" +
                "Year: " + JSON.parse(body)["Year"] + "\n" +
                "IMDB Rating: " + JSON.parse(body)["imdbRating"] + "\n" +
                "Country: " + JSON.parse(body)["Country"] + "\n" +
                "Language: " + JSON.parse(body)["Language"] + "\n" +
                "Plot: " + JSON.parse(body)["Plot"] + "\n" +
                "Actors: " + JSON.parse(body)["Actors"] + "\n" +
                "Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"] + "\n" +
                "Rotten Tomato URL: " + JSON.parse(body)["tomatoURL"]
            console.log(movieText); // Show the text in the terminal
        }
    });

};

function doWhatItSays() {
    fs.readFile('random.txt', 'utf8', function(error, data) {
        if (!error) {
            doWhat = data.split(',');
            spotifyThisSong(doWhat[0], doWhat[1]);
        } else {
            console.log('Error occurred' + error);
        }
    });
};
