var express = require('express');
var router = express.Router();
var path = require('path');



router.get('/:name', (req, res) => {

    res.sendFile(path.join(__dirname, '../views', 'play.html'));

});

module.exports = router;
