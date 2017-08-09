$(function() {

    var startindex = 0;
    if (($('#nextsearindex').val() != undefined))
        startindex = $('#nextsearindex').val();

    var categorytype = "all";

    GetBlogsInfo(startindex, categorytype);

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

    $(".cancel").click(function() {
        var cancel = confirm("Are you sure you want to cancel?");
        if (cancel == true) {
            history.back(1);
        }
    });

    $(".subscribe").click(function() {
        var isValid = true;
        var errorPanel = $("<div></div>");
        var errorMessage = null;

        if (
            $("#nameSubscribe").val() == "" ||
            $("#nameSubscribe").val() == undefined
        ) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please enter name.")
            );
        } else if (!validateName($("#nameSubscribe").val())) {
            isValid = false;
            errorPanel.append(
                ErrorMessage(" <strong>Warning!</strong> Please enter valid Name.")
            );
        }

        if (
            $("#emailSubscribe").val() == "" ||
            $("#emailSubscribe").val() == undefined
        ) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please enter email.")
            );
        } else if (!validateEmail($("#emailSubscribe").val())) {
            isValid = false;
            errorPanel.append(
                ErrorMessage("<strong>Warning!</strong> Please enter valid email.")
            );
        }

        if (isValid) {
            $(".ErrorPanel").html("");
            $.ajax({
                url: "http://localhost:1337/subscribe",
                type: "GET",
                data: 'emailID="' +
                    $("#emailSubscribe").val() +
                    '"&name="' +
                    $("#nameSubscribe").val(),
                success: function(data) {
                    $(".subscribeBlock").addClass("hidden");
                    $(".successResult").removeClass("hidden");
                },
                error: function(err) {
                    $(".subscribeBlock").addClass("hidden");
                    $(".errorResult").removeClass("hidden");
                }
            });
        } else {
            $(".ErrorPanel").html(errorPanel).removeClass("hidden");
        }
    });

    $.getJSON("/authorizedAPI/data/DashboardUserGraphInfo")
        .done(function(data) {
            if (data != null) {

                var collection = [];

                collection.push(
                    alasql(
                        "SELECT count(*) as total, dateTime, 'User registration' as text FROM ? GROUP BY  dateTime ", [data.userData]
                    )
                );
                collection.push(
                    alasql(
                        "SELECT count(*) as total, dateTime, 'Subscribe Users' as text FROM ? GROUP BY  dateTime ", [data.subscribeUserData]
                    )
                );

                var collectionList = CreateGraphCollection(collection);
                CreateUserGraph(collectionList);
            }
        })
        .fail(function(jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
        });

    // $.getJSON("/userGraph.json")
    //     .done(function(data) {
    //         if (data != null) {
    //             //CreateUserGraph(data);
    //             // console.log("JSON success data:" + JSON.stringify(data));
    //         }
    //     })
    //     .fail(function(jqxhr, textStatus, error) {
    //         console.log("json error");
    //     });

    $.getJSON("/authorizedAPI/data/GetTradingBlogs")
        .done(function(data) {
            if (data != null) {
                data = alasql(
                    "SELECT categorykey , count(*) as total FROM ? GROUP BY categorykey", [data]
                );
                $(".blogTrend").append(GetTradingBlogs(data));
            }
        })
        .fail(function(jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
        });

    $.getJSON("/commonapi/data/countries")
        .done(function(data) {
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
                name: "states",
                source: result
            });
        })
        .fail(function(jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
        });

    $.getJSON("/authorizedAPI/data/DashboardBlogsInfo")
        .done(function(data) {
            if (data != null) {
                var collection = [];
                collection.push(
                    alasql("SELECT count(*) as total , 'Total comments' as text FROM ?", [
                        data
                    ])[0]
                );
                collection.push(
                    alasql(
                        "SELECT count(*) as total, 'Total approved' as text FROM ? where IsApproved=true", [data]
                    )[0]
                );
                collection.push(
                    alasql(
                        "SELECT count(*) as total, 'Total disapproved' as text FROM ? where IsApproved=false", [data]
                    )[0]
                );
                $(".validateTickets").append(GetDashboardBlogsInfo(collection));
            }
        })
        .fail(function(jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
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

    //calling method
    LoadDashboardUserInfo();

    $("#userInfoTable").on("click", "tr", function() {
        var value = $(this).attr("type");
        if (value != null) {
            run_waitMe("userDataTableClass");
            $.when(GetCompiledTemplate("dashboardRawTable"), GetDashboardTableJSON(value))
                .done(function(template, json) {
                    var data = { "user": json };
                    var compiledTemplate = Handlebars.compile(template);
                    var html = compiledTemplate(data);
                    $(".userTableDiv").html(html).show();
                    $('#userDataTable').DataTable({
                        "order": [
                            [3, "desc"]
                        ],
                        "aLengthMenu": [
                            [5, 10, 20],
                            [5, 10, 20]
                        ]
                    });
                    stop_waitMe("userDataTableClass");
                });
        }
    });

    $(".userTableDiv").on("click", "td>button", function() {
        var item = {};
        var jsonObj = [];
        item["id"] = $(this).closest("tr").data("id");
        var userName = $(this).closest("tr").data("name");
        $(this).closest("tr").find('input:checkbox').each(function() {
            if ($(this).data('type') === "email") {
                item["email"] = $(this).is(':checked');
            } else if ($(this).data('type') === "admin") {
                item["admin"] = $(this).is(':checked');
            } else if ($(this).data('type') === "active") {
                item["active"] = $(this).is(':checked');
            }
        });
        jsonObj.push(item);
        UpdateTableRecords(jsonObj, userName);
    });

    $(".userInfoLoader").on("click", function() {
        LoadDashboardUserInfo();
    });

    $('#divImage').on("click", function() {
        if (($('#nextsearindex').val() != undefined))
            startindex = $('#nextsearindex').val();
        GetBlogsInfo(startindex, categorytype);
    });

    $('.blogcategory').on("click", ".blogctid", function() {
        categorytype = $(this).data("key");
        GetBlogsInfo("0", categorytype);
    });
});

