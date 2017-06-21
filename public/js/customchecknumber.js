module.exports = function (fieldvalue) {
    if (fieldvalue != "" || fieldvalue != null) {
        //fieldvalue=parseInt(fieldvalue);
        if (isNaN(fieldvalue))
            return ("Please enter a number " + fieldvalue);
    }
}