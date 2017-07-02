var express = require("express");
var router = express.Router();
var nodemailer = require('nodemailer');

module.exports = router;

router.get("/userregistration", function (req, res) {
  console.log("userregistration");
  res.render('userregistration'); 
}); 


router.post("/userregistration", function (req, res,next) {

var name=req.body.name;
var email=req.body.email;
var password=req.body.password;
var password2=req.body.password2;

req.checkBody('name','Name field is required').notEmpty();
req.checkBody('email','email field is required').notEmpty();
req.checkBody('email','email is not valid').isEmail();
req.checkBody('password','password field is required').notEmpty();
req.checkBody('password2','password2 field is required').notEmpty();
req.checkBody('password2','password didnot match' ).equals(req.body.password);

var errors =req.validationErrors();
if(errors)
{
  console.log("errors");
  res.render('userregistration',{
      errors:errors,
      name:name,
      email:email,      
      password:password,
      password2:password2
  });
}
else{
  console.log("home");
 res.redirect('/home');
}
//var name=req.body.name;
  ///console.log("ankit1");
  
});