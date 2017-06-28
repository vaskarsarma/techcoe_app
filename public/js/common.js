$(function() {
    $("#salutation").selectmenu;

    $('.cancel').click(function() {
        var cancel = confirm("Are you sure you want to cancel?")
        if (cancel == true) {
            history.back(1);
        }
    });
});