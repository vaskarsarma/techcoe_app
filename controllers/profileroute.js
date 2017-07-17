var express = require("express");
var router = express.Router();
module.exports = router;
var formidable = require('formidable');
var path = require("path");
var fs = require("fs");

//View/Edit user details
router.get('/:_id', function(req, res) {
    var id = req.params._id;
    res.render("myprofile", { layout: 'layout', title: 'My Profile Page' });
});

//View/Edit user details
router.post('/uploadphoto', function(req, res) {
    // //console.log("displayImage" + req.body.displayImage);
    // //res.render("myprofile", { layout: 'layout', title: 'My Profile Page', image: req.files.displayImage.path });
    // if (req.url == '/uploadphoto') {
    //     var form = new formidable.IncomingForm();
    //     form.parse(req, function(err, fields, files) {
    //         var oldpath = files.displayImage.path;
    //         console.log("oldpath : " + oldpath);
    //         var newpath = path.join(__dirname, 'profilephoto') + '/' + files.displayImage.name;
    //         console.log("newpath : " + newpath);

    //         fs.rename(oldpath, newpath, function(err) {
    //             if (err) throw err;
    //             res.write('File uploaded and moved!');
    //             res.end();
    //         });
    //     });
    // }

    // res.send("data");
});