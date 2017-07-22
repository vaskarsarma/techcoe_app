$(function() {

    var categoryJSON = [{ "key": "0", "name": "Technical Blog" }, { "key": "1", "name": "Beginner Blog" },
        { "key": "2", "name": "Beginner Blog 1" }, { "key": "3", "name": "Beginner Blog 2" }
    ];

    var userInfoColor = [{ "key": "totalUser", "color": "bg-green" }, { "key": "adminUser", "color": "bg-blue" },
        { "key": "activeUser", "color": "bg-light-blue" }, { "key": "deactiveUser", "color": "bg-red" }, { "key": "emailVeriPending", "color": "bg-orange" }
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

    let validateCategory = (categoryJSON, match) => {
        var node = null;
        $.each(categoryJSON, function(i, data) {
            if (data["key"] === match) {
                node = data["name"];
            }
        });
        return node;
    };

    let validateUserInfoColor = (userInfoColor, match) => {
        var node = null;
        $.each(userInfoColor, function(i, data) {
            if (data["key"] === match) {
                node = data["color"];
            }
        });
        return node;
    };

    let calculatePercentage = (val, total) => {
        //  var test = ((val * 100) / total).toFixed(0);
        //debugger;
        return ((val * 100) / total).toFixed(0);
    };

    let validateEmail = ($email) => {
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailReg.test($email);
    };

    let validateName = ($name) => {
        var NameReg = /^[a-zA-Z\s]+$/;
        return NameReg.test($name);
    };

    let ErrorMessage = ($message) => {
        return $("<div class='alert alert-warning'></div>").append($message);
    };

    let getFileExtension = (filename) => {
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
    };

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
        // console.log("GetDashboardBlogsInfo list:" + list.html());
        return list.html();
    };

    let GetDashboardUserInfo = (results) => {
        var list = $("<tbody class='userInfo'></tbody>");
        var node = null;
        var count = 0;
        var totalUser = 0;
        $.each(results, function(i, item) {
            count++;
            //  var totalUser = 0;
            totalUser = count == 1 ? item["total"] : totalUser;
            var percentage = calculatePercentage(item["total"], totalUser);
            var UserInfoColor = validateUserInfoColor(userInfoColor, item["key"]);
            node = "<tr>" +
                "<td>" + count + "</td>" +
                "<td><span class='label " + UserInfoColor + "'>" + item["text"] + "</span></td>" +
                "<td>" + item["total"] + "</td>" +
                "<td>" + percentage + "%</td>" +
                "<td><div class='progress'><div class='progress-bar " + UserInfoColor +
                "' style='width: " + percentage + "%'></div></div></td></tr>";
            list.append(node);
        });
        //  console.log("list:" + list.html());
        return list.html();
    };

    let CreateUserGraph = (results) => {

        var collection = [];
        collection.push(results);
        console.log("text:" + collection);
        console.log("text1:" + JSON.stringify(collection));
        Highcharts.chart('container', {

            title: {
                text: 'Users growth by day, 2016-2017'
            },

            // subtitle: {
            //     text: 'Source: thesolarfoundation.com'
            // },

            yAxis: {
                title: {
                    text: 'Number of Users'
                }
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    day: "%e. %b",
                    month: "%b '%y",
                    year: "%Y"
                }
            },
            legend: {
                // layout: 'vertical',
                // align: 'right',
                // verticalAlign: 'middle'
                backgroundColor: '#FCFFC5'
            },
            plotOptions: {
                series: {
                    pointStart: 0
                }
            },
            series: collection
        });
    };

    let CreateGraphCollection = (results) => {
        var collection = [];
        var collectionList = {};
        var collectionName = "";
        if (results != null && results[0] != null) {
            $.each(results[0], function(i, data) {
                collectionName = data["text"];
                var d = new Date(data["dateTime"]);
                var utcDate = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
                //"Date.UTC(" + d.getUTCFullYear() + "," + d.getUTCMonth() + "," + d.getUTCDate() + ")";
                var data = [utcDate, data["total"]];
                collection.push(data);
            });
            collectionList = { "name": collectionName, "data": collection };
            //console.log(JSON.stringify(collectionList));
            return collectionList;
        }
    };
    $.getJSON("/authorizedAPI/data/DashboardUserGraphInfo").done(function(data) {
            if (data != null) {
                // console.log("DashboardUserGraphInfo data:" + JSON.stringify(data));
                var collection = [];
                //  console.log(alasql("SELECT count(*) as total , 'Total comments' as text FROM ?", [data]));
                collection.push(alasql("SELECT count(*) as total, dateTime, 'Logged in user' as text FROM ? GROUP BY dateTime", [data]));
                // collection.push(alasql("SELECT count(*) as total, FROM ? where admin=true", [data])[0]);
                // collection.push(alasql("SELECT count(*) as total, 'Active' as text ,'activeUser' as key FROM ? where active=true", [data])[0]);
                // collection.push(alasql("SELECT count(*) as total, 'Deactive' as text ,'deactiveUser' as key FROM ? where active=false", [data])[0]);
                // collection.push(alasql("SELECT count(*) as total, 'Email' as text ,'emailVeriPending' as key FROM ? where IsEmailVerified=false", [data])[0]);

                var collectionList = CreateGraphCollection(collection);
                // console.log("Graph collection:" + JSON.stringify(collectionList));
                CreateUserGraph(collectionList);
            }
        })
        .fail(function(jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
        });

    $.getJSON("/userGraph.json").done(function(data) {
            if (data != null) {
                //CreateUserGraph(data);
                // console.log("JSON success data:" + JSON.stringify(data));
            }
        })
        .fail(function(jqxhr, textStatus, error) {
            console.log("json error");
        });

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
        })
        .fail(function(jqxhr, textStatus, error) {
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

        })
        .fail(function(jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
        });



    $.getJSON("/authorizedAPI/data/DashboardBlogsInfo").done(function(data) {
            if (data != null) {
                // console.log("DashboardBlogsInfo data:" + JSON.stringify(data));
                var collection = [];
                console.log(alasql("SELECT count(*) as total , 'Total comments' as text FROM ?", [data]));
                collection.push(alasql("SELECT count(*) as total , 'Total comments' as text FROM ?", [data])[0]);
                collection.push(alasql("SELECT count(*) as total, 'Total approved' as text FROM ? where IsApproved=true", [data])[0]);
                collection.push(alasql("SELECT count(*) as total, 'Total disapproved' as text FROM ? where IsApproved=false", [data])[0]);
                $(".validateTickets").append(GetDashboardBlogsInfo(collection));
            }
        })
        .fail(function(jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
        });

    $.getJSON("/authorizedAPI/data/DashboardUserInfo").done(function(data) {
            if (data != null) {
                // console.log("DashboardUserInfo data:" + JSON.stringify(data));
                var collection = [];
                // console.log(alasql("SELECT count(*) as total , 'Total comments' as text FROM ?", [data]));
                collection.push(alasql("SELECT count(*) as total, 'Total' as text,'totalUser' as key FROM ?", [data])[0]);
                collection.push(alasql("SELECT count(*) as total, 'Admin' as text ,'adminUser' as key FROM ? where admin=true", [data])[0]);
                collection.push(alasql("SELECT count(*) as total, 'Active' as text ,'activeUser' as key FROM ? where active=true", [data])[0]);
                collection.push(alasql("SELECT count(*) as total, 'Deactive' as text ,'deactiveUser' as key FROM ? where active=false", [data])[0]);
                collection.push(alasql("SELECT count(*) as total, 'Email' as text ,'emailVeriPending' as key FROM ? where IsEmailVerified=false", [data])[0]);
                $(".userInfo").append(GetDashboardUserInfo(collection));
            }
        })
        .fail(function(jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
        });

    // Highcharts.chart('container', {

    //     title: {
    //         text: 'Solar Employment Growth by Sector, 2010-2016'
    //     },

    //     subtitle: {
    //         text: 'Source: thesolarfoundation.com'
    //     },

    //     yAxis: {
    //         title: {
    //             text: 'Number of Employees'
    //         }
    //     },
    //     legend: {
    //         // layout: 'vertical',
    //         // align: 'right',
    //         // verticalAlign: 'middle'
    //         backgroundColor: '#FCFFC5'
    //     },

    //     plotOptions: {
    //         series: {
    //             pointStart: 0
    //         }
    //     },

    //     series: [

    //         {
    //             "name": "A",
    //             "data": [
    //                 [Date.UTC(2010, 0, 1), 39.9],
    //                 [Date.UTC(2010, 2, 1), 77.5],
    //                 [Date.UTC(2010, 3, 1), 166.4],
    //                 [Date.UTC(2010, 3, 16), 16.4],
    //                 [Date.UTC(2010, 3, 19), 86.4]
    //             ]
    //         },
    //         {
    //             "name": "B",
    //             "data": [
    //                 [Date.UTC(2010, 0, 1), 2.9],
    //                 [Date.UTC(2010, 2, 1), 81.5],
    //                 [Date.UTC(2010, 3, 1), 166.4]
    //             ]
    //         },
    //         {
    //             "name": "C",
    //             "data": [
    //                 [Date.UTC(2010, 0, 1), 27.9],
    //                 [Date.UTC(2010, 2, 1), 78.5],
    //                 [Date.UTC(2010, 3, 1), 88.4]
    //             ]
    //         },
    //         {
    //             "name": "D",
    //             "data": [
    //                 [Date.UTC(2010, 0, 1), 9.9],
    //                 [Date.UTC(2010, 2, 1), 76.5],
    //                 [Date.UTC(2010, 3, 1), 87.4]
    //             ]
    //         }, {
    //             "name": "E",
    //             "data": [
    //                 [Date.UTC(2010, 0, 1), 87.9],
    //                 [Date.UTC(2010, 2, 1), 7.5],
    //                 [Date.UTC(2010, 3, 1), 45.4]
    //             ]
    //         }
    //         //     {
    //         //     name: 'Installation',
    //         //     data: [1, 4, 5, 8, 34, 56, 77, 88]
    //         // }, {
    //         //     name: 'Manufacturing',
    //         //     data: [1, 2, 5, 8, 33, 44, 55, 99]
    //         // }, {
    //         //     name: 'Sales & Distribution',
    //         //     data: [23, 33, 36, 45, 55, 67, 89, 999]
    //         // }, {
    //         //     name: 'Project Development',
    //         //     data: [null, null, 44, 55, 66, 77, 88, 90]
    //         // }, {
    //         //     name: 'Other',
    //         //     data: [23, 34, 45, 56, 67, 78, 89, 90]
    //         // }
    //     ]

    // });

});