/**
 * Created by sid on 1/5/17.
 */


var express = require('express');
var router = express.Router();
var conf = require('../config/settings');
var graph = require('../controllers/facebook/index');
var controllers = require('../controllers');
var _ = require('underscore');

// TODO: Validate this incoming token.
/*
* Confirm the identitity

 GET https://graph.facebook.com/oauth/access_token?
 client_id={app-id}
 &redirect_uri={redirect-uri}
 &client_secret={app-secret}
 &code={code-parameter}
 https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/v2.2#confirm

 GET /debug_token?input_token={token-to-inspect}
 &access_token={app-token-or-admin-token}


 This should only be done server-side, because otherwise you'd make you app access token visible to end users (not a good idea!).

 See

 https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/v2.2#checktoken
 (4) Extending the access token

 Once you got the (short-lived) token, you can do a call to extend the token as described in

 https://developers.facebook.com/docs/facebook-login/access-tokens#extending
 like the following:

 GET /oauth/access_token?grant_type=fb_exchange_token
 &client_id={app-id}
 &client_secret={app-secret}
 &fb_exchange_token={short-lived-token}
 */

/* GET dashboard page. */
router.get('/', function(req, res, next) {
    sess=req.session;

    graph.setAppSecret(conf.fb.app.app_secret);
    var user_token = sess.user_token;

    if(sess.user_token){
        graph.get("/me/accounts?access_token="+user_token, function(err, resfb) {

            if(err){
                console.log(err);
                if(err.code == 190){
                    res.redirect('/authorize');
                }
                var pageObj = {
                    title: 'Error',
                    result: 'Ecountered error',
                    error: true
                }

            }
            else{

                sess.pages = [];
                _.each(resfb.data, function(page) {
                    sess.pages.push({id:page.id, token:page.access_token, name:page.name});
                });

                console.log(sess.pages);
                pageObj = {
                    title: "Dashboard",
                    result: JSON.stringify(resfb), // from resfb create a session array and its access tokens.
                    error: false
                }
            }
            console.log(resfb); // { id: '4', name: 'Mark Zuckerberg'... }

            // loading..your pages..
            res.render("dashboard", pageObj);

        });


    }
    else{
        // loading..your pages..
        res.redirect("/authorize");
    }



});

router.post('/', function(req, res, next) {
    console.log(req.body);
});

module.exports = router;

