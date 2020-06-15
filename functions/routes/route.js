var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
    res.status(200);

    // Check if the site is mobile, tablet or desktop
    // console.log(req.is_mobile);
    // console.log(req.is_tablet);
    if (!req.is_mobile && !req.is_tablet) {
        // Desktop site
        if(req.signedCookies.sessionEmail){
            console.log("User is signed in!");
            res.render('desktop.ejs');
        }
        console.log("Cookie ",req.signedCookies.sessionEmail);
        res.render('login.ejs');
    } else {
        // This is mobile or tablet site
        res.render('index.ejs');
    }
});

// Make this set cookie
router.post('/set', function(req, res, next){
    res.cookie('sessionEmail', req.body.userEmail, { signed : true });
    console.log("Cookie set");
    res.json({success: 1})
});

router.post('/clear', function(req, res, next){
    res.clearCookie('sessionEmail');
    console.log('Cookie cleared');
    res.json({success: 1});
});

module.exports = router;
