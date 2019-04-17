//login
$('#btn-login').on('click', (e) => {
    if ($('#username').val() && $('#password').val()) {
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8081/login',
            data: {
                'username': $('#username').val(),
                'pw': md5($('#password').val())
            },
            dataType: 'json',
            // xhrFields: {
            //     withCredentials: true
            // },
            success: (result) => {
                console.info(result)
                window.location.href = 'discover.html'
            },
            error: (err) => {
                console.log(err)
                alert('登录信息异常，请重新登录')
                window.location.href = 'login.html'
            }
        })
    } else {
        $('#lint-text').text('信息不能为空')
        $('#lintModal').modal('show')
    }
})

$('#btn-signin').on('click', (e) => {
    if ($('#username').val() && $('#password').val() && $('#re-password').val()) {
        if ($('#password').val() == $('#re-password').val()) {
            $.ajax({
                type: 'POST',
                url: 'http://localhost:8081/sign',
                data: {
                    'username': $('#username').val(),
                    'pw': md5($('#password').val())
                },
                dataType: 'json',
                // xhrFields: {
                //     withCredentials: true
                // },
                success: (result) => {
                    alert('注册成功，请重新登录')
                    window.location.href = 'login.html'
                },
                error: (err) => {
                    console.log(err)
                    alert('注册信息异常，请重新注册')
                }
            })
        } else {
            $('#lint-text').text('前后密码不一致')
            $('#lintModal').modal('show')
        }
    } else {
        $('#lint-text').text('信息不能为空')
        $('#lintModal').modal('show')
    }
})

$('#btn-backward').on('click', (e) => {
    //console.info($('#btn-backward').html())
    $('#re-password').toggle()
    $('#btn-signin').toggle()
    $('#btn-login').toggle()
    if ($('#btn-backward').html() == '还没有账户？')
        $('#btn-backward').html('返回登录')
    else
        $('#btn-backward').html('还没有账户？')
})