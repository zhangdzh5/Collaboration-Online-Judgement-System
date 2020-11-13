var express = require('express');
var router = express.Router();
var path = require('path');
// GET method route

router.get('/', function (req, res) {
    res.sendFile('index.html', { root: path.join(__dirname, '../../public')
    });
});

module.exports = router;