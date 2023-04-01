var express = require('express');
var router = express.Router();
const path = require('path');

/* GET users listing. */
router.get('/', function (req, res, next) {
    console.log('delivering about page');
    res.sendFile(path.join(__dirname, '../public/build', 'index.html'));
});

module.exports = router;
