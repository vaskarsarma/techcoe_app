$(function() {

    $('textarea').each(function() {
        this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
    }).on('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

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
        var engine = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            // `states` is an array of state names defined in "The Basics"
            local: $.map(data, function(state) { return { value: state }; })
        });

        // kicks off the loading/processing of `local` and `prefetch`
        engine.initialize();

        $('#bloodhound .typeahead').typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        }, {
            name: 'states',
            displayKey: 'value',
            // `ttAdapter` wraps the suggestion engine in an adapter that
            // is compatible with the typeahead jQuery plugin
            source: engine.ttAdapter()
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

    $.getJSON("/authorizedAPI/data/validateTickets").done(function(data) {
        if (data != null) {
            // console.log("common data:" + JSON.stringify(data));
            //   data = alasql('SELECT categorykey , count(*) as total FROM ? GROUP BY categorykey', [data]);
            // console.log("filtered data:" + JSON.stringify(data));
            //  console.log(GetTradingBlogs(data));
            // var test = GetTradingBlogs(data);
            //  console.log("test:" + test);
            //   $(".blogTrend").append(GetTradingBlogs(data));
        }
    })

    var substringMatcher = function(strs) {
        return function findMatches(q, cb) {
            var matches, substringRegex;

            // an array that will be populated with substring matches
            matches = [];

            // regex used to determine if a string contains the substring `q`
            substrRegex = new RegExp(q, 'i');

            // iterate through the pool of strings and for any string that
            // contains the substring `q`, add it to the `matches` array
            $.each(strs, function(i, str) {
                if (substrRegex.test(str)) {
                    matches.push(str);
                }
            });

            cb(matches);
        };
    };

    /* Code to update about me section in the my profile page */
    $('#frmaboutme').submit(function(e) {
        e.preventDefault();

        var isValid = true;
        var errorPanel = $("<div></div>");
        var errorMessage = null;
        var content = $("#aboutme").val();

        if (content == "" ||
            content == undefined
        ) {
            isValid = false;
            console.log("No data");
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please add few lines about you.")
            );
        }

        var data = new FormData(this); // <-- 'this' is your form element

        if (isValid) {
            $(".AMErrorPanel").html("");
            $.ajax({
                url: '/myprofile/updateaboutme',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function(data) {
                    console.log("success : " + JSON.stringify(data));
                    $(".amerrorResult").addClass("hidden");
                    $(".amsuccessResult").removeClass("hidden");
                },
                error: function(error) {
                    console.log("error : " + error);
                    $(".amsuccessResult").addClass("hidden");
                    $(".amerrorResult").removeClass("hidden");
                }
            });
        } else {
            $(".AMErrorPanel").html(errorPanel).removeClass("hidden");
        }
    });

    /* Code to update personal details in the my profile page */
    $('#frmpersonaldetails').submit(function(e) {
        e.preventDefault();

        var isValid = true;
        var errorPanel = $("<div></div>");
        var errorMessage = null;

        var firstname = $("#firstname").val();
        var lastname = $("#lastname").val();
        var phone = $("#phone").val();

        if (firstname == "" ||
            firstname == undefined
        ) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please add your First Name.")
            );
        }

        if (lastname == "" ||
            lastname == undefined
        ) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please add your last name.")
            );
        }

        var data = new FormData(this); // <-- 'this' is your form element

        if (isValid) {
            $(".pderrorPanel").html("");
            $.ajax({
                url: '/myprofile/updatepersonaldetails',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function(data) {
                    console.log("success : " + JSON.stringify(data));
                    $(".pderrorResult").addClass("hidden");
                    $(".pdsuccessResult").removeClass("hidden");
                },
                error: function(error) {
                    console.log("error : " + error);
                    $(".pdsuccessResult").addClass("hidden");
                    $(".pderrorResult").removeClass("hidden");
                }
            });
        } else {
            $(".pderrorPanel").html(errorPanel).removeClass("hidden");
        }
    });

    /* Code to update proffessioanl details in the my profile page */
    $('#frmprofldetails').submit(function(e) {
        e.preventDefault();

        var isValid = true;
        var errorPanel = $("<div></div>");
        var errorMessage = null;

        var proffession = $("#proffession").val();
        var department = $("#department").val();
        var company = $("#company").val();
        var location = $("#locations").val();

        if (proffession == "" ||
            proffession == undefined
        ) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please add your proffession.")
            );
        }

        if (department == "" ||
            department == undefined
        ) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please add your department.")
            );
        }

        if (company == "" ||
            company == undefined
        ) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please add your company.")
            );
        }

        if (location == "" ||
            location == undefined
        ) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please add your location.")
            );
        }

        var data = new FormData(this); // <-- 'this' is your form element

        if (isValid) {
            $(".profderrorPanel").html("");
            $.ajax({
                url: '/myprofile/updateprofdetails',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function(data) {
                    console.log("success : " + JSON.stringify(data));
                    $(".profderrorResult").addClass("hidden");
                    $(".profdsuccessResult").removeClass("hidden");
                },
                error: function(error) {
                    console.log("error : " + error);
                    $(".profdsuccessResult").addClass("hidden");
                    $(".profderrorResult").removeClass("hidden");
                }
            });
        } else {
            $(".profderrorPanel").html(errorPanel).removeClass("hidden");
        }
    });

    /* Code to update education details in the my profile page */
    $('#frmeducation').submit(function(e) {
        e.preventDefault();

        var isValid = true;
        var errorPanel = $("<div></div>");
        var errorMessage = null;

        var hqualification = $("#hqualification").val();
        var university = $("#university").val();
        var yearofpass = $("#yearofpass").val();
        var place = $("#place").val();

        if (hqualification == "" ||
            hqualification == undefined
        ) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please add your highest qualification.")
            );
        }

        if (university == "" ||
            university == undefined
        ) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please add your university.")
            );
        }

        var data = new FormData(this); // <-- 'this' is your form element

        if (isValid) {
            $(".eduerrorPanel").html("");
            $.ajax({
                url: '/myprofile/updateedudetails',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function(data) {
                    console.log("success : " + JSON.stringify(data));
                    $(".eduerrorResult").addClass("hidden");
                    $(".edusuccessResult").removeClass("hidden");
                },
                error: function(error) {
                    console.log("error : " + error);
                    $(".edusuccessResult").addClass("hidden");
                    $(".eduerrorResult").removeClass("hidden");
                }
            });
        } else {
            $(".eduerrorPanel").html(errorPanel).removeClass("hidden");
        }
    });

    /* Code to update contact details in the my profile page */
    $('#frmcontactdetails').submit(function(e) {
        e.preventDefault();

        var isValid = true;
        var errorPanel = $("<div></div>");
        var errorMessage = null;

        var address1 = $("#address1").val();
        var country = $("#country").val();
        var pinno = $("#pinno").val();
        var address2 = $("#address2").val();

        if (address1 == "" ||
            address1 == undefined
        ) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please add your address.")
            );
        }

        if (country == "" ||
            country == undefined
        ) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please add country.")
            );
        }

        if (pinno == "" ||
            pinno == undefined
        ) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please add pin number.")
            );
        }

        var data = new FormData(this); // <-- 'this' is your form element

        if (isValid) {
            $(".cderrorPanel").html("");
            $.ajax({
                url: '/myprofile/updatecontactdetails',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function(data) {
                    console.log("success : " + JSON.stringify(data));
                    $(".cdsuccessResult").removeClass("hidden");
                    $(".cderrorResult").addClass("hidden");
                },
                error: function(error) {
                    console.log("error : " + error);
                    $(".cdsuccessResult").addClass("hidden");
                    $(".cderrorResult").removeClass("hidden");
                }
            });
        } else {
            $(".cderrorPanel").html(errorPanel).removeClass("hidden");
        }
    });
});