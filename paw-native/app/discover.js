//discover
let map
let center = []
let cluster, markers = []


function mapInit(map) {
    map.plugin('AMap.Geolocation', () => {
        let geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, //是否使用高精度定位，默认:true
            timeout: 10000, //超过10秒后停止定位，默认：5s
            zoomToAccuracy: true, //定位成功后是否自动调整地图视野到定位点
            showMarker: true, //是否显示定位点
            markerOptions: { //自定义定位点样式，同Marker的Options
                offset: new AMap.Pixel(-18, -36),
                content: '<img src="https://a.amap.com/jsapi_demos/static/resource/img/user.png" style="width:36px;height:36px"/>'
            },
            showCircle: true, //是否显示定位精度圈
            circleOptions: { //定位精度圈的样式
                strokeColor: '#0093FF',
                noSelect: true,
                strokeOpacity: 0.25,
                strokeWeight: 1,
                fillColor: '#02B0FF',
                fillOpacity: 0.05
            }
        })
        map.addControl(geolocation);
        geolocation.getCurrentPosition((status, result) => {
            if (status == 'complete') {
                onComplete(result)
            } else {
                onError(result)
            }
        })
    })
    pinInit(map)
}

//IP定位
function showCityInfo(map) {
    //实例化城市查询类
    let citysearch = new AMap.CitySearch()
    //自动获取用户IP，返回当前城市
    citysearch.getLocalCity((status, result) => {
        if (status === 'complete' && result.info === 'OK') {
            if (result && result.city && result.bounds) {
                let cityinfo = result.city
                let citybounds = result.bounds
                console.info('您当前所在城市：' + cityinfo)
                //地图显示当前城市
                map.setBounds(citybounds)
            }
        } else {
            console.info(result.info)
        }
    })
}

function pinInit(map) {
    let center = map.getCenter()
    if (center) {
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8081/pin',
            data: {
                'lng': center.lng,
                'lat': center.lat,
                'zoom': Math.floor(map.getZoom() / 20 * 8)
            },
            dataType: 'json',
            // xhrFields: {
            //     withCredentials: true
            // },
            success: (result) => {
                if (result.code == 1) {
                    console.log(result.data.length, result.data)
                    mapChange(map, result.data)
                } else {
                    console.log(result)
                }
            },
            error: (err) => {
                console.log(err)
            }
        })
    } else {
        $('#lintModalLabel').text('定位失败')
        $('#lint-text').text('请开启定位权限')
        $('#lintModal').modal('show')
    }
}

//点数组初始化
function mapChange(map, points) {
    markers = []
    //点筛选
    for (let i = 0; i < points.length; i++) {
        //let diff_X = Math.abs(parseFloat(points[i]['lnglat'][0]) - parseFloat(map.getCenter().lng));
        //let diff_Y = Math.abs(parseFloat(points[i]['lnglat'][1]) - parseFloat(map.getCenter().lat));

        let lnglat = new AMap.LngLat(points[i]['lbs_lng'], points[i]['lbs_lat'])

        let temp = new AMap.Marker({
            position: lnglat,
            content: '<div style="background-color: rgb(255, 255, 255); height: 20px; width: 20px; border: 1px solid rgb(255, 255, 255); border-radius: 12px; box-shadow: rgb(158, 158, 158) 0px 1px 4px; margin: 0px 0 0 0px;"></div><div style="background-color: rgb(82, 150, 243); height: 16px; width: 16px; border: 1px solid rgb(82, 150, 243); border-radius: 15px; box-shadow: rgb(158, 158, 158) 0px 0px 2px; margin: -18px 0 0 2px; "></div>',
            offset: new AMap.Pixel(-15, -15),
            extData: points[i]['lbs_content'],
            author: points[i]['lbs_author'],
            title: points[i]['lbs_title'],
            time: points[i]['lbs_create_time']
        })
        //temp.on('click', markerClick);
        clickListener = AMap.event.addListener(temp, "click", (e) => {
            console.log(e.target.B)
            map.setCenter([e.lnglat.getLng(), e.lnglat.getLat()])
            $('#abstract').text(e.target.getExtData())
            $('#content-container').slideToggle(500)
            $('#examine').on('click', () => {
                $('#contentModalLabel').text(e.target.B.title)
                $('#content-author').text('作者:' + e.target.B.author)
                $('#content-time').text('时间:' + e.target.B.time)
                $('#content-content').text('内容:' + e.target.getExtData())
                $('#contentModal').modal('show')
            })
            console.info('显示详情')
        })
        markers.push(temp)
    }
    let count = markers.length
    console.log(count)
    //聚合点样式
    var _renderCluserMarker = (context) => {
        let factor = Math.pow(context.count / count, 1 / 15)
        let div = document.createElement('div')
        let Hue = 360 - factor * 180
        let bgColor = 'hsla(' + Hue + ',100%,50%,0.5)'
        let fontColor = 'hsla(' + Hue + ',100%,20%,1)'
        let borderColor = 'hsla(' + Hue + ',100%,40%,1)'
        let shadowColor = 'hsla(' + Hue + ',100%,50%,1)'
        div.style.backgroundColor = bgColor
        let size = Math.round(30 + Math.pow(context.count / count, 1 / 15))
        div.style.width = div.style.height = size + 'px'
        div.style.border = 'solid 0px ' + borderColor
        div.style.borderRadius = size / 2 + 'px'
        div.style.boxShadow = '0 0 1px ' + shadowColor
        div.innerHTML = context.count
        div.style.lineHeight = size + 'px'
        div.style.color = fontColor
        div.style.fontSize = '14px'
        div.style.textAlign = 'center'
        context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2))
        context.marker.setContent(div)
    }
    //绘制点与聚合点
    addCluster(2, _renderCluserMarker)
    //map.setFitView();
}

