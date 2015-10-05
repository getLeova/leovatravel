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

function parseToGoBuses(params) {
    var places_list = ["1", "2", "3"];
    if (params['FlightType'] === 'One-Way') {
        // parses the date
        var date1 = parseDate(params['trips'][0]['date1']);

        var dDate  = encodeURIComponent(date1['date'] + '/' + date1['month'] + '/' + date1['year']);
        var sFrom = params['trips'][0]['from_city_code'];
        var sTo = params['trips'][0]['to_city_code'];
        if (places_list.indexOf(sFrom) == -1 || places_list.indexOf(sTo) == -1) {
            return ('GoBuses only supports Manhattan, Cambridge and Newton');
        }

        var qty   = parseInt(params['people_dict']['adult']) + parseInt(params['people_dict']['child']);

        // url has time parameter of 00:00:00 UTC
        var url = 'https://www.gobuses.com/select-tickets/?rp=1&sFrom='+sFrom+'&sTo='+sTo+'&qty='+qty+'&qtyWc=0&isWc=0&isReturn=0&dDate='+dDate+'+00%3a00%3a00';
        return url;
    } else if (params['FlightType'] === 'Return') {
        // parses the date
        var date1 = parseDate(params['trips'][0]['date1']);
        var date2 = parseDate(params['trips'][0]['date2']);

        var dDate = encodeURIComponent(date1['date'] + '/' + date1['month'] + '/' + date1['year']);
        var rDate = encodeURIComponent(date2['date'] + '/' + date2['month'] + '/' + date2['year']);
        var sFrom = places_dict[params['trips'][0]['from_city_name']];
        var sTo = places_dict[params['trips'][0]['to_city_name']];
        var qty = parseInt(params['people_dict']['adult']) + parseInt(params['people_dict']['child']);

        // url has time parameter of 00:00:00 UTC
        var url = 'https://www.gobuses.com/select-tickets/?rp=1&sFrom=' + sFrom + '&sTo=' + sTo + '&qty=' + qty + '&qtyWc=0&isWc=0&isReturn=1&dDate=' + dDate + '+00%3a00%3a00&rDate='+rDate+'+00%3a00%3a00';
        return url;
    }
}

function parseToGoToBus(params) {
    if (params['FlightType'] === 'One-Way') {
        var url = 'http://search.gotobus.com/search/bus.do?nm=&st=&gid=&option=Select&from_vendor_page=&hotel_bus_package=&is_roundtrip=0&submit_flag=submit_flag&d_vicinity=&a_vicinity=';
        // parses the date
        var date1 = parseDate(params['trips'][0]['date1']);
        var dDate = date1['year'] + '-' + date1['month'] + '-' + date1['date'];

        var sFrom = params['trips'][0]['from_city_name'];
        var sFrom_code = params['trips'][0]['from_city_code'];
        var temp = sFrom.split(' ');
        for (var i = 0; i < temp.length; i++) {
            temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1,temp[i].length);
        }
        sFrom = temp.join('+');

        var sTo = params['trips'][0]['to_city_name'];
        var temp = sTo.split(' ');
        for (var i = 0; i < temp.length; i++) {
            temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1, temp[i].length);
        }
        sTo = temp.join('+');

        var sTo_code = params['trips'][0]['to_city_code'];
        var adult = params['people_dict']['adult'];
        var child = params['people_dict']['child'];

        // url has time parameter of 00:00:00 UTC
        console.log(sFrom);
        url += '&roundtrip=0&bus_from=' + sFrom + '%2C+' + sFrom_code + '&bus_to='+sTo+'%2C+' + sTo_code + '&filter_date=' + dDate + '&return_date=&adult_num=' + adult + '&child_num=' + child;
        return url;
    } else if (params['FlightType'] === 'Return') {
        var url = 'http://search.gotobus.com/search/bus.do?nm=&st=&gid=&option=Select&from_vendor_page=&hotel_bus_package=&is_roundtrip=1&submit_flag=submit_flag&d_vicinity=&a_vicinity=';
        // parses the date
        var date1 = parseDate(params['trips'][0]['date1']);
        var date2 = parseDate(params['trips'][0]['date2']);

        var dDate = date1['year'] + '-' + date1['month'] + '-' + date1['date'];
        var rDate = date2['year'] + '-' + date2['month'] + '-' + date2['date'];
        var sFrom = params['trips'][0]['from_city_name'];
        var temp = sFrom.split(' ');
        for (var i = 0; i < temp.length; i++) {
            temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1, temp[i].length);
        }
        sFrom = temp.join('+');

        var sFrom_code = params['trips'][0]['from_city_code'];
        var sTo = params['trips'][0]['to_city_name'];
        var temp = sTo.split(' ');
        for (var i = 0; i < temp.length; i++) {
            temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1, temp[i].length);
        }
        sTo = temp.join('+');

        var sTo_code = params['trips'][0]['to_city_code'];
        var adult = params['people_dict']['adult'];
        var child = params['people_dict']['child'];

        // url has time parameter of 00:00:00 UTC
        url += '&roundtrip=1&bus_from='+sFrom+'%2C+'+sFrom_code+'&bus_to='+sTo+'%2C+'+sTo_code+'&filter_date='+dDate+'&return_date='+rDate+'&adult_num='+adult+'&child_num='+child;
        return url;
    }
}

