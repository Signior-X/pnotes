var express = require('express');
var router = express.Router();

// To Make changes in the welcome page -> check admin-branch

router.get('/', function(req, res, next){
    res.status(200);

    // Check if the site is mobile, tablet or desktop
    // console.log(req.is_mobile);
    // console.log(req.is_tablet);
    // if (!req.is_mobile && !req.is_tablet) {
    if (true) {
        // Desktop site

        // Don't change here, as the themeData will not come in case of firebase here
        // Instead make changes in the javascript of the client side for making the necessary changes
        // if(!(req.cookies.themeData)){
        //     console.log("Themedata not present");
        //     console.log("Sessthemdata", req.cookies.themeData);
        // } else {
        //     console.log("Themedata is present");
        //     console.log(req.cookies.themeData);
        // }

        if(req.signedCookies.__session){
            console.log("User is signed in!");
            console.log(req.signedCookies.__session);
            var sessionInString = req.signedCookies.__session.toString();
            try {
                var parsedResult = JSON.parse(sessionInString);
                // console.log('Signed in cookie ',req.signedCookies.session);
                // console.log('Signed in Name ', req.signedCookies.__session);
                console.log("Parsed DisplayName ", parsedResult.userDisplayName);
                console.log("Parsed Email ", parsedResult.userEmail);
    
                res.status(200);
                res.render('desktop.ejs', { userEmail: parsedResult.userEmail, theme: req.cookies.themeData, displayName: parsedResult.userDisplayName } );
            } catch(e) {
                res.end(e.toString());
            }
        } else {
            console.log("User Not Signed In!");
            // console.log("Cookie ", req.signedCookies.session);
            console.log("Cookie Name ", req.signedCookies.__session);
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

// For cookies session is one thing for firebase cloud functions so check that and node js 8 should be used
router.get("/cook", (req, res) => {
    res.send(req.cookies);
});

router.get('/scook', (req, res) => {
    res.send(req.signedCookies);
});

// Firebase only supports __session cookie for considering and managing sesions
// Make this set cookie
router.post('/set', function(req, res, next){
    // Get and set parameters
    var userEmail = req.body.userEmail.toString();
    var userDisplayName = req.body.userDisplayName.toString();
    var cookieToSet = '';

    // Check for conditions
    if(userEmail === 'anonymousUserPriyam'){

        cookieToSet = '{"userEmail": "' + userEmail + '", "userDisplayName": "' + 'Anonymous' + '"}';
        res.cookie('__session', cookieToSet, { signed: true });

        console.log("Cookie set ", cookieToSet);
        res.json({success: 1})

    } else {
        var len = userEmail.length;
        console.log("Display Name", userDisplayName);

        if(userEmail.substr((len-10),len) === '@gmail.com') {

            cookieToSet = '{"userEmail": "' + userEmail.substr(0, len-10) + '", "userDisplayName": "' + userDisplayName + '"}';
            res.cookie('__session', cookieToSet, {signed: true});
            console.log("Cookie set Gmail ", cookieToSet);

            // console.log("Cookie set Name", userDisplayName);
            // console.log("Cookie set Email complete", userEmail);
            res.json({success: 1});

        } else {

            var userEmailString = userEmail.toString().split('.').join("");
            userEmailString = userEmailString.split('@').join("");
            console.log(userEmailString);

            cookieToSet = '{"userEmail": "' + userEmailString + '", "userDisplayName": "' + userDisplayName + '"}';
            res.cookie('__session', cookieToSet, {signed: true});
            console.log("Cookie Set All ", cookieToSet);

            // console.log("Cookie set Name", userDisplayName);
            // console.log("Cookie set Email complete", userEmail);

            res.json({success: 1});
        }
    }
});

router.post('/clear', function(req, res, next){
    res.clearCookie('__session');
    console.log('session Cookie cleared');
    res.json({success: 1});
});

router.post('/theme/set/:theme', function(req, res, next){
    var themeToSet = req.params.theme;
    res.cookie('themeData', themeToSet);
    res.json({success: 1});
});

router.get('/mobile', function(req, res, next) {
    res.render('index.ejs');
});

module.exports = router;
