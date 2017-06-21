var db = require('../models/db');

exports.users = function(cb) {
    var collection = db.get().collection("users");

    collection.find().toArray(function(err, results) {
        cb(err, results);
    });
}