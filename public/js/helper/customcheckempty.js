module.exports = function (fieldvalue) {
    if (fieldvalue == "" || fieldvalue == null)
        return "empty field " + fieldvalue;
}