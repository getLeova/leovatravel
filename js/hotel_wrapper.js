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

function parseToHotels(params) {
    var date1 = parseDate(params['hotel_dict']['from_date']);
    var dDate = date1['month'] + '/' + date1['date'] + '/' + parseInt(date1['year'].toString().slice(2,4));
    var date2 = parseDate(params['hotel_dict']['to_date']);
    var rDate = date2['month'] + '/' + date2['date'] + '/' + parseInt(date2['year'].toString().slice(2, 4));

    var sTo = params['hotel_dict']['destination'];
    var temp = sTo.split(' ');
    for (var i = 0; i < temp.length; i++) {
        temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1, temp[i].length);
    }
    sTo = temp.join(' ');

    var adult = params['people_dict']['adult'];
    var child = params['people_dict']['child'];

    var url = 'http://www.hotels.com/search.do?q-destination=' + encodeURIComponent(sTo) + ',%20United%20States%20of%20America&q-localised-check-in=' + encodeURIComponent(dDate) + '&q-localised-check-out=' + encodeURIComponent(rDate) + '&q-rooms=1&q-room-0-adults=' + adult + '&q-room-0-children=' + child;
    return url;
}

function parseToExpedia(params) {
    var date1 = parseDate(params['hotel_dict']['from_date']);
    var dDate = date1['month'] + '/' + date1['date'] + '/' + date1['year'];
    var date2 = parseDate(params['hotel_dict']['to_date']);
    var rDate = date2['month'] + '/' + date2['date'] + '/' + date2['year'];

    var sTo = params['hotel_dict']['destination'];
    var temp = sTo.split(' ');
    for (var i = 0; i < temp.length; i++) {
        temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1, temp[i].length);
    }
    sTo = temp.join(' ');

    var adult = params['people_dict']['adult'];
    var child = params['people_dict']['child'];
    var url = 'https://www.expedia.com/Hotel-Search?#&destination=' + sTo + ' (and vicinity), United States of America&startDate=' + dDate + '&endDate=' + rDate + '&adults=' + adult + '&children=' + child;
    return url;
}

function parseToHotwire(params) {
    var date1 = parseDate(params['hotel_dict']['from_date']);
    var dDate = date1['month'] + '-' + date1['date'] + '-' + date1['year'];
    var date2 = parseDate(params['hotel_dict']['to_date']);
    var rDate = date2['month'] + '-' + date2['date'] + '-' + date2['year'];

    var sTo = params['hotel_dict']['destination'];
    var temp = sTo.split(' ');
    for (var i = 0; i < temp.length; i++) {
        temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1, temp[i].length);
    }
    sTo = temp.join(' ');

    var adult = params['people_dict']['adult'];
    var child = params['people_dict']['child'];

    var url = 'https://www.hotwire.com/hotels/#!/search?destination='+ encodeURIComponent(sTo) +'&startDate='+dDate+'&endDate='+rDate+'&rooms=1&adults='+adult+'&children='+child;
    return url;
}