let UpdateTableRecords = (record, userName) => {
    swal({
        title: "Are you sure?",
        text: "Are you sure that you want to update this records?",
        type: "warning",
        showCancelButton: true,
        closeOnConfirm: false,
        confirmButtonText: "Yes, update it!",
        confirmButtonColor: "#ec6c62"
    }, function() {
        $.ajax({
                method: "Post",
                url: "/authorizedAPI/data/UpdateTableRecords",
                data: record[0]
            })
            .done(function(data) {
                userName = userName != null ? userName : "Your record";
                LoadDashboardUserInfo();
                swal("Updated!", userName + " is successfully updated!", "success");
            })
            .error(function(data) {
                swal("Oops", "We couldn't connect to the server!", "error");
            });
    });
};

let GetBlogsInfo = (startindex, categorytype) => {
    run_waitMe("blogdata");
    $.when(GetCompiledTemplate("blogsection"), GetBlogsByStartIndex(startindex, categorytype))
        .done(function(template, json) {

            var data = { "index": json.index, "blogs": json.blogs };
            var compiledTemplate = Handlebars.compile(template);
            var newhtml = compiledTemplate(data);

            if (startindex == 0 && categorytype != "all")
                $(".blogdata").html(newhtml);
            else
                $(".blogdata").append(newhtml);

            limitBlogLength();

            if ($('#nextsearindex').val() != undefined) {
                var idx = $('#nextsearindex').val();
                if (parseInt(data.index) + 1 > idx) {
                    $('#nextsearindex').val(data.index);
                    $("#divImage").removeClass("hidden");
                    $("#divImage").addClass("show");
                } else {
                    $("#divImage").removeClass("show");
                    $("#divImage").addClass("hidden");
                }
            }
        });
    stop_waitMe("blogdata");
}

let GetBlogsByStartIndex = (startindex, categorytype) => {
    console.log("GetBlogsByStartIndex : startindex : " + startindex + ", Category : " + categorytype);
    var d = $.Deferred();

    $.ajax({
            method: "post",
            url: "/commonapi/data/blog/",
            data: { "si": startindex, "ct": categorytype }
        })
        .done(function(jsonResult) {
            d.resolve(jsonResult);
        })
        .fail(function() {
            d.reject;
        })
        .always(function() {});
    return d.promise();
};

