var express = require('express');
var router = express.Router();
var request = require('request-promise-native');
var multer = require('multer');

var storage = multer.memoryStorage()
var upload = multer({ storage: storage })

var config = require('../config');

var authUrl = config.SS_AUTH || 'http://swiftstackhx.onstaklab.local/auth/v1';
var url = config.SS_URL || 'http://swiftstackhx.onstaklab.local/v1/AUTH_akmeadmin/DigitalMarketing/';

var getAuthToken = function (url) {

    let options = {
        url: url,
        method: 'GET',
        headers: {
            'x-auth-user': config.SS_USER,
            'x-auth-key': config.SS_PASSWORD
        },
        resolveWithFullResponse: true
    };

    return request(options);
};

var myRequest = function ({ url, method, data = null }) {

    getAuthToken(authUrl)
        .then(function (response) {

            let options = {
                url: url,
                method: method,
                headers: {
                    'x-auth-token': response.headers['x-storage-token'],
                },
                body: data
            };

            return request(options);

            //let result = request(options);

            //return result;
        })
        .catch(function (err) {
            console.log(err.message);
        });
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

router.post('/create', upload.single('obj'), (req, res) => {

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
