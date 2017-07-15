$(function() {
    $(".cancel").click(function() {
        var cancel = confirm("Are you sure you want to cancel?");
        if (cancel == true) {
            history.back(1);
        }
    });

    $(".subscribe").click(function() {
        console.log("subscribe click");

        var isValid = true;
        var errorPanel = $("<div></div>");
        var errorMessage = null;

        if (
            $("#nameSubscribe").val() == "" ||
            $("#nameSubscribe").val() == undefined
        ) {
            isValid = false;
            console.log("error in name");
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please enter name.")
            );
        } else if (!validateName($("#nameSubscribe").val())) {
            isValid = false;
            console.log("error in name");
            errorPanel.append(
                ErrorMessage(" <strong>Warning!</strong> Please enter valid Name.")
            );
        }

        if (!validateEmail($("#emailSubscribe").val())) {
            isValid = false;
            console.log("error in email");
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please enter valid email.")
            );
        }

        if (isValid) {
            $(".ErrorPanel").html("");
            console.log("hi");
            $.ajax({
                url: "http://localhost:1337/subscribe",
                type: "GET",
                data: 'emailID="' +
                    $("#emailSubscribe").val() +
                    '"&name="' +
                    $("#nameSubscribe").val(),
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

    $.getJSON("/commonapi/data/countries").done(function(data) {
        var result = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: data
        });
        $("#bloodhound .typeahead").typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        }, {
            name: 'states',
            source: result
        });

    }).fail(function(jqxhr, textStatus, error) {
        var err = textStatus + ", " + error;
    });

    /* Code to upload profile photo */
    $('#uploadform').submit(function(e) {
        e.preventDefault();

        var isValid = true;
        var errorPanel = $("<div></div>");
        var errorMessage = null;
        var filename = $("#displayImage").val();
        var extension = getFileExtension(filename);

        if (filename == "" ||
            filename == undefined
        ) {
            isValid = false;
            console.log("No file selected");
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please select an image file.")
            );
        } else {
            if (extension == '') {
                isValid = false;
                errorPanel.append(
                    ErrorMessage("<strong>Warning!</strong> Please select .jpg/.jpeg/.png/.gif file only.")
                );
                // } else {
                //     if (extension != 'jpg') {
                //         console.log("file name " + filename);
                //         console.log("extesion  " + extension);
                //         isValid = false;
                //         errorPanel.append(
                //             ErrorMessage("<strong>Warning!</strong> Please select .jpg/.jpeg/.png/.gif file only.")
                //         );
                //     } else if (extension != 'jpeg') {
                //         isValid = false;
                //         errorPanel.append(
                //             ErrorMessage("<strong>Warning!</strong> Please select .jpg/.jpeg/.png/.gif file only.")
                //         );
                //     } else if (extension != 'png') {
                //         isValid = false;
                //         errorPanel.append(
                //             ErrorMessage("<strong>Warning!</strong> Please select .jpg/.jpeg/.png/.gif file only.")
                //         );
                //     } else if (extension != 'gif') {
                //         isValid = false;
                //         errorPanel.append(
                //             ErrorMessage("<strong>Warning!</strong> Please select .jpg/.jpeg/.png/.gif file only.")
                //         );
                //     } else {
                //         isValid = false;
                //         errorPanel.append(
                //             ErrorMessage("<strong>Warning!</strong> Please select .jpg/.jpeg/.png/.gif file only.")
                //         );
                //     }
            }
        }

        var data = new FormData(this); // <-- 'this' is your form element

        if (isValid) {
            $(".ErrorPanel").html("");
            $.ajax({
                url: '/myprofile/uploadphoto',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function(data) {
                    console.log("success : " + JSON.stringify(data));
                    if (data.error == "IFE") {
                        console.log("invalid file extension");
                        $("#displayImage").val("");
                        errorPanel.append(
                            ErrorMessage("<strong>Warning!</strong> Please select .jpg/.jpeg/.png/.gif file only.")
                        );
                        $(".ErrorPanel").html(errorPanel).removeClass("hidden");
                    } else {
                        $('.reloadimage').attr('src', data.filepath + '?' + new Date().getTime());
                        $("#displayImage").val("");
                    }
                },
                error: function(error) {
                    console.log("error : " + error);
                }
            });
        } else {
            $(".ErrorPanel").html(errorPanel).removeClass("hidden");
        }
    });

    function getFileExtension(filename) {
        // Use a regular expression to trim everything before final dot
        var extension = filename.replace(/^.*\./, '');
        // Iff there is no dot anywhere in filename, we would have extension == filename,
        // so we account for this possibility now
        if (extension == filename) {
            extension = '';
        } else {
            // if there is an extension, we convert to lower case
            // (N.B. this conversion will not effect the value of the extension
            // on the file upload.)
            extension = extension.toLowerCase().trim();
        }

        return extension;
    }
});