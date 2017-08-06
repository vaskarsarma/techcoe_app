var express = require("express");
var router = express.Router();
module.exports = router;
var formidable = require('formidable');
var path = require("path");
var fs = require("fs");
var mv = require("mv");
var mkdirp = require("mkdirp");
var db = require("../models/db");
var ObjectId = require("mongodb").ObjectID;

var logs = require("../models/loggers");

var configparam = require("../data/configparam.json");

//View/Edit user details
router.get('/:_id', function(req, res) {
    var userid = req.params._id;
    var filter = { "userid": userid };

    var collectionCountList = {};

    Promise.all([
        db.findOne("aboutme", filter),
        db.findOne("personalinfo", filter),
        db.findOne("proffessionalinfo", filter),
        db.findOne("education", filter),
        db.findOne("contactdetails", filter)
    ]).then(data => {
        res.render("myprofile", {
            layout: 'layout',
            title: 'My Profile Page',
            aboutme: data[0],
            personaldetails: data[1],
            proffessionaldetails: data[2],
            edudetails: data[3],
            contactdetails: data[4]
        });
        logs.logger.info("Successfully retrive my-profile data");
    }).catch(function(err) {
        logs.logger.error("Error while retieveing my-profile data. Error " + err);
        res.status(500).send();
    });
});

router.post('/updateaboutme', function(req, res) {
    if (req.url == '/updateaboutme') {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            var userid = fields.userid;
            var data = fields.aboutme;
            var id = fields._id;
            var filter = "";

            if (userid != "" && id == "") {
                filter = { "userid": userid, "content": data };
                db.Insert("aboutme", filter).then(function(results) {
                    res.json(true);
                }).catch(function(err) {
                    res.json(false);
                });
            } else {
                filter = { "_id": ObjectId(id) };
                db.findOne('aboutme', filter).then(function(results) {
                    if (results._id != undefined) {
                        filter = { "_id": ObjectId(results._id) };
                        var updateQuery = { "content": data };

                        db.get().collection("aboutme").update(filter, {
                            $set: updateQuery
                        }, { upsert: false }, (err, results) => {
                            if (err) {
                                res.json(false);
                            } else {
                                console.log("content updated Successfully");
                                res.json(true);
                            }
                        });
                    }
                }).catch(function(err) {
                    res.json(false);
                });
            }
        });
    }
    return;
});

router.post('/updatepersonaldetails', function(req, res) {
    if (req.url == '/updatepersonaldetails') {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            var userid = fields.userid;
            var id = fields._id;
            var filter = "";

            if (userid != "" && id == "") {

                filter = {
                    "userid": userid,
                    "firstname": fields.firstname,
                    "lastname": fields.lastname,
                    "dob": fields.dob,
                    "phone": fields.phone
                };

                db.Insert("personalinfo", filter).then(function(results) {
                    res.json(true);
                }).catch(function(err) {
                    res.json(false);
                });
            } else {

                filter = { "_id": ObjectId(id) };

                db.findOne('personalinfo', filter).then(function(results) {
                    if (results._id != undefined) {
                        filter = { "_id": ObjectId(results._id) };

                        var updateQuery = {
                            "firstname": fields.firstname,
                            "lastname": fields.lastname,
                            "dob": fields.dob,
                            "phone": fields.phone
                        };

                        db.get().collection("personalinfo").update(filter, {
                            $set: updateQuery
                        }, { upsert: false }, (err, results) => {
                            if (err) {
                                res.json(false);
                            } else {
                                console.log("Personal details updated Successfully");
                                res.json(true);
                            }
                        });
                    }
                }).catch(function(err) {
                    res.json(false);
                });
            }
        });
    }
    return;
});

router.post('/updateprofdetails', function(req, res) {
    if (req.url == '/updateprofdetails') {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            var userid = fields.userid;
            var id = fields._id;
            var filter = "";

            if (userid != "" && id == "") {

                filter = {
                    "userid": userid,
                    "proffession": fields.proffession,
                    "department": fields.department,
                    "company": fields.company,
                    "locations": fields.locations
                };

                db.Insert("proffessionalinfo", filter).then(function(results) {
                    res.json(true);
                }).catch(function(err) {
                    res.json(false);
                });
            } else {

                filter = { "_id": ObjectId(id) };

                db.findOne('proffessionalinfo', filter).then(function(results) {
                    if (results._id != undefined) {
                        filter = { "_id": ObjectId(results._id) };

                        var updateQuery = {
                            "proffession": fields.proffession,
                            "department": fields.department,
                            "company": fields.company,
                            "locations": fields.locations
                        };

                        db.get().collection("proffessionalinfo").update(filter, {
                            $set: updateQuery
                        }, { upsert: false }, (err, results) => {
                            if (err) {
                                res.json(false);
                            } else {
                                console.log("proffessional details updated Successfully");
                                res.json(true);
                            }
                        });
                    }
                }).catch(function(err) {
                    res.json(false);
                });
            }
        });
    }
    return;
});

router.post('/updateedudetails', function(req, res) {
    if (req.url == '/updateedudetails') {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            var userid = fields.userid;
            var id = fields._id;
            var filter = "";

            if (userid != "" && id == "") {

                filter = {
                    "userid": userid,
                    "hqualification": fields.hqualification,
                    "university": fields.university,
                    "yearofpass": fields.yearofpass,
                    "place": fields.place
                };

                db.Insert("education", filter).then(function(results) {
                    res.json(true);
                }).catch(function(err) {
                    res.json(false);
                });
            } else {

                filter = { "_id": ObjectId(id) };

                db.findOne('education', filter).then(function(results) {
                    if (results._id != undefined) {
                        filter = { "_id": ObjectId(results._id) };

                        var updateQuery = {
                            "hqualification": fields.hqualification,
                            "university": fields.university,
                            "yearofpass": fields.yearofpass,
                            "place": fields.place
                        };

                        db.get().collection("education").update(filter, {
                            $set: updateQuery
                        }, { upsert: false }, (err, results) => {
                            if (err) {
                                res.json(false);
                            } else {
                                console.log("education details updated Successfully");
                                res.json(true);
                            }
                        });
                    }
                }).catch(function(err) {
                    res.json(false);
                });
            }
        });
    }
    return;
});

