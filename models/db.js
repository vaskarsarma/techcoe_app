var MongoClient = require('mongodb').MongoClient;
var ObjectId = require("mongodb").ObjectID;

var state = {
    db: null,
    //hash: null,
}

exports.url = 'mongodb://vaskar:12345678@ds161001.mlab.com:61001/mytest_mongodb';

exports.connect = function(url, done) {
    if (state.db) return done()

    MongoClient.connect(url, function(err, db) {
        if (err) return done(err)
        state.db = db
        done()
    })
}

exports.get = function() {
    return state.db
}

function getConnection() {
    return state.db
}

exports.update = function(collection, findQuery, updateQuery) {
    console.log("3");
    console.log("collection:" + collection + " , " + JSON.stringify(findQuery) + " , " + JSON.stringify(updateQuery));
    console.log("4");
    return new Promise(function(resolve, reject) {
        getConnection().collection(collection).update(findQuery, { $set: updateQuery }, { upsert: true },
            (err, results) => {
                if (!err) {
                    console.log("update success");
                    resolve(results);
                } else {
                    console.log("update failure");
                    reject(err);
                }
            });
    });
}

exports.findOne = function(collection, filter) {
    //  console.log("filter:" + JSON.stringify(filter));
    var test = JSON.stringify(filter);
    //console.log("test:" + test);
    return new Promise(function(resolve, reject) {
        getConnection().collection(collection)
            //.findOne({ "username": "ankit" }, (err, results) => {
            .findOne(filter, (err, results) => {

                if (!err) {
                    //  console.log("resolve" + JSON.stringify(results));
                    resolve(results);
                } else {
                    // console.log("reject");
                    reject(err);
                }
            });
    });
}

exports.Insert = function(collection, filter) {
    // console.log("DB: Insert" + JSON.stringify(filter));
    return new Promise(function(resolve, reject) {
        getConnection().collection(collection)
            .save(filter, (err, results) => {
                if (!err) {
                    // console.log("resolve subscription");
                    resolve(results);
                } else {
                    //   console.log("reject");
                    reject(err);
                }
            });
    });
}

exports.findAllCount = function(collection) {
    //console.log("find all: " + collection);
    return new Promise(function(resolve, reject) {
        getConnection().collection(collection).find().count(function(err, count) {
            if (!err) {
                //  console.log("resolve : " + collection + ": " + JSON.stringify(count));
                resolve(count);
            } else {
                //   console.log("reject");
                reject(err);
            }
        });
    });
}

exports.find = function(collection, filter1, filter2) {
    // console.log("test");
    // console.log("find: " + collection + " , filter:" + JSON.stringify(filter1));
    //  console.log("find: " + collection);
    filter2 = filter2 != null ? filter2 : {};
    return new Promise(function(resolve, reject) {
        getConnection().collection(collection).find(filter2, filter1).toArray(function(err, results) {
            if (!err) {
                // console.log("success");
                //   console.log("resolve : " + collection + ": " + JSON.stringify(results));
                resolve(results);
            } else {
                //  console.log("reject");
                reject(err);
            }
        });
    });
}

exports.close = function(done) {
    if (state.db) {
        state.db.close(function(err, result) {
            state.db = null
            state.mode = null
            done(err)
        })
    }
}