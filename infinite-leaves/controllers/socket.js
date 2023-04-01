const socketIO = require('socket.io');
const Stanza = require('../models/stanza.js');
const fs = require('fs');
const path = require('path');

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
        this.state = { currentStanza: stanzaKey };
        fs.writeFile('state.json', JSON.stringify(this.state), (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log('Current state saved to file');
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
    }, 25000);

    io.on('connection', (socket) => {
        console.log('A client connected!');
    });
};

const cleanText = (text) => {
    return text.replace(/\n/g, '<br>');
};

async function findStanzaWithNeighbors(key) {
    const stanza = await Stanza.findOne({ key });
    stanza.text = cleanText(stanza.text);

    if (!stanza) {
        throw new Error(`No stanza found with key ${key}`);
    }

    const prevStanza = await Stanza.findOne({ key: stanza.prev });
    const nextStanza = await Stanza.findOne({ key: stanza.next });
    prevStanza.text = cleanText(prevStanza.text);
    nextStanza.text = cleanText(nextStanza.text);
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
