$(function() {
    function change_status(refreshing) {
        if (refreshing) {
            $("#check_div").hide();
            $("#add_check").hide();
            $("#start_refresh").hide();
            $("#stop_refresh").show();
            $("#check_info").show();
        } else {
            $("#check_div").show();
            $("#add_check").show();
            $("#start_refresh").show();
            $("#stop_refresh").hide();
            $("#check_info").hide();
        }
    }

    chrome.extension.sendRequest({request_type: "get_info"}, function(response) {
        if (response.is_refresh) {
            $("#check_info").append(response.check_list_str);
        }
        change_status(response.is_refresh);
    });

    $("#add_check").click(function() {
        var template = ' \
            <tr> \
                <td> \
                    <input type="text" placeholder="日期格式：20150328" value="" class="check_date" /> \
                </td> \
                <td> \
                    <select class="check_time"> \
                        <option value ="812">上午</option> \
                        <option value ="15">下午</option> \
                        <option value="58">晚上</option> \
                    </select> \
                </td> \
            </tr>'
        $("#check_table").append($(template));
    });

    $("#start_refresh").click(function(){
        change_status(true);
        chrome.tabs.getSelected(function(tab) {
            var check_list = new Array();
            var date_list = $(".check_date");
            var time_list = $(".check_time");
            for (var i = 0; i < date_list.length; ++i) {
                check_list.push({date: $(date_list[i]).val(), time: $(time_list[i]).val()});
            }
            var time_interval = $("#time_interval").val() * 1000;
            chrome.extension.sendRequest({
                request_type: "start_refresh",
                check_list: check_list,
                time_interval: time_interval,
                tab_id: tab.id});
        });
    });
    $("#stop_refresh").click(function(){
        change_status(false);
        chrome.tabs.getSelected(function(tab) {
            chrome.extension.sendRequest({
                request_type: "stop_refresh",
                tab_id: tab.id});
        });
    });
});
