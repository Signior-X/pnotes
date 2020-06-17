var express = require('express');
var router = express.Router();

// To Make changes in the welcome page -> check admin-branch

router.get('/', function(req, res, next){
    res.status(200);

    // Check if the site is mobile, tablet or desktop
    // console.log(req.is_mobile);
    // console.log(req.is_tablet);
    if (!req.is_mobile && !req.is_tablet) {
        // Desktop site
        if(req.signedCookies.sessionEmail){
            console.log("User is signed in!");
            console.log('Signed in cookie ',req.signedCookies.sessionEmail);
            res.status(200);
            res.render('desktop.ejs', { userEmail: req.signedCookies.sessionEmail, theme: req.cookies.themeData, displayName: req.signedCookies.sessionName } );
        } else {
            console.log("Cookie ", req.signedCookies.sessionEmail);
            // anonymousUserPriyam -> Anonymous user
            // anonymousNotSigned -> Not Logined
    
            // For not logined only allow to see my welcome notes
            // give option at login.ejs to have signed in as anonymous
            res.status(200);
            res.render('login.ejs', { theme: req.cookies.themeData });
        }
    } else {
        // This is mobile or tablet site
        res.render('index.ejs');
    }
});

// Make this set cookie
router.post('/set', function(req, res, next){
    var userEmail = req.body.userEmail.toString();
    if(userEmail === 'anonymousUserPriyam'){
        res.cookie('sessionEmail', userEmail, { signed: true });
        // console.log("Cookie set");
        res.json({success: 1})
    } else {
        var len = userEmail.length;
        var userDisplayName = req.body.userDisplayName.toString();
        console.log("Display Name", userDisplayName);
        if(userEmail.substr((len-10),len) === '@gmail.com') {
            res.cookie('sessionEmail', userEmail.substr(0, len-10), { signed : true });
            res.cookie('sessionName', userDisplayName, {signed: true});
            // console.log("Cookie set");
            res.json({success: 1});
        } else {
            var userEmailString = userEmail.toString().split('.').join("");
            userEmailString = userEmailString.split('@').join("");
            console.log(userEmailString);
            res.cookie('sessionEmail', userEmailString, { signed : true });
            res.cookie('sessionName', userDisplayName, {signed: true});
            res.json({success: 1});
        }
    }
});

router.post('/clear', function(req, res, next){
    res.clearCookie('sessionEmail');
    res.clearCookie('sessionName');
    console.log('session Cookie cleared');
    res.json({success: 1});
});

router.post('/theme/set/:theme', function(req, res, next){
    var themeToSet = req.params.theme;
    res.cookie('themeData', themeToSet);
    res.json({success: 1});
});

module.exports = router;