//新图钉
function newPin(map, title, text) {
    let center = map.getCenter()
    if (center && title && text) {
        marker = new AMap.Marker({
            icon: "http://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png",
            position: [center.lng, center.lat],
            offset: new AMap.Pixel(-12, -30) //img: w/h=0.77
        })
        marker.setMap(map)

        $.ajax({
            type: 'POST',
            url: 'http://localhost:8081/handle',
            data: {
                'handler': 'addPin',
                'lng': center.lng,
                'lat': center.lat,
                'title': title,
                'text': text
            },
            dataType: 'json',
            // xhrFields: {
            //     withCredentials: true
            // },
            success: (result) => {
                if (result.code == 1) {
                    console.log(result.index.insertId)
                    $('#lint-text').text('发布成功！')
                    $('#lintModal').modal('show')
                    $('#input-container').slideToggle(500)
                    $('#pin-title').val('')
                    $('#pin-content').val('')
                } else {
                    console.log(result)
                }
            },
            error: (err) => {
                console.log(err)
            }
        })
    } else {
        $('#lint-text').text('请勿发布空白信息')
        $('#lintModal').modal('show')
    }
}

//解析定位结果
function onComplete(data) {
    console.info('定位成功')
    let str = []
    str.push('定位结果：' + data.position)
    str.push('定位类别：' + data.location_type)
    center = data.position
    if (data.accuracy) {
        str.push('精度：' + data.accuracy + ' 米')
    } //如为IP精确定位结果则没有精度信息
    str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'))
    console.info(str.join('<br>'))
}
//解析定位错误信息
function onError(data) {
    //alert('定位失败' + '失败原因排查信息:' + JSON.stringify(data))
    $('#lintModalLabel').text('定位失败')
    $('#lint-text').text('定位失败' + '失败原因排查信息:' + JSON.stringify(data))
    $('#lintModal').modal('show')
}

