var MongoClient = require('mongodb').MongoClient

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
    //state.db.get().collection(collection).update()
    return new Promise(function(resolve, reject) {
        state.db.get().collection(collection)
            .update({ findQuery }, { $set: { updateQuery } }, (err, results) => {
                if (!err) {
                    resolve(results);
                } else {
                    reject(err);
                }
            });
    });
}

exports.findOne = function(collection, filter, findQuery) {
    console.log("filter:" + JSON.stringify(filter));
    var test = JSON.stringify(filter);
    console.log("test:" + test);
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
    console.log("DB: Inset" + JSON.stringify(filter));
    return new Promise(function(resolve, reject) {
        getConnection().collection(collection)
            .save(filter, (err, results) => {
                if (!err) {
                    console.log("resolve subscription");
                    resolve(results);
                } else {
                    console.log("reject");
                    reject(err);
                }
            });
    });
}

exports.findAllCount = function(collection) {
    console.log("find all: " + collection);
    return new Promise(function(resolve, reject) {
        getConnection().collection(collection).find().count(function(err, count) {
            if (!err) {
                console.log("resolve : " + collection + ": " + JSON.stringify(count));
                resolve(count);
            } else {
                console.log("reject");
                reject(err);
            }
        });
    });
}



exports.find = function(collection) {
    console.log("find: " + collection);
    return new Promise(function(resolve, reject) {
        getConnection().collection(collection).find().toArray(function(err, results) {
            if (!err) {
                // console.log("resolve : " + collection + ": " + JSON.stringify(results));
                resolve(results);
            } else {
                console.log("reject");
                reject(err);
            }
        });
    });
}


// exports.GetHash = function() {
//     return state.hash
// }

// exports.GetHashInfo = function() {
//     console.log("outside hash");
//     connect().collection('hash').find(function(err, info) {
//         console.log("inside hash");
//         if (err) return done(err)
//         state.hash = info;
//         console.log("inside hash1 :" + info);
//         done();
//     });
// }

exports.close = function(done) {
    if (state.db) {
        state.db.close(function(err, result) {
            state.db = null
            state.mode = null
            done(err)
        })
    }
}