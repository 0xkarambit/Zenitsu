const getToken = async () => {
	let url = "https://www.reddit.com/api/v1/access_token";
	const REDDIT_CLIENT_ID = "HarshitJoshi9152";
	const REDDIT_CLIENT_SECRET = "0xhars16149152";
	let headers = {};
	let body = {
		grant_type: "https://oauth.reddit.com/grants/installed_client",
		device_id: "ok this seems random but",
		duration: "permanent"
	};
	fetch(url, {
		method: "POST",
		body,
		headers: {
			// 'Content-Type': 'application/x-www-form-urlencoded',
			// authorization is imp ig basic NXNDNkROa0RtcHdYZXc6
			Authorization:
				`Basic ` + btoa(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`), // Not sure about this
			"user-agent": "Kujo Jotaro"
		}
	})
		.then((res) => {
			console.log(res.ok);
			return res.json();
		})
		.then(console.log)
		.catch(console.log);
};

module.exports = {
	getToken
};
/* do i need to send it in url ?
https://www.reddit.com/api/v1/access_token?grant_type=https%3A%2F%2Foauth.reddit.com%2Fgrants%2Finstalled_client&device_id=DO_Njadsjhksjahdkjasdkjsah&duration=permanent
*/

/*
Example Response

access_token: "-nhQ_D30TMkkgnD6-c4Z4Qaq0mjXL_Q"
device_id: "DO_NOT_TRACK_THIS_DEVICE"
expires_in: 3600
refresh_token: "-x4jHznF9Q3yGNIsmKJ8EBXotjJfCsw"
scope: "*"
token_type: "bearer"

*/

/*
async function getRedditToken() {
    const  REDDIT_CLIENT_ID  = 'xxx';
    const REDDIT_CLIENT_SECRET = 'xxx';
    const REDDIT_ACCESS_TOKEN_URL = 'https://www.reddit.com/api/v1/access_token';

    const tokenData = await fetch(REDDIT_ACCESS_TOKEN_URL, {
       method: 'POST',
        body: 'grant_type=client_credentials',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ` + Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`).toString('base64') // Not sure about this
        }
    }).then(function(response) {
        console.log(response);
        return response.json();
    })
}

*/
