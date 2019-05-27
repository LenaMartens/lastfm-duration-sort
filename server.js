require('dotenv').config(); 
const express = require('express');
const app = express();
const port = 8090;

const LastFM = require('last-fm');
const lastfm = new LastFM(process.env.APIKEY, { userAgent: 'MyApp/1.0.0 (http://example.com)' });

app.use(express.static('.'));
app.get('/topList', function(req,res){
	var username = req.query.username;
	var timeRange = req.query.timeRange;
    
    lastfm.userTopTracks({ user: username, period: timeRange, limit:20}, 
    	(err, data) => {
		if (err) console.error(err)
		else {
			var result = data.result;
			result = result
			.map(track =>({
				name: track.name,
				artist: track.artistName,
				playCount: track.listeners,
				duration: track.duration,
				secondsListened: track.duration*track.listeners,
			}))
			.sort(function(a,b){
				return b.secondsListened - a.secondsListened
			})
			res.send(result) 
		}
		});

})
app.listen(port, () => console.log(`Starting server on port ${port}!`))
/*
	lastfm.userTopTracks({ user: 'blackplant_' }, (err, data) => {
		if (err) console.error(err)
			else console.log(data)
		});
*/