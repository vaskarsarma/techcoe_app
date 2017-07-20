$(function() {

    var categoryJSON = [{ "key": "0", "name": "Technical Blog" }, { "key": "1", "name": "Beginner Blog" },
        { "key": "2", "name": "Beginner Blog 1" }, { "key": "3", "name": "Beginner Blog 2" }
    ];

    $(".cancel").click(function() {
        var cancel = confirm("Are you sure you want to cancel?");
        if (cancel == true) {
            history.back(1);
        }
    });

    $(".subscribe").click(function() {
        //.log("subscribe click");

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

        if (
            $("#emailSubscribe").val() == "" ||
            $("#emailSubscribe").val() == undefined
        ) {
            isValid = false;
            console.log("error in name");
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please enter email.")
            );
        } else if (!validateEmail($("#emailSubscribe").val())) {
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
                    //  console.log("data : " + data);
                    $(".subscribeBlock").addClass("hidden");
                    $(".successResult").removeClass("hidden");
                },
                error: function(err) {
                    // console.log("err : " + err);
                    $(".subscribeBlock").addClass("hidden");
                    $(".errorResult").removeClass("hidden");
                }
            });
        } else {
            // console.log("errorPanel: " + errorPanel);
            $(".ErrorPanel").html(errorPanel).removeClass("hidden");
        }
    });

    let validateCategory = (categoryJSON, match) => {
        var node = null;
        $.each(categoryJSON, function(i, data) {
            if (data["key"] === match) {
                node = data["name"];
            }
        });
        return node;
    };

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

    let GetTradingBlogs = (results) => {
        var list = $("<ul class='dashboard-stat-list blogTrend'></ul>");
        var node = null;
        $.each(results, function(i, item) {
            //console.log(item["categorykey"]);
            // console.log(validateCategory(categoryJSON, item["categorykey"]));
            node = "<li>" + validateCategory(categoryJSON, item["categorykey"]) +
                "<span class='pull-right'><i class='material-icons'>trending_up</i>" +
                item["total"] + "</span></li>";
            list.append(node);
            // console.log("node:" + node);
        });
        //  console.log("list:" + list.html());
        return list.html();
    };

    let GetDashboardBlogsInfo = (results) => {
        var list = $("<ul class='dashboard-stat-list validateTickets'></ul>");
        var node = null;
        $.each(results, function(i, item) {
            //console.log(item["categorykey"]);
            // console.log(validateCategory(categoryJSON, item["categorykey"]));
            node = "<li>" + item["text"] +
                "<span class='pull-right'><b>" + item["total"] + "</b>" +
                "<small>TICKETS</small></li>";
            list.append(node);
            // console.log("node:" + node);
        });
        console.log("GetDashboardBlogsInfo list:" + list.html());
        return list.html();
    };

    $.getJSON("/authorizedAPI/data/GetTradingBlogs").done(function(data) {
        if (data != null) {
            // console.log("common data:" + JSON.stringify(data));
            data = alasql('SELECT categorykey , count(*) as total FROM ? GROUP BY categorykey', [data]);
            // console.log("filtered data:" + JSON.stringify(data));
            //  console.log(GetTradingBlogs(data));
            // var test = GetTradingBlogs(data);
            //  console.log("test:" + test);
            $(".blogTrend").append(GetTradingBlogs(data));
        }
    }).fail(function(jqxhr, textStatus, error) {
        var err = textStatus + ", " + error;
    });

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

    $.getJSON("/authorizedAPI/data/DashboardBlogsInfo").done(function(data) {
        if (data != null) {
            console.log("DashboardBlogsInfo data:" + JSON.stringify(data));
            var collection = [];
            console.log(alasql("SELECT count(*) as total , 'Total comments' as text FROM ?", [data]));
            collection.push(alasql("SELECT count(*) as total , 'Total comments' as text FROM ?", [data])[0]);
            collection.push(alasql("SELECT count(*) as total, 'Total approved' as text FROM ? where IsApproved=true", [data])[0]);
            collection.push(alasql("SELECT count(*) as total, 'Total disapproved' as text FROM ? where IsApproved=false", [data])[0]);
            console.log("DashboardBlogsInfo query data:" + JSON.stringify(collection));
            //  console.log(GetTradingBlogs(data));
            // var test = GetTradingBlogs(data);
            //  console.log("test:" + test);
            $(".validateTickets").append(GetDashboardBlogsInfo(collection));
        }
    })

});