var express = require("express");
var router = express.Router();
module.exports = router;

router.get("/data/countries", function(req, res) {
    res.json(require("../data/countries.json"));
});