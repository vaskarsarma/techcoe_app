var express = require("express");
var router = express.Router();
module.exports = router;

//View/Edit user details
router.get('/:_id', function(req, res) {
    var id = req.params._id;
    res.render("myprofile", { layout: 'layout', title: 'My Profile Page' });
});