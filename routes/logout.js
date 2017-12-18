/**
 * Created by sid on 1/6/17.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    sess=req.session;
    sess.user_token = null;
    sess.pages = null;

    res.redirect("/");


});

module.exports = router;
