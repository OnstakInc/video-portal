var express = require('express');
var router = express.Router();
var request = require('request-promise-native');
var multer = require('multer');

var storage = multer.memoryStorage()
var upload = multer({ storage: storage })

var config = require('../config');

var url =  config.SS_URL || 'http://swiftstackhx.onstaklab.local/v1/AUTH_akmeadmin/DigitalMarketing/';

var myRequest = function ({ url, method, data = null }) {

    let options = {
        url: url,
        method: method,
        headers: {
            'x-auth-token':  config.SS_TOKEN || 'AUTH_tk1f464c1cdc0146818fc7faac4f24f425'
        },
        body: data
    };

    let result = request(options);

    return result;
};

router.get('/get/:name', (req, res) => {

    let objectLink = url + req.params.name;

    console.log(objectLink);

    myRequest({ url: objectLink, method: 'GET' }).pipe(res);

});

router.get('/get-all', (req, res) => {

    myRequest({ url: url, method: 'GET' }).then((data) => {

        let list = data.split('\n');

        list.pop();

        res.json({
            list: list
        });

    }).catch((err) => {

        res.end();

    });
    
});

router.post('/create', upload.single('obj') , (req, res) => {

    let objName = req.body.name;

    if (!req.body.name) {
        res.sendStatus(400);
    }

    let objectLink = url + objName;

    myRequest({ url: objectLink, method: 'PUT', data: req.file.buffer }).pipe(res);
});

router.delete('/delete/:name', (req, res) => {
    let objectLink = url + req.params.name;

    console.log(objectLink);

    myRequest({ url: objectLink, method: 'DELETE' }).pipe(res);
});

module.exports = router;
