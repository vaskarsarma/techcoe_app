$(function() {
    $(".profileprogress").imgProgress({
        // path to the image
        // path to the image
        //img_url: "sss.jpg",
        // size in pixels
        size: 200,
        // bar size
        barSize: 12,
        // background color
        backgroundColor: "white",
        // foreground color
        foregroundColor: "#4abde8",
        // CSS background-size property
        backgroundSize: "cover",
        // current percentage value
        percent: 10
    });

    $(".profileprogress").imgProgressTo(profileCompleteStatus());

    $("textarea")
        .each(function() {
            this.setAttribute(
                "style",
                "height:" + this.scrollHeight + "px;overflow-y:hidden;"
            );
        })
        .on("input", function() {
            this.style.height = "auto";
            this.style.height = this.scrollHeight + "px";
        });

    /* Code to upload profile image in the my profile page */
    $("#uploadform").submit(function(e) {
        e.preventDefault();

        var isValid = true;
        var errorPanel = $("<div></div>");
        var errorMessage = null;
        var filename = $("#displayImage").val();
        var extension = getFileExtension(filename);

        if (filename == "" || filename == undefined) {
            isValid = false;
            console.log("No file selected");
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please select an image file.")
            );
        } else {
            if (extension == "") {
                isValid = false;
                errorPanel.append(
                    ErrorMessage(
                        "<strong>Warning!</strong> Please select .jpg/.jpeg/.png/.gif file only."
                    )
                );
            }
        }

        var data = new FormData(this); // <-- 'this' is your form element

        if (isValid) {
            $(".ErrorPanel").html("");
            $.ajax({
                url: "/myprofile/uploadphoto",
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                type: "POST",
                success: function(data) {
                    console.log("success : " + JSON.stringify(data));
                    if (data.error == "IFE") {
                        console.log("invalid file extension");
                        $("#displayImage").val("");
                        errorPanel.append(
                            ErrorMessage(
                                "<strong>Warning!</strong> Please select .jpg/.jpeg/.png/.gif file only."
                            )
                        );
                        $(".ErrorPanel").html(errorPanel).removeClass("hidden");
                    } else {
                        $(".reloadimage").attr(
                            "src",
                            data.filepath + "?" + new Date().getTime()
                        );
                        $("#displayImage").val("");
                        $(".profileprogress").imgProgressTo(profileCompleteStatus());
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

    /* Code to update about me section in the my profile page */
    $("#frmaboutme").submit(function(e) {
        e.preventDefault();

        var isValid = true;
        var errorPanel = $("<div></div>");
        var errorMessage = null;
        var content = $("#aboutme").val();

        if (content == "" || content == undefined) {
            isValid = false;
            console.log("No data");
            errorPanel.append(
                ErrorMessage(
                    "<strong>Warning!</strong> Please add few lines about you."
                )
            );
        }

        var data = new FormData(this); // <-- 'this' is your form element

        if (isValid) {
            $(".AMErrorPanel").html("");
            $.ajax({
                url: "/myprofile/updateaboutme",
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                type: "POST",
                success: function(data) {
                    console.log("success : " + JSON.stringify(data));
                    $(".amerrorResult").addClass("hidden");
                    $(".amsuccessResult").removeClass("hidden");
                    $(".profileprogress").imgProgressTo(profileCompleteStatus());
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
    $("#frmpersonaldetails").submit(function(e) {
        e.preventDefault();

        var isValid = true;
        var errorPanel = $("<div></div>");
        var errorMessage = null;

        var firstname = $("#firstname").val();
        var lastname = $("#lastname").val();
        var phone = $("#phone").val();

        if (firstname == "" || firstname == undefined) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please add your First Name.")
            );
        }

        if (lastname == "" || lastname == undefined) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please add your last name.")
            );
        }

        var data = new FormData(this); // <-- 'this' is your form element

        if (isValid) {
            $(".pderrorPanel").html("");
            $.ajax({
                url: "/myprofile/updatepersonaldetails",
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                type: "POST",
                success: function(data) {
                    console.log("success : " + JSON.stringify(data));
                    $(".pderrorResult").addClass("hidden");
                    $(".pdsuccessResult").removeClass("hidden");
                    $(".profileprogress").imgProgressTo(profileCompleteStatus());
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
    $("#frmprofldetails").submit(function(e) {
        e.preventDefault();

        var isValid = true;
        var errorPanel = $("<div></div>");
        var errorMessage = null;

        var proffession = $("#proffession").val();
        var department = $("#department").val();
        var company = $("#company").val();

        if (proffession == "" || proffession == undefined) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please add your proffession.")
            );
        }

        if (company == "" || company == undefined) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please add your company.")
            );
        }

        var data = new FormData(this); // <-- 'this' is your form element

        if (isValid) {
            $(".profderrorPanel").html("");
            $.ajax({
                url: "/myprofile/updateprofdetails",
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                type: "POST",
                success: function(data) {
                    console.log("success : " + JSON.stringify(data));
                    $(".profderrorResult").addClass("hidden");
                    $(".profdsuccessResult").removeClass("hidden");
                    $(".profileprogress").imgProgressTo(profileCompleteStatus());
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
    $("#frmeducation").submit(function(e) {
        e.preventDefault();

        var isValid = true;
        var errorPanel = $("<div></div>");
        var errorMessage = null;

        var hqualification = $("#hqualification").val();
        var university = $("#university").val();
        var yearofpass = $("#yearofpass").val();
        var place = $("#place").val();

        if (hqualification == "" || hqualification == undefined) {
            isValid = false;
            errorPanel.append(
                ErrorMessage(
                    "<strong>Warning!</strong> Please add your highest qualification."
                )
            );
        }

        if (university == "" || university == undefined) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please add your university.")
            );
        }

        var data = new FormData(this); // <-- 'this' is your form element

        if (isValid) {
            $(".eduerrorPanel").html("");
            $.ajax({
                url: "/myprofile/updateedudetails",
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                type: "POST",
                success: function(data) {
                    console.log("success : " + JSON.stringify(data));
                    $(".eduerrorResult").addClass("hidden");
                    $(".edusuccessResult").removeClass("hidden");
                    $(".profileprogress").imgProgressTo(profileCompleteStatus());
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
    $("#frmcontactdetails").submit(function(e) {
        e.preventDefault();

        var isValid = true;
        var errorPanel = $("<div></div>");
        var errorMessage = null;

        var address1 = $("#address1").val();
        var country = $("#country").val();
        var pinno = $("#pinno").val();
        var address2 = $("#address2").val();

        if (address1 == "" || address1 == undefined) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please add your address.")
            );
        }

        if (country == "" || country == undefined) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please add country.")
            );
        }

        var data = new FormData(this); // <-- 'this' is your form element

        if (isValid) {
            $(".cderrorPanel").html("");
            $.ajax({
                url: "/myprofile/updatecontactdetails",
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                type: "POST",
                success: function(data) {
                    console.log("success : " + JSON.stringify(data));
                    $(".cdsuccessResult").removeClass("hidden");
                    $(".cderrorResult").addClass("hidden");
                    $(".profileprogress").imgProgressTo(profileCompleteStatus());
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

    /* Code toverify email id in the my profile page */
    $("#frmemailverification").submit(function(e) {
        e.preventDefault();

        var data = new FormData(this); // <-- 'this' is your form element

        $.ajax({
            url: "/myprofile/verifyemail",
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            type: "POST",
            success: function(data) {
                console.log("success : " + JSON.stringify(data));
                $(".vemailsuccessResult").removeClass("hidden");
                $(".vemailerrorResult").addClass("hidden");
            },
            error: function(error) {
                console.log("error : " + error);
                $(".vemailsuccessResult").addClass("hidden");
                $(".vemailerrorResult").removeClass("hidden");
            }
        });

    });
});

var substringMatcher = function(strs) {
    return function findMatches(q, cb) {
        var matches, substringRegex;

        // an array that will be populated with substring matches
        matches = [];

        // regex used to determine if a string contains the substring `q`
        substrRegex = new RegExp(q, "i");

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

let profileCompleteStatus = () => {
    var totalFields = 20;
    var percentagePerFields = 100 / 20;

    var i = 0;
    i = checkControlContent("_id", i, true);
    i = checkControlContent("aboutme", i, false);
    i = checkControlContent("firstname", i, false);
    i = checkControlContent("lastname", i, false);
    i = checkControlContent("dob", i, false);
    i = checkControlContent("phone", i, false);
    i = checkControlContent("proffession", i, false);
    i = checkControlContent("department", i, false);
    i = checkControlContent("company", i, false);
    i = checkControlContent("locations", i, false);
    i = checkControlContent("hqualification", i, false);
    i = checkControlContent("university", i, false);
    i = checkControlContent("yearofpass", i, false);
    i = checkControlContent("place", i, false);
    i = checkControlContent("address1", i, false);
    i = checkControlContent("address2", i, false);
    i = checkControlContent("country", i, false);
    i = checkControlContent("pinno", i, false);

    var totalpercentage = percentagePerFields * i;

    $(".profileCompleted").html("");
    $(".profileCompleted").append(
        "<strong>" + totalpercentage + "% completed</strong>"
    );

    return totalpercentage;
};

let checkControlContent = (control_id, i, isImage) => {
    var ctrlVal = $("#" + control_id).val();

    if (isImage && ctrlVal !== "" && ctrlVal !== undefined) {
        var imgPath = ("/" + ctrlVal + "/" + ctrlVal + ".jpg").toLowerCase();
        var imgSRC = $(".reloadimage").attr("src").toLowerCase();


        if (imgSRC.indexOf('?') != -1)
            imgSRC = imgSRC.substring(0, imgSRC.indexOf('?'));

        if (imgPath == imgSRC)
            return i + 3;
        else
            return i;

    } else if (ctrlVal !== "" && ctrlVal !== undefined) return i + 1;
    else return i;
};