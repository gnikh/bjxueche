var is_refresh = false;
var check_list = new Array();
var time_interval = 300000; // 5min

function check_list_to_string(check_list) {
    string_list = new Array();
    for (var i = 0; i < check_list.length; ++i) {
        string_list.push(check_list[i].date);
        if (check_list[i].time == "812") {
            string_list.push("上午<br/>");
        } else if (check_list[i].time == "15") {
            string_list.push("下午<br/>");
        } else if (check_list[i].time == "58") {
            string_list.push("晚上<br/>");
        }
    }
    return string_list.toString();
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.request_type == "get_info") {
        sendResponse({is_refresh: is_refresh, check_list: check_list, time_interval: time_interval, check_list_str: check_list_to_string(check_list)});
    } else if (request.request_type == "notify") {
        is_refresh = false;
        new Notification(request.notify_info);
    } else if (request.request_type == "start_refresh") {
        is_refresh = true;
        check_list = request.check_list;
        time_interval = request.time_interval;
        chrome.tabs.sendRequest(request.tab_id, {request_type: "reload"});
    } else if (request.request_type == "stop_refresh") {
        is_refresh = false;
    }
});
