/**
 * Created by sid on 1/5/17.
 */
var express = require('express');
var router = express.Router();


var graph = require('../controllers/facebook/index');
var controllers = require('../controllers');
var conf = require('../config/settings');

router.get('/', function(req, res) {
    var redisClient = req.app.get('redis');


    // we don't have a code yet
    // so we'll redirect to the oauth dialog
    if (!req.query.code) {
        var authUrl = graph.getOauthUrl({
            "client_id":     conf.fb.app.client_id
            , "redirect_uri":  conf.fb.app.redirect_uri
            , "scope":         conf.fb.app.scope
        });

        if (!req.query.error) { //checks whether a user denied the app facebook login/permissions
            console.log("authURL in authorize.js" + JSON.stringify(authUrl));
            res.redirect(authUrl);
        } else {  //req.query.error == 'access_denied'
            res.send('access denied');
        }
        return;
    }


    // Added:
    graph.setVersion(conf.fb.graph.version);
    graph.setAppSecret(conf.fb.app.app_secret);
    //graph.setAccessToken(access_token);

    // code is set
    // we'll send that and get the access token
    graph.authorize({
        "client_id":      conf.fb.app.client_id
        , "redirect_uri":   conf.fb.app.redirect_uri
        , "client_secret":  conf.fb.app.client_secret
        , "code":           req.query.code
    }, function (err, facebookRes) {
        console.log('facebookRes is: '+ JSON.stringify(facebookRes));
        //graph.setAccessToken(facebookRes.access_token);
        console.log('req.query.code is:' + req.query.code);

        // set the redis values.
        // <user_id>:<access_token>

        //https://graph.facebook.com/me?access_token=...

        //redisClient.set(clientID, clientToken);
        sess=req.session;
        sess.user_token = facebookRes.access_token;

        res.redirect('/dashboard');
    });

});

module.exports = router;


