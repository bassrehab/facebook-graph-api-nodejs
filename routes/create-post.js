/**
 * Created by sid on 1/6/17.
 */
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
router.get('/:pageID', function(req, res, next) {
    sess = req.session;

    console.log('Generate View for Page');

    var page_id = req.params.pageID;
    console.log('Page ID requested:' + page_id);
    var user_token = sess.user_token;

    var message = req.query.message;

    var post_type = req.query.post_type;

    if(current_page = _.find(sess.pages, function(page) {
            return page.id == page_id;
        })){

        console.log('current_page in create post');
        console.log(current_page);
        if(post_type === 'simple'){
            graph.post("/"+page_id+"/feed?access_token="+current_page.token+"&message="+message, function(err, publishedpost) {
                if(err){
                    console.log(err);
                    if(err.code == 190){
                        res.redirect('/authorize');
                    }
                    var pageObj = {
                        title: 'Error while Posting',
                        result: JSON.stringify(err),
                        error: true,
                        user_token: null
                    };
                    res.render("create-post", pageObj);

                }
                else{

                     pageObj = {
                        title: 'Successfully posted',
                        result: 'Successfully posted to Page: ' + current_page.name + '\n'+JSON.stringify(publishedpost),
                        error: false,
                        user_token: null
                    };
                    res.render("create-post", pageObj);

                }


            });


        }

    }

    else{

        // some error.
        pageObj = {
            title: 'Error',
            result: 'Ecountered error',
            error: true,
            user_token: null
        };

        res.render("create-post", pageObj);
    }

    /*
    if(page_token && page_id && user_token){
        graph.setAppSecret(conf.fb.app.app_secret);

        graph.post("/"+page_id+"/feed?access_token="+page_token+"&message="+message, function(err, publishedpost) {
            if(err){
                console.log(err);
                if(err.code == 190){
                    res.redirect('/authorize');
                }
                var pageObj = {
                    title: 'Error while Posting',
                    result: JSON.stringify(err),
                    error: true,
                    user_token: null
                };
                res.render("create-post", pageObj);

            }
            else{

                var pageObj = {
                    title: 'Successfully posted',
                    result: JSON.stringify(publishedpost),
                    error: true,
                    user_token: null
                };
                res.render("create-post", pageObj);

            }


        });



        }
    else{
        // some error.
        pageObj = {
            title: 'Error',
            result: 'Ecountered error',
            error: true,
            user_token: null
        };

        res.render("create-post", pageObj);
    }
*/

});

router.post('/', function(req, res, next) {
    console.log(req.body);
});

module.exports = router;

