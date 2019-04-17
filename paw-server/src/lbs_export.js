let mysql = require('mysql')
let geohash = require('ngeohash')

function getNowFormatDate() {
    let date = new Date();
    let seperator1 = "-";
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    let currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

let connection = mysql.createConnection({
    port: '3306',
    user: 'root',
    password: 'whz18267590821',
    database: 'paw'
})
connection.connect()
let userName = 'admin'
const points = [{
    "lnglat": ["113.864691", "22.942327"]
}, {
    "lnglat": ["113.370643", "22.938827"]
}, {
    "lnglat": ["112.985037", "23.15046"]
}, {
    "lnglat": ["110.361899", "20.026695"]
}, {
    "lnglat": ["121.434529", "31.215641"]
}, {
    "lnglat": ["120.682502", "28.011099"]
}, {
    "lnglat": ["126.687123", "45.787618"]
}, {
    "lnglat": ["103.970724", "30.397931"]
}, {
    "lnglat": ["117.212164", "31.831641"]
}, {
    "lnglat": ["121.411101", "31.059407"]
}, {
    "lnglat": ["104.137953", "30.784276"]
}, {
    "lnglat": ["120.499683", "30.042305"]
}, {
    "lnglat": ["108.94686", "34.362975"]
}, {
    "lnglat": ["112.873295", "22.920901"]
}, {
    "lnglat": ["113.373916", "23.086728"]
}, {
    "lnglat": ["113.250159", "23.075847"]
}, {
    "lnglat": ["116.675933", "39.986343"]
}, {
    "lnglat": ["120.75997", "31.734934"]
}, {
    "lnglat": ["118.314741", "32.26999"]
}, {
    "lnglat": ["111.723311", "34.771838"]
}, {
    "lnglat": ["119.537126", "26.200017"]
}, {
    "lnglat": ["113.830123", "23.00734"]
}, {
    "lnglat": ["119.273795", "26.060002"]
}, {
    "lnglat": ["116.466752", "39.951042"]
}, {
    "lnglat": ["114.20716", "22.777829"]
}, {
    "lnglat": ["126.118338", "45.11481"]
}, {
    "lnglat": ["116.366324", "39.781077"]
}, {
    "lnglat": ["120.377998", "31.578216"]
}, {
    "lnglat": ["116.611935", "23.66941"]
}, {
    "lnglat": ["103.787344", "30.940037"]
}, {
    "lnglat": ["112.911223", "23.164952"]
}, {
    "lnglat": ["121.946335", "39.403784"]
}, {
    "lnglat": ["120.172545", "36.009391"]
}, {
    "lnglat": ["126.609854", "45.722514"]
}, {
    "lnglat": ["120.531699", "32.402873"]
}, {
    "lnglat": ["118.914313", "32.013572"]
}, {
    "lnglat": ["126.597762", "45.739299"]
}, {
    "lnglat": ["106.540999", "29.520217"]
}, {
    "lnglat": ["114.033057", "22.733424"]
}, {
    "lnglat": ["104.041129", "30.598338"]
}, {
    "lnglat": ["119.917693", "32.484184"]
}, {
    "lnglat": ["118.371124", "35.082682"]
}, {
    "lnglat": ["120.926368", "31.320681"]
}, {
    "lnglat": ["120.355238", "31.557524"]
}, {
    "lnglat": ["101.775209", "36.614975"]
}, {
    "lnglat": ["114.499404", "34.646022"]
}, {
    "lnglat": ["118.087516", "24.474988"]
}, {
    "lnglat": ["104.638952", "30.1253"]
}, {
    "lnglat": ["116.492237", "39.991802"]
}, {
    "lnglat": ["112.898903", "32.04371"]
}, {
    "lnglat": ["114.104018", "22.626803"]
}, {
    "lnglat": ["119.969664", "30.26186"]
}, {
    "lnglat": ["119.530013", "39.935889"]
}, {
    "lnglat": ["77.254607", "39.050215"]
}, {
    "lnglat": ["117.085608", "36.652113"]
}, {
    "lnglat": ["120.292808", "30.299244"]
}, {
    "lnglat": ["114.397917", "23.545706"]
}, {
    "lnglat": ["120.273933", "30.236666"]
}, {
    "lnglat": ["121.622443", "31.152955"]
}, {
    "lnglat": ["116.417093", "39.96918"]
}, {
    "lnglat": ["113.799453", "22.724031"]
}, {
    "lnglat": ["123.264175", "41.768478"]
}, {
    "lnglat": ["120.626128", "30.822477"]
}, {
    "lnglat": ["115.826361", "33.812392"]
}, {
    "lnglat": ["106.561797", "26.579832"]
}, {
    "lnglat": ["117.285766", "34.806079"]
}, {
    "lnglat": ["111.035766", "21.535775"]
}, {
    "lnglat": ["115.701728", "24.066784"]
}, {
    "lnglat": ["104.061447", "30.67089"]
}, {
    "lnglat": ["121.123465", "31.134162"]
}, {
    "lnglat": ["104.039519", "30.719365"]
}, {
    "lnglat": ["116.625662", "39.619879"]
}, {
    "lnglat": ["108.20204", "28.004321"]
}, {
    "lnglat": ["113.606513", "34.807402"]
}, {
    "lnglat": ["120.213822", "30.112851"]
}, {
    "lnglat": ["120.727637", "27.798264"]
}, {
    "lnglat": ["116.452761", "39.951122"]
}, {
    "lnglat": ["119.555363", "39.932751"]
}, {
    "lnglat": ["120.227111", "30.347169"]
}, {
    "lnglat": ["113.377157", "31.797137"]
}, {
    "lnglat": ["113.334007", "23.107744"]
}, {
    "lnglat": ["112.641848", "22.362319"]
}, {
    "lnglat": ["102.672195", "24.974215"]
}]

for (let i = 0; i < points.length; i++) {
    let lng = points[i]['lnglat'][0]
    let lat = points[i]['lnglat'][1]
    let sql = 'INSERT INTO lbs (lbs_lng,lbs_lat,lbs_author,lbs_geohash,lbs_create_time) VALUES ("' + lng + '","' + lat + '","' + userName + '","' + geohash.encode(lat, lng) + '","' + getNowFormatDate() + '")'
    connection.query(sql, (err, result, fields) => {
        
    })
}
connection.end()