var express = require("express");
var router = express.Router();
module.exports = router;

var blogs = require('../models/blogs');

//Get Home Page
router.get('/home', function(req, res) {

    categoryList = blogs.category;
    blogs.blogs(function(err, results) {
        if (err) {
            res.status(500).send();
        } else {
            if (results.length == 0) {
                results = { count: 0 };
                res.render('home', { layout: 'layout', title: 'Home Page', category: categoryList, blogs: results });
            } else {
                res.render('home', { layout: 'layout', title: 'Home Page', category: categoryList, blogs: results });
            }
        }
    });
    //res.render('home', { layout: 'layout', title: 'Home Page' });
});