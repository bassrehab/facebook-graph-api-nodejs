/**
 * Created by sid on 1/5/17.
 */
const crypto = require('crypto');
var config = require('../config/settings');

var getAppProof = function(callback){
    var appsecret_proof = crypto.createHmac('sha256', 'TOKEN').update('UPDATED_TOKEN').digest('hex')
    return callback(appsecret_proof)
};

module.exports = getAppProof;