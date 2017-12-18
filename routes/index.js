var express = require('express');
var router = express.Router();

var controllers = require('../controllers');
/* GET home page. */
router.get('/', function(req, res) {
    sess=req.session;

    console.log('User Token is:');
    console.log(sess.user_token);

    if(sess.user_token){
        console.log('User session exists redirecting to dashboard');
        res.redirect("/dashboard");
    }
    else
        res.render("index", { title: "click link to connect", loggedin: false });

});

module.exports = router;