router.post('/updatecontactdetails', function(req, res) {
    if (req.url == '/updatecontactdetails') {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            var userid = fields.userid;
            var id = fields._id;
            var filter = "";

            if (userid != "" && id == "") {

                filter = {
                    "userid": userid,
                    "address1": fields.address1,
                    "address2": fields.address2,
                    "country": fields.country,
                    "pinno": fields.pinno
                };

                db.Insert("contactdetails", filter).then(function(results) {
                    res.json(true);
                }).catch(function(err) {
                    res.json(false);
                });
            } else {

                filter = { "_id": ObjectId(id) };

                db.findOne('contactdetails', filter).then(function(results) {
                    if (results._id != undefined) {
                        filter = { "_id": ObjectId(results._id) };

                        var updateQuery = {
                            "address1": fields.address1,
                            "address2": fields.address2,
                            "country": fields.country,
                            "pinno": fields.pinno
                        };

                        db.get().collection("contactdetails").update(filter, {
                            $set: updateQuery
                        }, { upsert: false }, (err, results) => {
                            if (err) {
                                res.json(false);
                            } else {
                                console.log("contact details updated Successfully");
                                res.json(true);
                            }
                        });
                    }
                }).catch(function(err) {
                    res.json(false);
                });
            }
        });
    }
    return;
});

router.post('/verifyemail', function(req, res) {
    if (req.url == '/verifyemail') {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            var userid = fields.hnduserid;
            var emailid = fields.hndemailid;

            var nodemailer = require('nodemailer');
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'nodegitapp@gmail.com',
                    pass: 'Node@123'
                }
            });

            var DT = new Date().toISOString();
            path = configparam.hosttype + "://" + configparam.domainname + "/verifiedemail?i=" +
                userid + "&ts=" + DT;

            var mailOptions = {
                from: 'nodegitapp@gmail.com',
                to: emailid,
                subject: 'Verify email id',
                text: "Please click here to verify email " + path
            };

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log("mail sent error: " + error);
                    res.json(false);
                } else {
                    console.log("mail sent success");

                    // Track email verification trigger in Database
                    var filter = { "userid": userid };

                    db.findOne('verifyemailtrigger', filter).then(function(results) {
                        if (results != undefined && results._id != undefined) {

                            filter = { "_id": ObjectId(results._id) };

                            var updateQuery = {
                                "dt": DT
                            };

                            db.get().collection("verifyemailtrigger").update(filter, {
                                $set: updateQuery
                            }, { upsert: false }, (err, results) => {
                                if (err) {
                                    res.json(false);
                                } else {
                                    console.log("details updated Successfully");
                                    res.json(true);
                                }
                            });
                        } else {
                            filter = {
                                "userid": userid,
                                "dt": DT
                            };

                            db.Insert("verifyemailtrigger", filter).then(function(results) {
                                res.json(true);
                            }).catch(function(err) {
                                res.json(false);
                            });
                        }
                    }).catch(function(e) {
                        res.json(false);
                    });
                }
            });
        });
    }
    return;
});

//View/Edit user details
router.post('/uploadphoto', function(req, res) {
    if (req.url == '/uploadphoto') {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            var user_id = fields._id;
            console.log("user_id " + user_id);

            var oldpath = files.displayImage.path;
            console.log("oldpath : " + oldpath);

            console.log(files.displayImage.name);
            var extn = getFileExtension(files.displayImage.name);
            console.log(extn);

            switch (extn) {
                case 'jpg':
                case 'jpeg':
                case 'png':
                case 'gif':
                    console.log("ok");
                    var ss = path.join('..', 'profilephoto', user_id.toString());

                    var uploadpath = path.join(__dirname, ss);
                    console.log("upload path " + uploadpath);

                    mkdirp(uploadpath, function(err) {
                        if (err) {
                            throw err;
                        } else {
                            var uploadedfilepath = path.join(uploadpath, user_id + ".jpg");

                            mv(oldpath, uploadedfilepath, function(err) {
                                if (err) {
                                    throw err;
                                }
                                console.log('file moved successfully. File Path : ' + uploadedfilepath);
                                res.json({ "filepath": "/" + user_id + "/" + user_id + ".jpg" });
                            });
                        }
                    });
                    return;
                default:
                    console.log("not ok");
                    res.json({ "error": "IFE" });
                    return;
            }

            //var dt = new Date();
            //console.log("dt " + dt);
            //var currentyear = (dt.getUTCFullYear()).toString();
            //var currentmonth = ("0" + (dt.getUTCMonth() + 1)).slice(-2);
            //var currentday = ("0" + (dt.getUTCDate())).slice(-2);
        });

        return;
    }
});

function getFileExtension(filename) {
    // Use a regular expression to trim everything before final dot
    var extension = filename.replace(/^.*\./, '');
    // Iff there is no dot anywhere in filename, we would have extension == filename,
    // so we account for this possibility now
    if (extension == filename) {
        extension = '';
    } else {
        // if there is an extension, we convert to lower case
        // (N.B. this conversion will not effect the value of the extension
        // on the file upload.)
        extension = extension.toLowerCase().trim();
    }
    return extension;
}