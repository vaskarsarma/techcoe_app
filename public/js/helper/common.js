$(function() {
    $('.cancel').click(function() {
        var cancel = confirm("Are you sure you want to cancel?")
        if (cancel == true) {
            history.back(1);
        }
    });

    $('.subscribe').click(function() {
        console.log("subscribe click");

        var isValid = true;
        var errorPanel = $("<div></div>");
        var errorMessage = null;

        if ($("#nameSubscribe").val() == "" || $("#nameSubscribe").val() == undefined) {
            isValid = false;
            console.log("error in name");
            errorPanel.append(ErrorMessage("<strong>Warning!</strong> Please enter name."));
        } else if (!validateName($("#nameSubscribe").val())) {
            isValid = false;
            console.log("error in name");
            errorPanel.append(ErrorMessage(" <strong>Warning!</strong> Please enter valid Name."));
        }

        if (!validateEmail($("#emailSubscribe").val())) {
            isValid = false;
            console.log("error in email");
            errorPanel.append(ErrorMessage("<strong>Warning!</strong> Please enter valid email."));
        }

        if (isValid) {
            $(".ErrorPanel").html('');
            console.log("hi");
            $.ajax({
                url: 'http://localhost:1337/subscribe',
                type: 'GET',
                data: 'emailID="' + $("#emailSubscribe").val() + '"&name="' + $("#nameSubscribe").val(),
                success: function(data) {
                    console.log("data : " + data);
                    $(".subscribeBlock").addClass("hidden");
                    $(".successResult").removeClass("hidden");
                },
                error: function(err) {
                    console.log("err : " + err);
                    $(".subscribeBlock").addClass("hidden");
                    $(".errorResult").removeClass("hidden");
                }
            });
        } else {
            // console.log("errorPanel: " + errorPanel);
            $(".ErrorPanel").html(errorPanel).removeClass("hidden");
        }
    });

    function validateEmail($email) {
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailReg.test($email);
    }

    function validateName($name) {
        var NameReg = /^[a-zA-Z\s]+$/;
        return NameReg.test($name);
    }

    function ErrorMessage($message) {
        return $("<div class='alert alert-warning'></div>").append($message);

    }
});