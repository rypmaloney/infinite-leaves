var express = require('express');
var router = express.Router();
const Stanza = require('../models/stanza.js');
const path = require('path');

router.get('/', async function (req, res, next) {
    console.log('delivering homepage');
    res.sendFile(path.join(__dirname, '../public/build', 'index.html'));
});

module.exports = router;