//点聚合
function addCluster(tag, _renderCluserMarker) {
    if (cluster) {
        cluster.setMap(null)
    }
    if (tag == 2) { //完全自定义
        map.plugin(["AMap.MarkerClusterer"], () => {
            cluster = new AMap.MarkerClusterer(map, markers, {
                gridSize: 50,
                renderCluserMarker: _renderCluserMarker
            })
        })
    } else if (tag == 1) { //自定义图标
        let sts = [{
            url: "http://a.amap.com/jsapi_demos/static/images/blue.png",
            size: new AMap.Size(32, 32),
            offset: new AMap.Pixel(-16, -16)
        }, {
            url: "http://a.amap.com/jsapi_demos/static/images/green.png",
            size: new AMap.Size(32, 32),
            offset: new AMap.Pixel(-16, -16)
        }, {
            url: "http://a.amap.com/jsapi_demos/static/images/orange.png",
            size: new AMap.Size(36, 36),
            offset: new AMap.Pixel(-18, -18)
        }, {
            url: "http://a.amap.com/jsapi_demos/static/images/red.png",
            size: new AMap.Size(48, 48),
            offset: new AMap.Pixel(-24, -24)
        }, {
            url: "http://a.amap.com/jsapi_demos/static/images/darkRed.png",
            size: new AMap.Size(48, 48),
            offset: new AMap.Pixel(-24, -24)
        }]
        map.plugin(["AMap.MarkerClusterer"], () => {
            cluster = new AMap.MarkerClusterer(map, markers, {
                styles: sts,
                gridSize: 80
            });
        })
    } else { //默认样式
        map.plugin(["AMap.MarkerClusterer"], function () {
            cluster = new AMap.MarkerClusterer(map, markers, {
                gridSize: 80
            })
        })
    }
}

// 清除 marker
function clearMarker() {
    if (marker) {
        marker.setMap(null)
        marker = null
    }
}

function pinDown(pin, map) {
    pin.setClickable(true);
    pin.setAnimation('AMAP_ANIMATION_DROP'); // 设置点标记的动画效果，此处为下坠效果
    pin.setPosition(map.getCenter()); //纠正缓动中心点位置
}

/* ************************************************** */
let username

$(document).ready(() => {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8081/status',
        // xhrFields: {
        //     withCredentials: true
        // },
        success: (result) => {
            if (result.code == 1) {
                username = result.username
            } else {
                alert('登录信息已过期')
                window.location.href = 'login.html'
            }
        },
        error: (err) => {
            console.log(err)
            alert('登录信息异常，请重新登录')
            window.location.href = 'login.html'
        }
    })
})

window.init = () => {
    map = new AMap.Map('map-container', {
        resizeEnable: true,
        zoom: 11,
        mapStyle: 'amap://styles/df8ca1a4d75753d90e48140d4fcc5399', //设置地图的显示样式
        viewMode: '2D', //设置地图模式
        lang: 'zh_cn' //设置地图语言类型
    })
    let pin = new AMap.Marker({
        map: map,
        extData: '中心点'
    })
    mapInit(map)

    map.on('dblclick', (e) => {
        map.setCenter([e.lnglat.getLng(), e.lnglat.getLat()])
    })
    map.on('moveend', (e) => {
        let newCenter = map.getCenter()
        pinDown(pin, map)
        pinInit(map)
        console.info(newCenter.lng, newCenter.lat, map.getZoom())
    })
    map.on('zoomchange', (e) => {
        pinDown(pin, map)
        pinInit(map)
    })
}

window.onbeforeunload = () => {
    console.info('closed')
    map.destroy()
}
window.onunloadcancel = () => {
    console.info('closed')
    map.destroy()
}

/* ************************************************** */
$('#btn-tab-circle').on('click', (e) => {
    console.info('圈子')
    window.location.href = "circle.html"
})

$('#details').on('click', (e) => {
    $('#content-container').slideToggle(500)
    console.info('显示详情')
})
$('#magnify').on('click', (e) => {
    map.setZoom(map.getZoom() + 1)
    //获取新 points
    pinInit(map)
    console.info('放大地图')
})
$('#newpin').on('click', (e) => {
    //newPin(map)
    $('#input-container').slideToggle(500)
    console.info('创建图钉')
})
$('#shrink').on('click', (e) => {
    map.setZoom(map.getZoom() - 1)
    //获取新 points
    pinInit(map)
    console.info('缩小地图')
})
$('#refresh').on('click', (e) => {
    mapInit(map)
    console.info('刷新地图')
})


// $('#examine').on('click', (e) => {
//     $('#content').fadeToggle(500)
//     console.info('查看详情')
// })
$('#nointerest').on('click', (e) => {
    $('#content-container').slideToggle(500)
    console.info('不感兴趣')
})

$('#publish').on('click', (e) => {
    newPin(map, $('#pin-title').val(), $('#pin-content').val())
})
$('#wait').on('click', (e) => {
    $('#input-container').slideToggle(500)
    console.info('不感兴趣')
})