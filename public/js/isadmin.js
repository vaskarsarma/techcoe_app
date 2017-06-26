module.exports = function(fieldvalue) {
    if (fieldvalue != undefined || fieldvalue == "yes") {
        return '<li class="dropdown">' +
            '<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">User <span class="caret"></span></a>' +
            '<ul class="dropdown-menu" role="menu">' +
            '<li><a href="/admin/add">Add</a></li>' +
            '<li class="divider"></li>' +
            '<li><a href="/admin/list">Show</a></li>' +
            '</ul></li>' +
            '<li><a href="#">Dashboard</a></li>'
    }
}