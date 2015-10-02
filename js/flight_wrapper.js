// JavaScript source code

function parseDate(params) {
    var date_obj = new Date(params);
    var params_day = date_obj.getDate();
    var params_month = date_obj.getMonth() + 1
    var params_year = date_obj.getFullYear();
    if (params_month.toString().length == 1) {
        var temp_month = params_month.toString().split('');
        temp_month.push('0');
        params_month = temp_month.reverse().join('');
    }
    if (params_day.toString().length == 1) {
        var temp_day = params_day.toString().split('');
        temp_day.push('0');
        params_day = temp_day.reverse().join('');
    }
    var ret = {
        'date': params_day,
        'month': params_month,
        'year': params_year
    };
    return ret;
}

function parseToHipmunk(params) {
    var sFrom = params['trips'][0]['from_city_code'];
    var sTo = params['trips'][0]['to_city_code'];
    var adult = params['people_dict']['adult'];
    var child = params['people_dict']['child'];

    if (params['FlightType'] === "One-Way") {
        var d = parseDate(params['trips'][0]['date1']);
        var dDate = d['year'] + '-' + d['month'] + '-' + d['date'];
        var url = 'https://www.hipmunk.com/flights#f=' + sFrom + ';t=' + sTo + ';d=' + dDate + ';p=' + adult + ';children=' + child;

    } else if (params['FlightType'] === "Return") {
        var d = parseDate(params['trips'][0]['date1']);
        var dDate = d['year'] + '-' + d['month'] + '-' + d['date'];
        var r = parseDate(params['trips'][0]['date2']);
        var rDate = r['year'] + '-' + r['month'] + '-' + r['date'];
        var url = 'https://www.hipmunk.com/flights#f=' + sFrom + ';t=' + sTo + ';d=' + dDate + ';r=' + rDate + ';p=' + adult + ';children=' + child;

    } else if (params['FlightType'] === "Multi-City") {
        var url = 'https://www.hipmunk.com/flights#';
        for (var i = 0; i < params['trips'].length; i++) {
            var d = parseDate(params['trips'][i]['date1']);
            var dDate = d['year'] + '-' + d['month'] + '-' + d['date'];
            sFrom = params['trips'][i]['from_city_code'];
            sTo = params['trips'][i]['to_city_code'];
            url += 'f' + i + '=' + sFrom + ';t' + i + '=' + sTo + ';d' + i + '=' + dDate + ';';
        }
        url += 'p=' + adult + ';children=' + child;

    }
    return url;
}

function parseToKayak(params) {
    var sFrom = params['trips'][0]['from_city_code'];
    var sTo = params['trips'][0]['to_city_code'];
    var adult = params['people_dict']['adult'];
    var child = params['people_dict']['child'];

    if (params['FlightType'] === "One-Way") {
        var d = parseDate(params['trips'][0]['date1']);
        var dDate = d['year'] + '-' + d['month'] + '-' + d['date'];
        if (child > 0) {
            var child_count = '/children';
            for (var i = 0; i < Number(child) ; i++) {
                child_count += '-11';
            }
            var url = 'http://www.kayak.com/flights/' + sFrom + '-' + sTo + '/' + dDate + '/' + adult + 'adults' + child_count;
        } else if (child == 0) {
            var url = 'http://www.kayak.com/flights/' + sFrom + '-' + sTo + '/' + dDate + '/' + adult + 'adults';
        }

    } else if (params['FlightType'] === "Return") {
        var d = parseDate(params['trips'][0]['date1']);
        var dDate = d['year'] + '-' + d['month'] + '-' + d['date'];
        var r = parseDate(params['trips'][0]['date2']);
        var rDate = r['year'] + '-' + r['month'] + '-' + r['date'];
        if (child > 0) {
            var child_count = '/children';
            for (var i = 0; i < Number(child) ; i++) {
                child_count += '-11';
            }
            var url = 'http://www.kayak.com/flights/' + sFrom + '-' + sTo + '/' + dDate + '/' + rDate + '/' + adult + 'adults' + child_count;
        } else if (child == 0) {
            var url = 'http://www.kayak.com/flights/' + sFrom + '-' + sTo + '/' + dDate + '/' + rDate + '/' + adult + 'adults';
        }

    } else if (params['FlightType'] === "Multi-City") {
        var url = 'http://www.kayak.com/flights';
        for (var i = 0; i < params['trips'].length; i++) {
            var d = parseDate(params['trips'][i]['date1']);
            var dDate = d['year'] + '-' + d['month'] + '-' + d['date'];
            sFrom = params['trips'][i]['from_city_code'];
            sTo = params['trips'][i]['to_city_code'];
            url += '/' + sFrom + '-' + sTo + '/' + dDate;
        }
        if (child > 0) {
            var child_count = '/children';
            for (var i = 0; i < Number(child) ; i++) {
                child_count += '-11';
            }
            url += '/' + adult + 'adults' + child_count;
        } else if (child <= 0) {
            url += '/' + adult + 'adults';
        }

    }
    return url;
}

function parseToExpedia(params) {
    var sFrom = params['trips'][0]['from_city_code'];
    var sTo = params['trips'][0]['to_city_code'];
    var adult = params['people_dict']['adult'];
    var child = params['people_dict']['child'];

    if (params['FlightType'] === "One-Way") {
        d = parseDate('expedia', params['trips'][0]['date1']);
        var dDate = d['month'] + '/' + d['day'] + '/' + d['year'];
        var url = 'https://www.expedia.com/Flights-Search?trip=oneway&leg1=from:' + sFrom + ',to:' + sTo + ',departure:' + dDate + 'TANYT&passengers=children:' + child + ',adults:' + adult + '&mode=search';

    } else if (params['FlightType'] === "Return") {
        var d = parseDate('expedia', params['trips'][0]['date1']);
        var dDate = d['month'] + '/' + d['day'] + '/' + d['year'];
        var r = parseDate('expedia', params['trips'][0]['date2']);
        var rDate = r['month'] + '/' + r['day'] + '/' + r['year'];
        var url = 'https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:' + sFrom + ',to:' + sTo + ',departure:' + dDate + 'TANYT&leg2=from:' + sTo + ',to:' + sFrom + ',departure:' + rDate + 'TANYT&passengers=children:' + child + ',adults:' + adult + '&mode=search';

    } else if (params['FlightType'] === "Multi-City") {
        var url = 'https://www.expedia.com/Flights-Search?trip=multi';
        for (var i = 0; i < params['trips'].length; i++) {
            var d = parseDate('expedia', params['trips'][i]['date1']);
            var dDate = d['month'] + '/' + d['day'] + '/' + d['year'];
            sFrom = params['trips'][i]['from_city_code'];
            sTo = params['trips'][i]['to_city_code'];
            var leg = i + 1;
            url += '&leg' + leg + '=from:' + sFrom + ',to:' + sTo + ',departure:' + dDate + 'TANYT';
        }
        url += '&passengers=children:' + child + ',adults:' + adult + '&mode=search';

    }
    return url;
}