function parseToWanderu(params) {
    if (params['FlightType'] === 'One-Way') {
        // parses the date
        var date1 = parseDate(params['trips'][0]['date1']);
        var dDate = date1['year'] + '-' + date1['month'] + '-' + date1['date'];

        var sFrom = params['trips'][0]['from_city_name'];
        var temp = sFrom.split(' ');
        for (var i = 0; i < temp.length; i++) {
            temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1, temp[i].length);
        }
        sFrom = temp.join(' ');
        var sFrom_code = params['trips'][0]['from_city_code'];

        var sTo = params['trips'][0]['to_city_name'];
        var temp = sTo.split(' ');
        for (var i = 0; i < temp.length; i++) {
            temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1, temp[i].length);
        }
        sTo = temp.join(' ');
        var sTo_code = params['trips'][0]['to_city_code'];

        // url shows results from United States
        var url = 'https://www.wanderu.com/en/depart/' + encodeURIComponent(sFrom) + '%2C%20' + sFrom_code + '%2C%20United%20States/' + encodeURIComponent(sTo) + '%2C%20'+sTo_code+'%2C%20United%20States/'+dDate;
        return url;
    } else if (params['FlightType'] === 'Return') {
        // parses the date
        var date1 = parseDate(params['trips'][0]['date1']);
        var date2 = parseDate(params['trips'][0]['date2']);

        var dDate = date1['year'] + '-' + date1['month'] + '-' + date1['date'];
        var rDate = date2['year'] + '-' + date2['month'] + '-' + date2['date'];

        var sFrom = params['trips'][0]['from_city_name'];
        var temp = sFrom.split(' ');
        for (var i = 0; i < temp.length; i++) {
            temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1, temp[i].length);
        }
        sFrom = temp.join('+');
        var sFrom_code = params['trips'][0]['from_city_code'];

        var sTo = params['trips'][0]['to_city_name'];
        var temp = sTo.split(' ');
        for (var i = 0; i < temp.length; i++) {
            temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1, temp[i].length);
        }
        sTo = temp.join('+');
        var sTo_code = params['trips'][0]['to_city_code'];

        // url shows results from United States
        var url = 'https://www.wanderu.com/en/depart/' + encodeURIComponent(sFrom) + '%2C%20' + sFrom_code + '%2C%20United%20States/' + encodeURIComponent(sTo) + '%2C%20' + sTo_code + '%2C%20United%20States/' + dDate+'/'+rDate;
        return url;
    }
}

