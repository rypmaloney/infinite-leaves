const socketIO = require('socket.io');
const Stanza = require('../models/stanza.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

class State {
    constructor() {
        try {
            const data = fs.readFileSync('./data/state.json');
            this.state = JSON.parse(data);
        } catch (err) {
            console.error(err);
            this.state = { currentStanza: '027-001' };
        }
    }

    updatesState(stanzaKey) {
        // Keep current stanza in backend file for server restarts.
        this.state = { currentStanza: stanzaKey };
        fs.writeFile('./data/state.json', JSON.stringify(this.state), (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`Current state saved to file: ${stanzaKey}`);
            }
        });
    }
    getCurrentStanza() {
        try {
            return this.state['currentStanza'];
        } catch (err) {
            console.error(err);
        }
    }

    updateJsonFile(data) {
        // Json file used to initizalize current poem on initial page load.
        try {
            const existingData = JSON.parse(
                fs.readFileSync(
                    path.join(__dirname, '../public/data', 'log.json')
                )
            );

            fs.writeFileSync(
                path.join(__dirname, '../public/data', 'log.json'),
                JSON.stringify(data)
            );
        } catch (err) {
            console.error(`Error updating log file: `, err);
        }
    }
}

module.exports = function (server) {
    const io = socketIO(server, {
        cors: {
            origin: 'http://localhost:3001',
            methods: ['GET', 'POST'],
        },
    });

    stanzaState = new State();
    let intervalId = null;

    intervalId = setInterval(async () => {
        let currentStanzaKey = stanzaState.getCurrentStanza();
        let stanzas = await findStanzaWithNeighbors(currentStanzaKey);

        io.emit('updateStanzas', stanzas);

        stanzaState.updatesState(stanzas['+1'].key);
        stanzaState.updateJsonFile(stanzas);
    }, 120000);

    io.on('connection', (socket) => {
        console.log('A client connected!');
    });
};

const cleanText = (text) => {
    return text.replace(/\n/g, '<br>');
};

const rand_str = (min, max) => {
    // Random number for image 00-04
    // random number for prompt 01-03
    // random based on day to allow frontend preload
    const day = new Date().getDate();
    const randNum = ((day - 1) % (max - min + 1)) + min;
    const randStr = randNum.toString().padStart(2, '0');

    return randStr;
};

const formatURL = (key) => {
    const prompt = '03';
    const image_order = rand_str(0, 4);

    const url = `${process.env.CLOUDFRONT_DOMAIN}/comp/${key}-${prompt}-${image_order}.png`;
    return url;
};

async function findStanzaWithNeighbors(key) {
    let stanza = await Stanza.findOne({ key });
    stanza = stanza.toObject();
    stanza.text = cleanText(stanza.text);
    stanza.url = formatURL(stanza.key);

    if (!stanza) {
        throw new Error(`No stanza found with key ${key}`);
    }

    const prevStanza = await Stanza.findOne({ key: stanza.prev });
    let nextStanza = await Stanza.findOne({ key: stanza.next });
    prevStanza.text = cleanText(prevStanza.text);
    nextStanza.text = cleanText(nextStanza.text);

    nextStanza = nextStanza.toObject();
    nextStanza.url = formatURL(nextStanza.key);

    let nextNextStanza = {};
    let prevPrevStanza = {};

    if (prevStanza) {
        prevPrevStanza = await Stanza.findOne({ key: prevStanza.prev });
        prevPrevStanza.text = cleanText(prevPrevStanza.text);
    }

    if (nextStanza) {
        nextNextStanza = await Stanza.findOne({ key: nextStanza.next });
        nextNextStanza.text = cleanText(nextNextStanza.text);
    }

    return {
        '-2': prevPrevStanza,
        '-1': prevStanza,
        '+0': stanza,
        '+1': nextStanza,
        '+2': nextNextStanza,
    };
}