//$.when(GetCompiledTemplate("dashboardRawTable"), GetDashboardTableJSON(value))
//           .done(function(template, json) {

// console.log("1");
// $.ajax({
//         method: "Get",
//         url: "/commonapi/data/blog"
//     })
//     .done(function(data) {
//         console.log("2");
//         $.when(GetCompiledTemplate("blogsection"))
//             .done(function(template) {
//                 console.log("3");
//                 debugger;

//                 var data = { "blogs": data };
//                 var compiledTemplate = Handlebars.compile(template);
//                 var html = compiledTemplate(data);
//                 $(".blogdata").html(html).show();
//             });
//         //  debugger;

//     })
//     .error(function(data) {

//     });
//};


let GetCompiledTemplate = (fileName) => {
    var d = $.Deferred();
    $.ajax({
            method: "Get",
            url: "/rawTemplates/" + fileName + ".handlebars",
            dataType: "text"
        })
        .done(function(data) {
            d.resolve(data);
        })
        .fail(function() {
            d.reject;
        })
        .always(function() {});
    return d.promise();
};

let GetDashboardTableJSON = (data) => {
    //  run_waitMe('userTableDiv');
    var d = $.Deferred();
    $.ajax({
            method: "Post",
            url: "/authorizedAPI/data/DashboardUsertable",
            data: { type: data.toLowerCase() }
        })
        .done(function(jsonResult) {
            d.resolve(jsonResult);
        })
        .fail(function() {
            d.reject;
        })
        .always(function() {});
    return d.promise();
}

let LoadDashboardUserInfo = () => {
    run_waitMe();
    $(".userInfo").html("");
    $.getJSON("/authorizedAPI/data/DashboardUserInfo")
        .done(function(data) {
            if (data != null) {
                var collection = [];
                collection.push(
                    alasql(
                        "SELECT count(*) as total, 'Total' as text,'totalUser' as key FROM ?", [data]
                    )[0]
                );
                collection.push(
                    alasql(
                        "SELECT count(*) as total, 'Admin' as text ,'adminUser' as key FROM ? where admin=true", [data]
                    )[0]
                );
                collection.push(
                    alasql(
                        "SELECT count(*) as total, 'Active' as text ,'activeUser' as key FROM ? where active=true", [data]
                    )[0]
                );
                collection.push(
                    alasql(
                        "SELECT count(*) as total, 'Deactive' as text ,'deactiveUser' as key FROM ? where active=false", [data]
                    )[0]
                );
                collection.push(
                    alasql(
                        "SELECT count(*) as total, 'Email' as text ,'emailVeriPending' as key FROM ? where IsEmailVerified=false", [data]
                    )[0]
                );
                $(".userInfo").append(CreateDashboardUserInfo(collection));
            }
            stop_waitMe();
        })
        .fail(function(jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            stop_waitMe();
        });
};

let run_waitMe = (divClass, animation) => {
    divClass = divClass != null ? divClass : "userInfoDiv";
    animation = animation != null ? animation : "facebook";
    $("." + divClass).waitMe({
        effect: animation,
        text: "",
        bg: "rgba(255,255,255,0.7)",
        color: "#000",
        sizeW: "",
        sizeH: "",
        source: "",
        onClose: function() {}
    });
};

let stop_waitMe = (divClass, animation) => {
    divClass = divClass != null ? divClass : "userInfoDiv";
    animation = animation != null ? animation : "timer";
    $("." + divClass).waitMe("hide");
};

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
    return (val * 100 / total).toFixed(0);
};

let validateEmail = $email => {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test($email);
};

let validateName = $name => {
    var NameReg = /^[a-zA-Z\s]+$/;
    return NameReg.test($name);
};

let ErrorMessage = $message => {
    return $("<div class='alert alert-warning'></div>").append($message);
};

let getFileExtension = filename => {
    var extension = filename.replace(/^.*\./, "");
    if (extension == filename) {
        extension = "";
    } else {
        extension = extension.toLowerCase().trim();
    }

    return extension;
};

