function waterfall(parent, data) {
    for (i = 0; i < data.length; i++) {
        let oCard = document.createElement('div')
        oCard.className = 'card'

        let oBody = document.createElement('div')
        oBody.className = 'card-body'
        oCard.appendChild(oBody)

        let oContent = document.createElement('div')
        oContent.className = 'content'
        let oDiv_1 = document.createElement('div')
        let oH = document.createElement('h3')
        oH.id = 'title'
        oH.innerText = data[i].article_title
        oDiv_1.appendChild(oH)
        let oDiv_2 = document.createElement('div')
        let oP = document.createElement('p')
        oP.id = 'trend'
        oP.innerText = data[i].article_content
        oDiv_2.appendChild(oP)

        oContent.appendChild(oDiv_1)
        oContent.appendChild(oDiv_2)

        oBody.appendChild(oContent)

        parent.appendChild(oCard)
        console.info('添加')
    }
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

$('#btn-back').on('click', (e) => {
    console.info('返回')
    window.history.back(-1)
})

$('#btn-search').on('click', (e) => {
    console.info('搜索')
    let parent = document.getElementById('container')
    let data = new Array()
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8081/search',
        data: {
            'key': $('#search').val()
        },
        dataType: 'json',
        // xhrFields: {
        //     withCredentials: true
        // },
        success: (result) => {
            if (result.code == 1) {
                console.log(result.data)
                waterfall(parent, result.data)
            } else {
                console.log(result)
            }
        },
        error: (err) => {
            console.log(err)
        }
    })
})