function parseToPeterPanBus(params) {
    var dest = [{ "code": "150051", "city": "ALBANY", "state": "NY", "country": "US", "stateNumber": "15", "cityNumber": "0051", "agencyNumber": "01509", "address1": "TRAILWAYS GREYHOUND STA", "address2": "34 HAMILTON ST", "address3": "*", "address4": "*", "zipCode": "12207", "phoneNumber": "5184369651", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.65, "longitude": -73.755, "originFlag": true, "willCall": true, "hours": null }, { "code": "040018", "city": "AMHERST CENTER", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0018", "agencyNumber": "06946", "address1": "AMHERST BOOKS", "address2": "8 MAIN ST", "address3": "*", "address4": "*", "zipCode": "01002", "phoneNumber": "8005035865", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.377, "longitude": -72.469, "originFlag": false, "willCall": false, "hours": null }, { "code": "041272", "city": "AMHERST UMASS", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "1272", "agencyNumber": "03589", "address1": "TKTS-BOOKSTORE LINC CENT", "address2": "1 CAMPUS CENTER WAY", "address3": "BUS STOP-HAIGIS MALL @", "address4": "PRESIDENT'S DRIVE", "zipCode": "01003", "phoneNumber": "4135452619", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.395, "longitude": -72.521, "originFlag": false, "willCall": false, "hours": null }, { "code": "190036", "city": "BALTIMORE DOWNTOWN", "state": "MD", "country": "US", "stateNumber": "19", "cityNumber": "0036", "agencyNumber": "01903", "address1": "BALTIMORE GREYHOUND STA", "address2": "2110 HAINES ST", "address3": "*", "address4": "*", "zipCode": "21230", "phoneNumber": "4107527682", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 39.296, "longitude": -76.624, "originFlag": true, "willCall": true, "hours": null }, { "code": "040645", "city": "BARNSTABLE", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0645", "agencyNumber": "61034", "address1": "BARNSTABLE MOBIL MART", "address2": "2155 IYANNOUGH RD", "address3": null, "address4": null, "zipCode": "02601", "phoneNumber": "5083620075", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 41.675, "longitude": -70.311, "originFlag": false, "willCall": false, "hours": null }, { "code": "040030", "city": "BOSTON", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0030", "agencyNumber": "00406", "address1": "SOUTH STATION TRANS CTR", "address2": "700 ATLANTIC AVE", "address3": "*", "address4": "* ODETTE LUSZCZ", "zipCode": "02110", "phoneNumber": "6175261801", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.356, "longitude": -71.053, "originFlag": true, "willCall": true, "hours": null }, { "code": "040667", "city": "BOSTON LOGAN ARPT", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0667", "agencyNumber": "00000", "address1": null, "address2": null, "address3": null, "address4": null, "zipCode": "02128", "phoneNumber": null, "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.378, "longitude": -71.028, "originFlag": false, "willCall": false, "hours": null }, { "code": "040568", "city": "BOURNE", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0568", "agencyNumber": "03630", "address1": "CAPESIDE CONVENIENCE", "address2": "105 TROWBRIDGE RD", "address3": null, "address4": null, "zipCode": "02532", "phoneNumber": "5087439490", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 41.741, "longitude": -70.589, "originFlag": false, "willCall": false, "hours": null }, { "code": "060027", "city": "BRIDGEPORT", "state": "CT", "country": "US", "stateNumber": "06", "cityNumber": "0027", "agencyNumber": "05486", "address1": "BRIDGEPORT BUS STATION", "address2": "710 WATER ST", "address3": "*", "address4": "*", "zipCode": "06604", "phoneNumber": "2033351123", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 41.18, "longitude": -73.187, "originFlag": true, "willCall": true, "hours": null }, { "code": "040040", "city": "BUZZARDS BAY", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0040", "agencyNumber": "00000", "address1": null, "address2": null, "address3": null, "address4": null, "zipCode": "02532", "phoneNumber": null, "timeZone": "America/New_York", "dstUse": "Y", "latitude": 41.741, "longitude": -70.589, "originFlag": false, "willCall": false, "hours": null }, { "code": "060368", "city": "CANAAN", "state": "CT", "country": "US", "stateNumber": "06", "cityNumber": "0368", "agencyNumber": "61009", "address1": "BROOKS CANAAN PHARMACY", "address2": "MAIN ST", "address3": null, "address4": null, "zipCode": "06018", "phoneNumber": "8608245481", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.01, "longitude": -73.298, "originFlag": false, "willCall": false, "hours": null }, { "code": "040020", "city": "CHELSEA", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0020", "agencyNumber": "00000", "address1": null, "address2": null, "address3": null, "address4": null, "zipCode": "02150", "phoneNumber": null, "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.393, "longitude": -71.033, "originFlag": false, "willCall": false, "hours": null }, { "code": "020053", "city": "CONCORD", "state": "NH", "country": "US", "stateNumber": "02", "cityNumber": "0053", "agencyNumber": "07302", "address1": "CONCORD TRAILWAYS TERM", "address2": "30 STICKNEY AVE", "address3": null, "address4": null, "zipCode": "03301", "phoneNumber": "6032283300", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 43.239, "longitude": -71.511, "originFlag": false, "willCall": true, "hours": null }, { "code": "060038", "city": "DANBURY", "state": "CT", "country": "US", "stateNumber": "06", "cityNumber": "0038", "agencyNumber": "01398", "address1": "DANBURY STA", "address2": "48 ELM ST", "address3": null, "address4": null, "zipCode": "06810", "phoneNumber": "2037481353", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 41.389, "longitude": -73.458, "originFlag": false, "willCall": false, "hours": null }, { "code": "040755", "city": "DEERFIELD", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0755", "agencyNumber": "65010", "address1": "SAVAGE MARKET", "address2": "470 GREENFIELD RD", "address3": null, "address4": null, "zipCode": "01342", "phoneNumber": "4137743452", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.552, "longitude": -72.587, "originFlag": false, "willCall": false, "hours": null }, { "code": "040480", "city": "EVERETT", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0480", "agencyNumber": "00000", "address1": null, "address2": null, "address3": null, "address4": null, "zipCode": "02149", "phoneNumber": null, "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.04, "longitude": -71.006, "originFlag": false, "willCall": false, "hours": null }, { "code": "040073", "city": "FALL RIVER", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0073", "agencyNumber": "03636", "address1": "LOUIS PETTINE TRANSP CTR", "address2": "118 4TH ST", "address3": null, "address4": null, "zipCode": "02721", "phoneNumber": "5086724059", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 41.686, "longitude": -71.156, "originFlag": false, "willCall": false, "hours": null }, { "code": "040084", "city": "FALMOUTH", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0084", "agencyNumber": "03641", "address1": "PETER PAN BUS TERMINAL", "address2": "59 DEPOT AVE", "address3": null, "address4": null, "zipCode": "02540", "phoneNumber": "5085487588", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 41.563, "longitude": -70.623, "originFlag": false, "willCall": false, "hours": null }, { "code": "060050", "city": "FARMINGTON", "state": "CT", "country": "US", "stateNumber": "06", "cityNumber": "0050", "agencyNumber": "00750", "address1": "FARMINGTON TRAVEL", "address2": "12 BATTERSON PK RD", "address3": "PARK & RIDE LOT", "address4": null, "zipCode": "06032", "phoneNumber": "8606775466", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 41.728, "longitude": -72.837, "originFlag": false, "willCall": false, "hours": null }, { "code": "040117", "city": "FRAMINGHAM", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0117", "agencyNumber": "05240", "address1": "SHOPPERS WORLD", "address2": "1 WORCESTER RD", "address3": "*MWRTA BUS SHELTER NEAR", "address4": "*BARNES&NOBLE/OLIVE GARD", "zipCode": "01701", "phoneNumber": null, "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.18, "longitude": -74.223, "originFlag": false, "willCall": false, "hours": null }, { "code": "042240", "city": "FRAMINGHAM FLUTIE PASS", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "2240", "agencyNumber": "65014", "address1": "PARK AND RIDE LOT", "address2": "EXIT 13 OFF I-90", "address3": "ROUTES 9 & 30", "address4": "BUS STOP ONLY", "zipCode": "01701", "phoneNumber": null, "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.301, "longitude": -71.39, "originFlag": false, "willCall": false, "hours": null }, { "code": "040150", "city": "GREAT BARRINGTON", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0150", "agencyNumber": "00000", "address1": null, "address2": null, "address3": null, "address4": null, "zipCode": "01230", "phoneNumber": null, "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.184, "longitude": -73.364, "originFlag": false, "willCall": false, "hours": null }, { "code": "040140", "city": "GREENFIELD", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0140", "agencyNumber": "00244", "address1": "JOHN OLVER TRANSPORTATION", "address2": "12 OLIVE ST", "address3": "*", "address4": "*", "zipCode": "01301", "phoneNumber": "4137742262", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.585, "longitude": -72.6, "originFlag": false, "willCall": true, "hours": null }, { "code": "040887", "city": "HAMPSHIRE COLL", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0887", "agencyNumber": "65004", "address1": "HAMPSHIRE COLLEGE", "address2": "BUY TKTS-COLL BOOKSTORE", "address3": "BUS STOP-ROBERT CROWNE", "address4": "CTR", "zipCode": "01002", "phoneNumber": "4135595444", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.377, "longitude": -72.469, "originFlag": false, "willCall": false, "hours": null }, { "code": "060060", "city": "HARTFORD", "state": "CT", "country": "US", "stateNumber": "06", "cityNumber": "0060", "agencyNumber": "00604", "address1": "HARTFORD BUS TERM", "address2": "1 UNION PL", "address3": "*", "address4": "* ELIEEN OLIVA", "zipCode": "06103", "phoneNumber": "8607247080", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 41.767, "longitude": -72.675, "originFlag": true, "willCall": true, "hours": null }, { "code": "043054", "city": "HOLYOKE", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "3054", "agencyNumber": "03587", "address1": "HOLYOKE INTERMODAL", "address2": "206 MAPLE ST", "address3": "*", "address4": "*", "zipCode": "01040", "phoneNumber": null, "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.203, "longitude": -72.631, "originFlag": false, "willCall": false, "hours": null }, { "code": "042845", "city": "HOLYOKE MALL", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "2845", "agencyNumber": "65015", "address1": "HOLYOKE MALL", "address2": "50 HOLYOKE ST", "address3": null, "address4": null, "zipCode": "01040", "phoneNumber": "4135361440", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.203, "longitude": -72.631, "originFlag": false, "willCall": false, "hours": null }, { "code": "040183", "city": "HYANNIS", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0183", "agencyNumber": "03642", "address1": "PLYMOUTH & BROCKTON TERM", "address2": "215 IVANNOUGH RD", "address3": null, "address4": null, "zipCode": "02601", "phoneNumber": "5087460378", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 41.652, "longitude": -70.295, "originFlag": false, "willCall": false, "hours": null }, { "code": "040050", "city": "LEE PREMIUM OUTLETS", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0050", "agencyNumber": "00000", "address1": null, "address2": null, "address3": null, "address4": null, "zipCode": "01238", "phoneNumber": null, "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.301, "longitude": -73.232, "originFlag": false, "willCall": false, "hours": null }, { "code": "040205", "city": "LENOX", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0205", "agencyNumber": "61012", "address1": "VILLAGE PHARMACY", "address2": "5 WALKER ST", "address3": null, "address4": null, "zipCode": "01240", "phoneNumber": "4136374700", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.363, "longitude": -73.273, "originFlag": false, "willCall": false, "hours": null }, { "code": "042670", "city": "LEOMINSTER", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "2670", "agencyNumber": "65016", "address1": "*", "address2": "528 N MAIN ST", "address3": null, "address4": null, "zipCode": "01453", "phoneNumber": "9788400459", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.527, "longitude": -71.756, "originFlag": false, "willCall": false, "hours": null }, { "code": "040227", "city": "LOWELL", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0227", "agencyNumber": "00329", "address1": "REGIONAL TRANSIT CTR", "address2": "101 THORNDIKE ST", "address3": "*", "address4": "* JOHN PETROS", "zipCode": "01852", "phoneNumber": "9787352766", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.634, "longitude": -71.298, "originFlag": false, "willCall": false, "hours": null }, { "code": "020013", "city": "MANCHESTER", "state": "NH", "country": "US", "stateNumber": "02", "cityNumber": "0013", "agencyNumber": "00326", "address1": "BOSTON EXPRESS", "address2": "119 CANAL ST", "address3": "*", "address4": "*", "zipCode": "03101", "phoneNumber": "6036686133", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.991, "longitude": -71.467, "originFlag": false, "willCall": true, "hours": null }, { "code": "060041", "city": "MANSFIELD", "state": "CT", "country": "US", "stateNumber": "06", "cityNumber": "0041", "agencyNumber": "00000", "address1": null, "address2": null, "address3": null, "address4": null, "zipCode": "06250", "phoneNumber": null, "timeZone": "America/New_York", "dstUse": "Y", "latitude": 41.767, "longitude": -72.197, "originFlag": false, "willCall": false, "hours": null }, { "code": "050083", "city": "MIDDLETOWN", "state": "RI", "country": "US", "stateNumber": "05", "cityNumber": "0083", "agencyNumber": "00000", "address1": null, "address2": null, "address3": null, "address4": null, "zipCode": "02840", "phoneNumber": null, "timeZone": "America/New_York", "dstUse": "Y", "latitude": 41.476, "longitude": -71.31, "originFlag": false, "willCall": false, "hours": null }, { "code": "160490", "city": "MT LAUREL", "state": "NJ", "country": "US", "stateNumber": "16", "cityNumber": "0490", "agencyNumber": "07648", "address1": "MT LAUREL GREYHOUND STA", "address2": "538 FELLOWSHIP RD", "address3": "*", "address4": "* HOWARD NICE", "zipCode": "08054", "phoneNumber": "8562353053", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 39.956, "longitude": -74.92, "originFlag": true, "willCall": true, "hours": null }, { "code": "020152", "city": "NASHUA", "state": "NH", "country": "US", "stateNumber": "02", "cityNumber": "0152", "agencyNumber": "00327", "address1": "BOSTON EXPRESS", "address2": "8 N SOUTHWOOD DR", "address3": "*", "address4": "*BENJAMIN BLUNT", "zipCode": "03063", "phoneNumber": null, "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.758, "longitude": -71.469, "originFlag": true, "willCall": true, "hours": null }, { "code": "160182", "city": "NEWARK", "state": "NJ", "country": "US", "stateNumber": "16", "cityNumber": "0182", "agencyNumber": "01603", "address1": "NEWARK BUS STATION", "address2": "1 PENN RR STATION", "address3": "*", "address4": null, "zipCode": "07102", "phoneNumber": "9736226740", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 40.733, "longitude": -74.174, "originFlag": true, "willCall": true, "hours": null }, { "code": "040250", "city": "NEW BEDFORD", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0250", "agencyNumber": "03649", "address1": "SRTA TERMINAL", "address2": "134 ELM ST", "address3": null, "address4": null, "zipCode": "02740", "phoneNumber": "5089995211", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 41.635, "longitude": -70.942, "originFlag": false, "willCall": false, "hours": null }, { "code": "060104", "city": "NEW BRITAIN", "state": "CT", "country": "US", "stateNumber": "06", "cityNumber": "0104", "agencyNumber": "05494", "address1": "JIMMYS FOOD MART", "address2": "64 W MAIN ST", "address3": "*", "address4": "*", "zipCode": "06051", "phoneNumber": "8602292074", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 41.666, "longitude": -72.783, "originFlag": true, "willCall": true, "hours": null }, { "code": "190531", "city": "NEW CARROLLTON", "state": "MD", "country": "US", "stateNumber": "19", "cityNumber": "0531", "agencyNumber": "00518", "address1": "CARROLLTON BUS STATION", "address2": "4700 GARDEN CITY DR JCT", "address3": "US 50 & 495", "address4": "HYATTSVILLE, MD", "zipCode": "20784", "phoneNumber": "3017313057", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 38.947, "longitude": -76.871, "originFlag": true, "willCall": true, "hours": null }, { "code": "060115", "city": "NEW HAVEN", "state": "CT", "country": "US", "stateNumber": "06", "cityNumber": "0115", "agencyNumber": "09950", "address1": "NEW HAVEN BUS STATION", "address2": "50 UNION AVE", "address3": "*", "address4": "*", "zipCode": "06519", "phoneNumber": "2037722470", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 41.297, "longitude": -72.926, "originFlag": true, "willCall": true, "hours": null }, { "code": "050017", "city": "NEWPORT", "state": "RI", "country": "US", "stateNumber": "05", "cityNumber": "0017", "agencyNumber": "03652", "address1": "BONANZA BUS LINES", "address2": "23 AMERICANS CUP AVE", "address3": null, "address4": null, "zipCode": "02840", "phoneNumber": "4018461820", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 41.476, "longitude": -71.31, "originFlag": false, "willCall": false, "hours": null }, { "code": "151239", "city": "NEW YORK", "state": "NY", "country": "US", "stateNumber": "15", "cityNumber": "1239", "agencyNumber": "01530", "address1": "PORT AUTHORITY", "address2": "625 8TH AVE", "address3": "*", "address4": "*", "zipCode": "10018", "phoneNumber": "2129716789", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 40.757, "longitude": -73.993, "originFlag": true, "willCall": true, "hours": null }, { "code": "040293", "city": "NORTHAMPTON", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0293", "agencyNumber": "06948", "address1": "PETER PAN BUS LINE", "address2": "1 ROUNDHOUSE PLZ", "address3": "STE 2", "address4": null, "zipCode": "01060", "phoneNumber": "4135861030", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.331, "longitude": -72.675, "originFlag": false, "willCall": true, "hours": null }, { "code": "171127", "city": "PHILADELPHIA", "state": "PA", "country": "US", "stateNumber": "17", "cityNumber": "1127", "agencyNumber": "01715", "address1": "PHILADELPHIA GREYHOUND", "address2": "1001 FILBERT ST", "address3": "*", "address4": "* ROD GIBSON", "zipCode": "19107", "phoneNumber": "2159314075", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 39.951, "longitude": -75.159, "originFlag": true, "willCall": true, "hours": null }, { "code": "040315", "city": "PITTSFIELD", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0315", "agencyNumber": "00932", "address1": "BERKSHIRE REG INTERMODAL", "address2": "1 COLUMBUS AVE", "address3": null, "address4": null, "zipCode": "01201", "phoneNumber": "4136292864", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.455, "longitude": -73.25, "originFlag": false, "willCall": false, "hours": null }, { "code": "050094", "city": "PORTSMOUTH", "state": "RI", "country": "US", "stateNumber": "05", "cityNumber": "0094", "agencyNumber": "00000", "address1": null, "address2": null, "address3": null, "address4": null, "zipCode": "02871", "phoneNumber": null, "timeZone": "America/New_York", "dstUse": "Y", "latitude": 41.577, "longitude": -71.265, "originFlag": false, "willCall": false, "hours": null }, { "code": "050138", "city": "PROVIDENCE BUS TERMINAL", "state": "RI", "country": "US", "stateNumber": "05", "cityNumber": "0138", "agencyNumber": "00522", "address1": "BONANZA BUS LINES", "address2": "1 BONANZA WAY", "address3": null, "address4": null, "zipCode": "02904", "phoneNumber": "4013317500", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 41.833, "longitude": -71.438, "originFlag": false, "willCall": false, "hours": null }, { "code": "050127", "city": "PROVIDENCE DOWNTOWN", "state": "RI", "country": "US", "stateNumber": "05", "cityNumber": "0127", "agencyNumber": "00000", "address1": null, "address2": null, "address3": null, "address4": null, "zipCode": "02901", "phoneNumber": null, "timeZone": "America/New_York", "dstUse": "Y", "latitude": 41.826, "longitude": -71.411, "originFlag": false, "willCall": false, "hours": null }, { "code": "040513", "city": "SHEFFIELD", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0513", "agencyNumber": "00000", "address1": null, "address2": null, "address3": null, "address4": null, "zipCode": "01257", "phoneNumber": null, "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.078, "longitude": -73.395, "originFlag": false, "willCall": false, "hours": null }, { "code": "190333", "city": "SILVER SPRING", "state": "MD", "country": "US", "stateNumber": "19", "cityNumber": "0333", "agencyNumber": "06904", "address1": "SILVER SPRING BUS STATION", "address2": "8100 FENTON ST", "address3": "*", "address4": "*", "zipCode": "20910", "phoneNumber": "3015885110", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 38.99, "longitude": -77.024, "originFlag": true, "willCall": true, "hours": null }, { "code": "040085", "city": "SOMERSET PARK", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0085", "agencyNumber": "00000", "address1": null, "address2": null, "address3": null, "address4": null, "zipCode": "02726", "phoneNumber": null, "timeZone": "America/New_York", "dstUse": "Y", "latitude": 41.723, "longitude": -71.177, "originFlag": false, "willCall": false, "hours": null }, { "code": "060160", "city": "SOUTHBURY", "state": "CT", "country": "US", "stateNumber": "06", "cityNumber": "0160", "agencyNumber": "08894", "address1": "CROWNE PLAZA HOTEL", "address2": "1284 STRONGTOWN RD", "address3": null, "address4": null, "zipCode": "06488", "phoneNumber": null, "timeZone": "America/New_York", "dstUse": "Y", "latitude": 41.473, "longitude": -73.221, "originFlag": false, "willCall": false, "hours": null }, { "code": "040579", "city": "SOUTH HADLEY", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0579", "agencyNumber": "03588", "address1": "CRAZY MOON FASHION CO", "address2": "21 COLL ST", "address3": null, "address4": null, "zipCode": "01075", "phoneNumber": "4135348108", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.253, "longitude": -72.58, "originFlag": false, "willCall": false, "hours": null }, { "code": "040359", "city": "SPRINGFIELD", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0359", "agencyNumber": "06945", "address1": "SPRINGFIELD BUS STA", "address2": "1776 MAIN ST", "address3": "*PO BOX 1776", "address4": "*", "zipCode": "01103", "phoneNumber": "8002378747", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.105, "longitude": -72.596, "originFlag": true, "willCall": true, "hours": null }, { "code": "041921", "city": "SPRINGFIELD UMASS", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "1921", "agencyNumber": "00000", "address1": null, "address2": null, "address3": null, "address4": null, "zipCode": "01115", "phoneNumber": null, "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.106, "longitude": -72.597, "originFlag": false, "willCall": false, "hours": null }, { "code": "040360", "city": "STOCKBRIDGE", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0360", "agencyNumber": "61025", "address1": "INFORMATION BOOTH", "address2": "MAIN ST", "address3": "*PO BOX 738", "address4": null, "zipCode": "01262", "phoneNumber": "8883317500", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.028, "longitude": -73.031, "originFlag": false, "willCall": false, "hours": null }, { "code": "060544", "city": "STORRS UCONN", "state": "CT", "country": "US", "stateNumber": "06", "cityNumber": "0544", "agencyNumber": "03657", "address1": "UCONN COOP BOOKSTORE", "address2": "2075 HILLSIDE RD", "address3": "PO BOX 1019", "address4": null, "zipCode": "06268", "phoneNumber": "8604863537", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 41.794, "longitude": -72.251, "originFlag": false, "willCall": false, "hours": null }, { "code": "040370", "city": "STURBRIDGE", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0370", "agencyNumber": "65023", "address1": "OLD STURBRIDGE VISTOR CNT", "address2": "1 OLD STURBRIDGE VILLAGE", "address3": "BUS STOP ONLY", "address4": "ONLINE TICKETS AVAILABLE", "zipCode": "01566", "phoneNumber": null, "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.11, "longitude": -72.077, "originFlag": false, "willCall": false, "hours": null }, { "code": "040118", "city": "TAUNTON GALLERIA MALL", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0118", "agencyNumber": "00000", "address1": null, "address2": null, "address3": null, "address4": null, "zipCode": "02718", "phoneNumber": null, "timeZone": "America/New_York", "dstUse": "Y", "latitude": 41.883, "longitude": -71.031, "originFlag": false, "willCall": false, "hours": null }, { "code": "050012", "city": "TF GREEN ARPT", "state": "RI", "country": "US", "stateNumber": "05", "cityNumber": "0012", "agencyNumber": "00000", "address1": null, "address2": null, "address3": null, "address4": null, "zipCode": "02901", "phoneNumber": null, "timeZone": "America/New_York", "dstUse": "Y", "latitude": 41.826, "longitude": -71.411, "originFlag": false, "willCall": false, "hours": null }, { "code": "060489", "city": "TORRINGTON", "state": "CT", "country": "US", "stateNumber": "06", "cityNumber": "0489", "agencyNumber": "00000", "address1": null, "address2": null, "address3": null, "address4": null, "zipCode": "06790", "phoneNumber": null, "timeZone": "America/New_York", "dstUse": "Y", "latitude": 41.813, "longitude": -73.118, "originFlag": false, "willCall": false, "hours": null }, { "code": "041790", "city": "WAREHAM", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "1790", "agencyNumber": "61000", "address1": "PARK & RIDE COMMUTER LOT", "address2": "ROUTE 25", "address3": null, "address4": null, "zipCode": "02571", "phoneNumber": null, "timeZone": "America/New_York", "dstUse": "Y", "latitude": 41.75, "longitude": -70.71, "originFlag": false, "willCall": false, "hours": null }, { "code": "320012", "city": "WASHINGTON", "state": "DC", "country": "US", "stateNumber": "32", "cityNumber": "0012", "agencyNumber": "03206", "address1": "UNION STATION", "address2": "50 MASSACHUSETTS AVE NE", "address3": "*", "address4": "*", "zipCode": "20002", "phoneNumber": "2022895141", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 38.904, "longitude": -76.991, "originFlag": true, "willCall": true, "hours": null }, { "code": "060192", "city": "WATERBURY", "state": "CT", "country": "US", "stateNumber": "06", "cityNumber": "0192", "agencyNumber": "05501", "address1": "WATERBURY TRVL CTR", "address2": "188 BANK ST", "address3": null, "address4": null, "zipCode": "06702", "phoneNumber": "2037552700", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 41.553, "longitude": -73.041, "originFlag": false, "willCall": false, "hours": null }, { "code": "040414", "city": "WILLIAMSTOWN", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0414", "agencyNumber": "03658", "address1": "WILLIAMS INN", "address2": "1090 MAIN ST", "address3": "RTS 2 & 7 MAIN ST", "address4": null, "zipCode": "01267", "phoneNumber": "4134582665", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.714, "longitude": -73.21, "originFlag": false, "willCall": false, "hours": null }, { "code": "180060", "city": "WILMINGTON", "state": "DE", "country": "US", "stateNumber": "18", "cityNumber": "0060", "agencyNumber": "05511", "address1": "WILMINGTON BUS STATION", "address2": "101 N FRENCH", "address3": "*", "address4": "*", "zipCode": "19801", "phoneNumber": "3026556111", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 39.737, "longitude": -75.551, "originFlag": true, "willCall": true, "hours": null }, { "code": "060324", "city": "WINSTED", "state": "CT", "country": "US", "stateNumber": "06", "cityNumber": "0324", "agencyNumber": "61033", "address1": "BEAR CLAW COFFEE HOUSE", "address2": "314 MAIN ST", "address3": "BUS STOP ONLY", "address4": null, "zipCode": "06098", "phoneNumber": null, "timeZone": "America/New_York", "dstUse": "Y", "latitude": 41.955, "longitude": -73.076, "originFlag": false, "willCall": false, "hours": null }, { "code": "040436", "city": "WOODS HOLE", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0436", "agencyNumber": "61032", "address1": "STEAMSHIP AUTHORITY PIERS", "address2": "1 COWDRY RD", "address3": null, "address4": null, "zipCode": "02543", "phoneNumber": "5085485011", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 41.522, "longitude": -70.669, "originFlag": false, "willCall": false, "hours": null }, { "code": "040447", "city": "WORCESTER", "state": "MA", "country": "US", "stateNumber": "04", "cityNumber": "0447", "agencyNumber": "06949", "address1": "UNION STA", "address2": "2 WASHINGTON SQ", "address3": "*", "address4": "*", "zipCode": "01608", "phoneNumber": "5087541102", "timeZone": "America/New_York", "dstUse": "Y", "latitude": 42.261, "longitude": -71.802, "originFlag": true, "willCall": true, "hours": null }];

    var date1 = parseDate(params['trips'][0]['date1']);
    var dDate = date1['month'] + date1['date'];

    var sFrom = params['trips'][0]['from_city_name'];
    var temp = sFrom.split(' ');
    for (var i = 0; i < temp.length; i++) {
        temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1, temp[i].length);
    }
    sFrom = temp.join(' ');
    for (var i = 0; i < dest.length; i++) {
        console.log(sFrom);
        if (dest[i]["city"].toLowerCase() === sFrom.toLowerCase()) {
            var sFrom_code = dest[i]["code"];
        }
    }

    var sTo = params['trips'][0]['to_city_name'];
    var temp = sTo.split(' ');
    for (var i = 0; i < temp.length; i++) {
        temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1, temp[i].length);
    }
    sTo = temp.join(' ');
    var sTo_code = params['trips'][0]['to_city_code'];
    for (var i = 0; i < dest.length; i++) {
        if (dest[i]["city"].toLowerCase() === sTo.toLowerCase()) {
            var sTo_code = dest[i]["code"];
        }
    }

    var adult = params['people_dict']['adult'];
    var child = params['people_dict']['child'];


    var data = {
        'ada': false,
        'adults': parseInt(adult),
        'child2': parseInt(child),
        'child5': 0,
        'departDate': dDate,
        'destination': sTo_code,
        'origin': sFrom_code,
        'returnDate': null,
        'seniors': 0
    };
    console.log(data);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://tdsframe.peterpanbus.com/ppb/rest/mobile/trip/3743/search?c=US&ap=oasis");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 201) {
            var resp = JSON.parse(xhr.responseText);
            // console.log(resp["location"]);
            // return resp["location"];
            document.getElementById('output').innerHTML = '<a href="' + resp["location"] + '" target="_blank">' + resp["location"] + '</a>';
        }
    };
}