var db = require('../models/db');

// exports.category = function(cb) {
//     var collection = db.get().collection("category");

//     collection.find().toArray(function(err, results) {
//         cb(err, results);
//     });
// }

exports.category = require("../data/blogcategory.json");

exports.allblogs = function(cb) {
    var collection = db.get().collection("blogs");

    collection.find().toArray(function(err, results) {
        cb(err, results);
    });
}

exports.blogs = function(cb) {
    var collection = db.get().collection("blogs");

    collection.find({ status: { $in: ["0", "1"] } }).toArray(function(err, results) {
        cb(err, results);
    });
}