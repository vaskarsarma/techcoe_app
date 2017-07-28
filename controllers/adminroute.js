var express = require("express");
var router = express.Router();
module.exports = router;

var MongoDB = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectID;
var db = require('../models/db');
var data = require('../models/users');

router.use(function(req, res, next) {
    if (req.user.admin) {
        next();
        return;
    }
    res.redirect("/login");
});

//================== Get List of Users =================
router.get('/', function(req, res) {
    data.users(function(err, results) {
        if (err) {
            res.status(500).send();
        } else {
            res.render('users', { title: 'user Page', isUserAdded: 'false', users: results });
        }
    });
});

//================== Get List of Users =================
router.get('/list', function(req, res) {
    data.users(function(err, results) {
        if (err) {
            res.status(500).send();
        } else {
            res.render('users', { title: 'user Page', isUserAdded: 'false', users: results });
        }
    });
});

//================== Add User ==================================
router.get("/add", function(req, res) {
    res.render("adduser", { title: "Add User" });
});


//================== Save Data =================
router.post("/savedata", function(req, res) {

    if (req.body._id != undefined && req.body._id != null) {
        var id = req.body._id;
        var name = req.body.name;
        var admin = req.body.admin ? "yes" : "";

        db.get().collection('users').findOne({ _id: ObjectId(id) }, function(err, info) {
            if (err) {
                res.status(500).send();
            } else {
                if (info._id != undefined) {
                    db.get().collection("users").save({
                        "_id": ObjectId(info._id),
                        "name": req.body.name,
                        "password": req.body.password,
                        "admin": admin
                    }, (err, results) => {
                        if (err) {
                            res.status(500).send();
                        } else {
                            data.users(function(err, results) {
                                if (err) {
                                    res.status(500).send();
                                } else {
                                    if (results.length == 0) {
                                        results = { count: 0 };
                                        res.render('users', { title: 'User Page', isUserUpdated: false, users: results });
                                    } else {
                                        res.render('users', { title: 'User Page', isUserUpdated: true, name: name, users: results });
                                    }
                                }
                            });
                        }
                    });
                } else {
                    db.get().collection("users").save(req.body, (err, results) => {
                        if (err) {
                            res.status(500).send();
                        } else {
                            data.users(function(err, results) {
                                if (err) {
                                    res.status(500).send();
                                } else {
                                    if (results.length == 0) {
                                        results = { count: 0 };
                                        res.render('users', { title: 'User Page', isUserAdded: false, users: results });
                                    } else {
                                        req.body = "";
                                        res.render('users', { title: 'User Page', isUserAdded: true, users: results });
                                    }
                                }
                            });
                        }
                    });
                }
            }
        });
    } else {
        db.get().collection("users").save(req.body, (err, results) => {
            if (err) {
                res.status(500).send();
            } else {
                data.users(function(err, results) {
                    if (err) {
                        res.status(500).send();
                    } else {
                        if (results.length == 0) {
                            results = { count: 0 };
                            res.render('users', { title: 'User Page', isUserAdded: false, users: results });
                        } else {
                            req.body = "";
                            res.render('users', { title: 'User Page', isUserAdded: true, users: results });
                        }
                    }
                });
            }
        });
    }
    //}
    //});
});

//================== Delete User =================
router.get('/delete/:_id', function(req, res) {
    var id = req.params._id;
    var name = "";

    db.get().collection('users').findOne({ _id: ObjectId(id) }, function(err, info) {
        if (err) {
            res.status(500).send();
        } else {
            if (info._id != undefined) {
                name = info.name;

                db.get().collection('users', {}, function(err, contacts) {
                    contacts.remove({ _id: ObjectId(id) }, function(err, docs) {
                        if (err) {
                            res.status(500).send();
                        } else {
                            // console.log("Record deleted Successfully");
                            data.users(function(err, results) {
                                if (err) {
                                    res.status(500).send();
                                } else {
                                    res.render('users', { title: 'User Page', isUserDeleted: true, name: name, users: results });
                                }
                            });
                        }
                    });
                });
            }
        }
    });
});

//================== Edit User =================
router.get('/edit/:_id', function(req, res) {
    var id = req.params._id;

    db.get().collection('users').findOne({ _id: ObjectId(id) }, function(err, info) {
        if (err) {
            res.status(500).send();
        } else {
            res.render('edituser', { title: 'Edit User', users: info });
        }
    });
});