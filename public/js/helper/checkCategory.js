var blogs = require('../models/blogs');

module.exports = function(fieldvalue) {
    var category = blogs.category;
    if (fieldvalue == "" || fieldvalue == null)
        return "empty field " + fieldvalue;
}