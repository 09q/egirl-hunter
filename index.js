const LCUConnector = require('lcu-connector');
const colors = require('colors');
const https = require('https');
const axios = require('axios');
const fs = require('fs');

const readline = require('readline');
const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const agentHttps = new https.Agent({ rejectUnauthorized: false });
connector = new LCUConnector();


console.log(fs.readFileSync(`./views/egirl_${Math.floor(Math.random() * 2)}.txt`).toString().brightRed);
console.log('[.]'.brightBlue + ' Waiting for league client...'.gray)

connector.on('connect', async(data) => {
	console.clear();
	console.log('[+]'.brightGreen + ` Injected into - [ LeagueClient.exe ]`.white)
	console.log(`[.]`.brightBlue +` Connected on ${data.address}:${data.port}`.white);

	const req = axios.create({
		url: `https://127.0.0.1:${data.port}`,
		headers: {
			'content-type': 'application/json',
			'Authorization': `Basic ${Buffer.from(`${data.username}:${data.password}`).toString('base64')}`,
		},
		httpsAgent: agentHttps
	})

	function teamBoost() {
		req.post('lol-champ-select/v1/team-boost/purchase/')
	}

	function boostTime() {
		read.question('[.]'.brightBlue + ' Type y for boost or n for cancel: '.gray,
		function(answer) {
			if(answer === 'y'){
				teamBoost();
			setTimeout(function() {
				boostTime();
			}, 4500)
			} else {
				console.log('[>]'.brightBlue + ' Ok, canceled :d'.white)
			}
		})
	}

	const summoner = await req.get(`https://${data.address}:${data.port}/lol-summoner/v1/current-summoner`).then(
		response => {
			console.log('\n[.]'.brightBlue + ` Hello ${response.data.displayName}, time to boost?`)
			boostTime()
		})

	})

connector.on('disconnect', async(data) => {
	console.log('\n')
	console.log('[^]'.red + ' You have been disconnected'.white)
	console.log('[.]'.brightBlue + ' Closing connections'.gray)
	console.log('[.]'.brightBlue + ' Cleaning buffer...'.gray) // message just to look cute
	console.log('[.]'.brightBlue + ' If it wasnt you, try to reconnect'.gray)
})

connector.start()
