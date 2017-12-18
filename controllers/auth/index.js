/**
 * Created by sid on 1/5/17.
 */

var auth = {

    login:{
        status: require('./login/isloggedin'),
        required: require('./login/requirelogin')
    }

};

module.exports = auth;