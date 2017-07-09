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