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
        let size = io.sockets.sockets.size;
        let interval = 35000;
        let startTime = Date.now();

        console.log(`Socket size: ${size}`);

        stanzas['start'] = JSON.stringify(startTime);
        stanzas['interval'] = JSON.stringify(interval);
        stanzas['size'] = size;

        io.emit('updateStanzas', stanzas);

        stanzaState.updatesState(stanzas['+1'].key);
        stanzaState.updateJsonFile(stanzas);
    }, 35000);

    io.on('connection', (socket) => {
        console.log('A client connected!');
    });
};

const cleanText = (text) => {
    return text.replace(/\n/g, '<br>');
};

const rand_str = (rdm, min, max) => {
    // Random number for image 00-04
    // random number for prompt 01-03
    // random based on day to allow frontend preload

    const day = new Date().getDate();
    const mod = day + rdm;
    const randNum = ((mod - 1) % (max - min + 1)) + min;
    const randStr = randNum.toString().padStart(2, '0');

    return randStr;
};

const formatURL = (key, prompt, image_order) => {
    const url = `${process.env.CLOUDFRONT_DOMAIN}/123/${prompt}/${key}-${prompt}-${image_order}.png`;

    return url;
};

async function findStanzaWithNeighbors(key) {
    let stanza = await Stanza.findOne({ key });
    stanza = stanza.toObject();
    stanza.text = cleanText(stanza.text);

    const rdm = Math.floor(Math.random() * 10);
    const prompt = rand_str(0, 1, 3);
    const image_order = rand_str(rdm, 0, 3); // Randomize images regardless of day, not prompt

    stanza.url = formatURL(stanza.key, prompt, image_order);
    stanza.caption = stanza.caption[+image_order];

    if (!stanza) {
        throw new Error(`No stanza found with key ${key}`);
    }

    const prevStanza = await Stanza.findOne({ key: stanza.prev });
    let nextStanza = await Stanza.findOne({ key: stanza.next });
    prevStanza.text = cleanText(prevStanza.text);
    nextStanza.text = cleanText(nextStanza.text);

    nextStanza = nextStanza.toObject();
    const nextImages = [];
    for (let order in [0, 1, 2, 3]) {
        nextImages.push(formatURL(nextStanza.key, prompt, `0${order}`));
    } // Prepare a list of possible next images to preload
    nextStanza.url = nextImages;

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