let GetTradingBlogs = results => {
    var list = $("<ul class='dashboard-stat-list blogTrend'></ul>");
    var node = null;
    $.each(results, function(i, item) {
        node =
            "<li>" +
            validateCategory(categoryJSON, item["categorykey"]) +
            "<span class='pull-right'><i class='material-icons'>trending_up</i>" +
            item["total"] +
            "</span></li>";
        list.append(node);
    });
    return list.html();
};

let GetDashboardBlogsInfo = results => {
    var list = $("<ul class='dashboard-stat-list validateTickets'></ul>");
    var node = null;
    $.each(results, function(i, item) {
        node =
            "<li>" +
            item["text"] +
            "<span class='pull-right'><b>" +
            item["total"] +
            "</b>" +
            "<small>TICKETS</small></li>";
        list.append(node);
    });
    return list.html();
};

let CreateDashboardUserInfo = results => {
    var list = $("<tbody class='userInfo'></tbody>");
    var node = null;
    var count = 0;
    var totalUser = 0;
    //var count1 = 0;
    $.each(results, function(i, item) {
        count++;
        //  var totalUser = 0;
        totalUser = count == 1 ? item["total"] : totalUser;
        var percentage = calculatePercentage(item["total"], totalUser);
        var UserInfoColor = validateUserInfoColor(userInfoColor, item["key"]);

        //count1++;
        node =
            "<tr type='" +
            item["text"] +
            "'>" +
            "<td>" +
            count +
            "</td>" +
            "<td><span class='label " +
            UserInfoColor +
            "'>" +
            item["text"] +
            "</span></td>" +
            "<td>" +
            item["total"] +
            "</td>" +
            "<td>" +
            percentage +
            "%</td>" +
            "<td><div class='progress'><div class='progress-bar " +
            UserInfoColor +
            "' style='width: " +
            percentage +
            "%'></div></div></td></tr>";
        list.append(node);

    });

    return list.html();
};

let CreateUserGraph = results => {
    var collection = [];
    collection.push(results);
    if ($('#container').length) {
        Highcharts.chart("container", {
            title: {
                text: "Users growth by day, 2016-2017"
            },
            yAxis: {
                title: {
                    text: "Number of Users"
                }
            },
            xAxis: {
                type: "datetime",
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
                backgroundColor: "#FCFFC5"
            },
            plotOptions: {
                series: {
                    pointStart: 0
                }
            },
            series: results
        });
    }
};

let CreateGraphCollection = results => {
    var collection = [];
    var collectionList = [];
    var fullCollectionList = {};
    var collectionName = "";

    if (results != null) {
        $.each(results, function(i, result) {

            collection = [];
            $.each(result, function(i, data) {

                collectionName = data["text"];
                var d = new Date(data["dateTime"]);
                var utcDate = Date.UTC(
                    d.getUTCFullYear(),
                    d.getUTCMonth(),
                    d.getUTCDate()
                );

                var data = [utcDate, data["total"]];
                collection.push(data);
            });
            collectionList.push({ name: collectionName, data: collection });
        });
        return collectionList;
    }
};

var categoryJSON = [
    { key: "0", name: "Technical Blog" },
    { key: "1", name: "Beginner Blog" },
    { key: "2", name: "Beginner Blog 1" },
    { key: "3", name: "Beginner Blog 2" }
];

var userInfoColor = [
    { key: "totalUser", color: "bg-green" },
    { key: "adminUser", color: "bg-blue" },
    { key: "activeUser", color: "bg-light-blue" },
    { key: "deactiveUser", color: "bg-red" },
    { key: "emailVeriPending", color: "bg-orange" }
];

let limitBlogLength = () => {
    $('.blogdata .limitblogdata').each(function(index, value) {
        var showlength = 100;
        var data = $(value).text();
        if (data.length > showlength) {
            var c = data.substring(0, showlength);
            $('.blogdata .limitblogdata')[index].innerHTML = "";
            $('.blogdata .limitblogdata')[index].innerHTML = "<p>" + c + "</p>";
        }
    });
};