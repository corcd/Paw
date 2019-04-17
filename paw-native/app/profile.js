$(document).ready(() => {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8081/status',
        // xhrFields: {
        //     withCredentials: true
        // },
        success: (result) => {
            if (result.code == 1) {
                $('#username').text(result.username)
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

$('#btn-back').on('click', (e) => {
    console.info('返回')
    window.history.back(-1)
})

$('#recommend-data').on('click', (e) => {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8081/interest',
        success: (result) => {
            console.info(result)
            $('#testModalLabel').text('推荐数据')
            $('#test-data').text('DOG:'+result.data[0].inte_dog+'  CAT:'+result.data[0].inte_cat+'  BIRD:'+result.data[0].inte_bird)
            $('#testModal').modal('show')
        },
        error: (err) => {
            console.log(err)
        }
    })
})

$('#btn-connect-test').on('click', (e) => {
    console.info('请求数据')
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8081/test',
        success: (result) => {
            console.info(result)
            $('#testModalLabel').text('连接测试')
            $('#test-data').text('Status:' + result.status)
            $('#testModal').modal('show')
        },
        error: (err) => {
            console.log(err)
        }
    })
})

$('#btn-logout').on('click', (e) => {
    $('#logoutModal').modal('show')
})

$('#btn-confirm').on('click', (e) => {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8081/logout',
        // xhrFields: {
        //     withCredentials: true
        // },
        success: (result) => {
            if (result.code == 1)
                window.location.href = 'login.html'
        },
        error: (err) => {
            console.log(err)
        }
    })
})