

export async function tokengetbyeventid(eventid) {
    const fetch = require('node-fetch');

    let url = 'https://cors-anyhere.herokuapp.com/https://demetergift-database.vercel.app/api/tokensbyevent';

    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json, text/plain, */*'
        },
        data: `{"id": ${eventid}}`
    };
    var allTokens;
    var booltrue = true;
    while (booltrue) {
        try {
            await fetch(url, options).then(res => res.json())
                .then(json => allTokens = json)
        } catch (er) {
            continue;
        }
        break;
    }

    return allTokens;
}

