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
    return new Promise(function(resolve, reject) {
        getConnection().collection(collection).update(findQuery, { $set: updateQuery }, { upsert: true },
            (err, results) => {
                if (!err) {
                    resolve(results);
                } else {
                    reject(err);
                }
            });
    });
}

exports.findOne = function(collection, filter) {
    return new Promise(function(resolve, reject) {
        getConnection().collection(collection)
            .findOne(filter, (err, results) => {
                if (!err) {
                    resolve(results);
                } else {
                    reject(err);
                }
            });
    });
}

exports.Insert = function(collection, filter) {
    return new Promise(function(resolve, reject) {
        getConnection().collection(collection)
            .save(filter, (err, results) => {
                if (!err) {
                    resolve(results);
                } else {
                    reject(err);
                }
            });
    });
}

exports.findAllCount = function(collection) {
    return new Promise(function(resolve, reject) {
        getConnection().collection(collection).find().count(function(err, count) {
            if (!err) {
                resolve(count);
            } else {
                reject(err);
            }
        });
    });
}

exports.find = function(collection, filter1, filter2) {

    filter2 = filter2 != null ? filter2 : {};
    return new Promise(function(resolve, reject) {
        getConnection().collection(collection).find(filter2, filter1).toArray(function(err, results) {
            if (!err) {
                resolve(results);
            } else {
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