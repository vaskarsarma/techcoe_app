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

    // Validate User Data
    // var name = req.body.name;
    // var email = req.body.email;
    // var password = req.body.password;
    // var password2 = req.body.password2;

    // req.checkBody('name', 'Name field is required').notEmpty();
    // req.checkBody('email', 'email field is required').notEmpty();
    // req.checkBody('email', 'email is not valid').isEmail();
    // req.checkBody('password', 'password field is required').notEmpty();
    // req.checkBody('password2', 'password2 field is required').notEmpty();
    // req.checkBody('password2', 'password didnot match').equals(req.body.password);

    // var errors = req.validationErrors();
    // if (errors) {
    //     console.log("errors");
    //     res.render('users', {
    //         errors: errors,
    //         name: name,
    //         email: email,
    //         password: password,
    //         password2: password2
    //     });
    // } else {
    //     console.log("home");
    //     res.redirect('/home');
    // }

    if (req.body._id != undefined && req.body._id != null) {
        var id = req.body._id;
        var name = req.body.name;

        db.get().collection('users').findOne({ _id: ObjectId(id) }, function(err, info) {
            if (err) {
                res.status(500).send();
            } else {
                if (info._id != undefined) {
                    db.get().collection("users").save({
                        "_id": ObjectId(info._id),
                        "name": req.body.name,
                        "password": req.body.password,
                        "admin": req.body.admin
                    }, (err, results) => {
                        console.log("u4");
                        if (err) {
                            res.status(500).send();
                        } else {
                            console.log("Data updated Successfully");
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
                            console.log("Data Saved Successfully");
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
                console.log("Data Saved Successfully");
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
                            console.log("Record deleted Successfully");
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