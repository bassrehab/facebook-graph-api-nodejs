/**
 * Created by sid on 1/5/17.
 */
var graph = require('../../facebook');

var isLogin = function(callback){
    if (graph.getAccessToken()) {
        return callback(true)
    }
    else
        return callback(false)
};

module.exports = isLogin;