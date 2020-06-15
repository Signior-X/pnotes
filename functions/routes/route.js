var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
    res.status(200);

    // Check if the site is mobile, tablet or desktop
    // console.log(req.is_mobile);
    // console.log(req.is_tablet);
    if (!req.is_mobile && !req.is_tablet) {
        res.end('Hello World!');
    } else {
        // This is mobile or tablet site
        res.render('index.ejs');
    }
});

module.exports = router;
