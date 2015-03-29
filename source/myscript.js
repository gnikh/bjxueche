$(function() {
    if ($("#tblMain").length == 0) {
        chrome.extension.sendRequest({request_type: "notify", notify_info: "请重新登录！"});
        return;
    }

    chrome.extension.sendRequest({request_type: "get_info"}, function(response) {
        console.log(response.check_list.length);
        for (var i = 0; i < response.check_list.length; ++i) {
            var date = response.check_list[i].date;
            var time = response.check_list[i].time;
            console.log(date);
            console.log(time);
            var available = $('td[yyrq="' + date + '"][yysd="' + time + '"]').text();
            if(available == "有") {
                chrome.extension.sendRequest({request_type: "notify", notify_info: date + "可以约车了！"});
                return;
            }
        }
        if (response.is_refresh) {
            setTimeout(function() {
                 location.reload();
            }, response.time_interval);
        }
    });

    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        if (request.request_type == "reload") {
            location.reload();
        }
    });
});
