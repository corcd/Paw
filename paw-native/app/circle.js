function waterfall(parent, data) {
    for (i = 0; i < data.length; i++) {
        let oCard = document.createElement('div')
        oCard.className = 'card'

        let oBody = document.createElement('div')
        oBody.className = 'card-body'
        oCard.appendChild(oBody)

        let oHeader = document.createElement('div')
        oHeader.className = 'header'
        let oAuthor = document.createElement('div')
        oAuthor.className = 'author'
        let oAuthorImg = document.createElement('img')
        oAuthorImg.className = 'author-photo'
        oAuthorImg.id = 'author-photo'
        oAuthorImg.src = '../assets/32856376.jpeg'
        let oAuthorName = document.createElement('span')
        oAuthorName.className = 'author-name'
        oAuthorName.id = 'author-name'
        oAuthorName.innerText = data[i].article_author
        oAuthor.appendChild(oAuthorImg)
        oAuthor.appendChild(oAuthorName)
        let oDate = document.createElement('span')
        oDate.className = 'trend-date'
        oDate.innerText = data[i].article_create_time
        oHeader.appendChild(oAuthor)
        oHeader.appendChild(oDate)

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
        let oDiv_3 = document.createElement('div')
        if (data[i].article_img_1) {
            let oImg1 = document.createElement('img')
            oImg1.id = 'img_1'
            oImg1.src = data[i].article_img_1
            oDiv_3.appendChild(oImg1)
        }
        if (data[i].article_img_2) {
            let oImg2 = document.createElement('img')
            oImg2.id = 'img_2'
            oImg2.src = data[i].article_img_2
            oDiv_3.appendChild(oImg2)
        }
        if (data[i].article_img_3) {
            let oImg3 = document.createElement('img')
            oImg3.id = 'img_3'
            oImg3.src = data[i].article_img_3
            oDiv_3.appendChild(oImg3)
        }
        oContent.appendChild(oDiv_1)
        oContent.appendChild(oDiv_2)
        oContent.appendChild(oDiv_3)


        let oFooter = document.createElement('div')
        oFooter.className = 'footer'
        let oControl = document.createElement('div')
        oControl.className = 'trend-control'
        if (data[i].article_label) {
            let oSpan = document.createElement('span')
            oSpan.className = 'badge badge-secondary'
            oSpan.innerText = data[i].article_label
            oControl.appendChild(oSpan)
        }
        let oBtnGroup = document.createElement('div')
        oBtnGroup.className = 'btn-group btn-trend'
        oControl.appendChild(oBtnGroup)
        let oBtn_1 = document.createElement('button')
        oBtn_1.className = 'btn btn-default'
        oBtn_1.id = data[i].article_id
        oBtn_1.addEventListener('click', (e) => {
            let ID = e.target.id
            console.info('点赞 ID:' + ID)
            $.ajax({
                type: 'POST',
                url: 'http://localhost:8081/handle',
                data: {
                    'handler': 'Pop',
                    'id': ID
                },
                dataType: 'json',
                success: (result) => {
                    if (result.code == 1) {
                        console.log(result.data)
                        oBtn_1.innerText = result.data[0].article_pop + '点赞'
                    } else {
                        console.log(result)
                    }
                },
                error: (err) => {
                    console.log(err)
                }
            })
        })
        oBtn_1.innerText = data[i].article_pop + '点赞'
        let oBtn_2 = document.createElement('button')
        oBtn_2.className = 'btn btn-default'
        oBtn_2.id = data[i].article_id
        oBtn_2.innerText = '分享'
        oBtnGroup.appendChild(oBtn_1)
        oBtnGroup.appendChild(oBtn_2)
        oFooter.appendChild(oControl)

        oBody.appendChild(oHeader)
        oBody.appendChild(oContent)
        oBody.appendChild(oFooter)

        parent.appendChild(oCard)
        console.info('添加')
    }
}

function getInfo() {

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

window.onload = () => {
    let parent = document.getElementById('container')
    let data = new Array()
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8081/trends',
        // xhrFields: {
        //     withCredentials: true
        // },
        success: (result) => {
            if (result.code == 1) {
                data = result.data
                console.log(data)
                waterfall(parent, data)
            } else {
                console.log(result)
            }
        },
        error: (err) => {
            console.log(err)
        }
    })
}
/* ************************************************** */
// $('body').on('touchmove', (e) => {
//     e.preventDefault();
// })

$('#btn-tab-discover').on('click', (e) => {
    console.info('发现')
    window.location.href = "discover.html"
})