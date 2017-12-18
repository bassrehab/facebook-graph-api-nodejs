/**
 * Created by sid on 1/5/17.
 */
var graph = require('../../facebook');

// req, res ordering was giving issues?
var requireLogin = function(req, res, next) {
    if (graph.getAccessToken()) {
        next();
    } else {
        console.log('Not Logged In');
        res.redirect('/authorize');
    }
};

module.exports = requireLogin;