let express = require('express')
let mysql = require('mysql')
let bodyparser = require('body-parser')
let cookieParser = require('cookie-parser')
let session = require('express-session')
let geohash = require('ngeohash')
let app = express()

let connection = mysql.createConnection({
    port: '3306',
    user: 'root',
    password: 'whz18267590821',
    database: 'paw'
})
connection.connect()

//权衡
let se

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

function basedContent() {}

function recordTags(username, tag) {
    let sql = 'UPDATE interest SET inte_' + tag + ' = inte_' + tag + ' + 1 WHERE inte_use_if = 1 AND inte_username = "' + username + '"'
    connection.query(sql, (err, result, fields) => {})
}


app.use(bodyparser.urlencoded({
    extende: false
}))
app.use(bodyparser.json())
app.use(cookieParser())
app.use(session({
    secret: 'secret', // 对session id 相关的cookie 进行签名
    resave: true,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie: {
        maxAge: 1000 * 60 * 3, // 设置 session 的有效时间，单位毫秒
    },
}))

app.use(express.static('public'))


app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    //res.header('Access-Control-Allow-Credentials: true')
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
    next()
})

//  主页
app.get('/', (req, res) => {
    //res.sendFile( __dirname + "/public/paw-native/app/")
    res.send('hello')
})

app.get('/clear', (req, res) => {
    let sql = 'UPDATE interest SET inte_cat = 0, inte_dog = 0, inte_bird = 0 WHERE inte_use_if = 1 AND inte_username = "' + se.userName + '"'
    connection.query(sql, (err, result, fields) => {
        if (err) {
            res.sendStatus(500)
            console.log('[SELECT ERROR]:', err.message)
        } else {
            res.json({
                code: 1
            })
        }
    })
})

app.post('/sign', (req, res, next) => {
    let username = req.body.username
    let password = req.body.pw

    let sql = 'INSERT INTO user (user_name,user_pw_md5,user_create_time) VALUES ("' + username + '","' + password + '","' + getNowFormatDate() + '")'
    connection.query(sql, (err, result, fields) => {
        if (err) {
            res.sendStatus(500)
            console.log('[SELECT ERROR]:', err.message)
        } else {
            let sql_2 = 'INSERT INTO interest (inte_username) VALUES ("' + username + '")'
            connection.query(sql_2, (err, result, fields) => {
                if (err) {
                    res.sendStatus(500)
                    console.log('[SELECT ERROR]:', err.message)
                } else {
                    res.json({
                        code: 1
                    })
                }
            })
        }
    })
})

//  POST 请求
app.post('/login', (req, res, next) => {
    //接收传输过来的邮箱和密码
    let username = req.body.username
    let password = req.body.pw

    // username 和 password 
    console.log(username)
    console.log(password)

    // 连接数据库
    let sql = 'SELECT user_pw_md5 FROM user WHERE user_use_if = 1 AND user_name = "' + username + '"'
    connection.query(sql, (err, result, fields) => {
        if (err) {
            res.sendStatus(500)
            console.log('[SELECT ERROR]:', err.message)
        } else {
            if (password === result[0].user_pw_md5) {
                //登陆成功，进行页面的跳转
                console.log("登陆成功")
                // 设置session(保存用户信息)，然后前端通过<%=userinfo%>获取
                req.app.locals['userinfo'] = username
                req.session.userName = username // 登录成功，设置 session
                se = req.session
                console.info(req.session)
                res.json({
                    code: 1,
                    msg: req.app.locals['userinfo']
                })
            } else {
                res.json({
                    code: -1,
                    msg: "用户名或密码错误"
                })
                console.log("密码错误")
            }
        }
    })
})

app.post('/status', (req, res, next) => {
    req.session = se
    console.info(req.session)
    if (req.session.userName) { //判断session 状态
        res.json({
            code: 1,
            username: req.session.userName
        })
    } else {
        res.json({
            code: -1,
            username: null
        })
    }
})

app.post('/pin', (req, res, next) => {
    let lng = req.body.lng
    let lat = req.body.lat
    let zoom = req.body.zoom

    let hash = geohash.encode(lat, lng)
    let prefix = hash.substr(0, zoom)

    let neighbors = geohash.neighbors(prefix)
    neighbors.push(prefix)
    console.info(neighbors, zoom)

    let sql = 'SELECT * FROM lbs WHERE lbs_use_if = 1 AND (lbs_geohash LIKE "' + neighbors[0] + '%" OR lbs_geohash LIKE "' + neighbors[1] + '%" OR lbs_geohash LIKE "' + neighbors[2] + '%" OR lbs_geohash LIKE "' + neighbors[3] + '%" OR lbs_geohash LIKE "' + neighbors[4] + '%" OR lbs_geohash LIKE "' + neighbors[5] + '%" OR lbs_geohash LIKE "' + neighbors[6] + '%" OR lbs_geohash LIKE "' + neighbors[7] + '%" OR lbs_geohash LIKE "' + neighbors[8] + '%")'
    connection.query(sql, (err, result, fields) => {
        if (err) {
            res.sendStatus(500)
            console.log('[SELECT ERROR]:', err.message)
        } else {
            res.json({
                code: 1,
                data: result
            })
        }
    })
})

app.get('/trends', (req, res, next) => {
    let i_cat = 0
    let i_dog = 0
    let i_bird = 0
    let label = ''
    let sql_1 = 'SELECT inte_dog,inte_cat,inte_bird FROM interest WHERE inte_use_if = 1 AND inte_username = "' + se.userName + '"'
    connection.query(sql_1, (err, result, fields) => {
        if (err) {
            res.sendStatus(500)
            console.log('[SELECT ERROR]:', err.message)
        } else {
            i_cat = result[0].inte_cat
            i_dog = result[0].inte_dog
            i_bird = result[0].inte_bird

            console.log(i_cat, i_dog, i_bird)
            if (i_cat > i_dog && i_cat > i_bird && i_cat > 3) {
                label = 'cat'
            } else if (i_dog > i_cat && i_dog > i_bird && i_dog > 3) {
                label = 'dog'
            } else if (i_bird > i_cat && i_bird > i_dog && i_bird > 3) {
                label = 'bird'
            } else {
                label = ''
            }

            let sql_2
            if (label)
                sql_2 = 'SELECT * FROM article WHERE article_use_if = 1 AND article_label = "' + label + '" ORDER BY article_id DESC'
            else
                sql_2 = 'SELECT * FROM article WHERE article_use_if = 1 ORDER BY article_id DESC'

            connection.query(sql_2, (err, result, fields) => {
                if (err) {
                    res.sendStatus(500)
                    console.log('[SELECT ERROR]:', err.message)
                } else {
                    res.json({
                        code: 1,
                        data: result
                    })
                }
            })
        }
    })
})

app.post('/search', (req, res, next) => {
    let key = req.body.key
    let sql = 'SELECT article_title,article_content FROM article WHERE article_use_if = 1 AND (article_title LIKE "%' + key + '%" OR article_content LIKE "%' + key + '%" OR article_author LIKE "%' + key + '%")'
    connection.query(sql, (err, result, fields) => {
        if (err) {
            res.sendStatus(500)
            console.log('[SELECT ERROR]:', err.message)
        } else {
            res.json({
                code: 1,
                data: result
            })
        }
    })
})

app.post('/handle', (req, res, next) => {
    let handler = req.body.handler

    if (handler == 'addPin') {
        let lng = req.body.lng
        let lat = req.body.lat
        let title = req.body.title
        let text = req.body.text
        let sql = 'INSERT INTO lbs (lbs_lng,lbs_lat,lbs_title,lbs_author,lbs_content,lbs_geohash,lbs_create_time) VALUES ("' + lng + '","' + lat + '","' + title + '","' + se.userName + '","' + text + '","' + geohash.encode(lat, lng) + '","' + getNowFormatDate() + '")'
        connection.query(sql, (err, result, fields) => {
            if (err) {
                res.sendStatus(500)
                console.log('[SELECT ERROR]:', err.message)
            } else {
                res.json({
                    code: 1,
                    index: result
                })
            }
        })
    } else if (handler == 'addTrend') {
        let title = req.body.title
        let label = req.body.animal
        let text = req.body.text
        let sql = 'INSERT INTO article (article_title,article_author,article_content,article_create_time,article_label) VALUES ("' + title + '","' + se.userName + '","' + text + '","' + getNowFormatDate() + '","' + label + '")'
        connection.query(sql, (err, result, fields) => {
            if (err) {
                res.sendStatus(500)
                console.log('[SELECT ERROR]:', err.message)
            } else {
                res.json({
                    code: 1,
                    index: result
                })
            }
        })
    } else if (handler == 'Pop') {
        let id = req.body.id
        let label = req.body.label
        console.info(id)
        let sql = 'UPDATE article SET article_pop = article_pop + 1 WHERE article_use_if = 1 AND article_id = "' + id + '"'
        connection.query(sql, (err, result, fields) => {
            if (err) {
                res.sendStatus(500)
                console.log('[SELECT ERROR]:', err.message)
            } else {
                let ex_sql = 'SELECT article_pop FROM article WHERE article_use_if = 1 AND article_id = "' + id + '"'
                connection.query(ex_sql, (ex_err, ex_result) => {
                    res.json({
                        code: 1,
                        data: ex_result
                    })
                })
                let inte_sql = 'UPDATE interest SET inte_' + label + ' = inte_' + label + ' + 1 WHERE inte_use_if = 1 AND inte_username = "' + se.userName + '"'
                connection.query(inte_sql, (inte_err, inte_result) => {})
            }
        })
    } else if (handler == 'setProfile') {

    } else {}
})

app.post('/search', (req, res, next) => {
    let input = req.body.input

})

app.get('/interest', (req, res, next) => {
    let sql = 'SELECT inte_dog,inte_cat,inte_bird FROM interest WHERE inte_use_if = 1 AND inte_username = "' + se.userName + '"'
    connection.query(sql, (err, result, fields) => {
        if (err) {
            res.sendStatus(500)
            console.log('[SELECT ERROR]:', err.message)
        } else {
            res.json({
                code: 1,
                data: result
            })
        }
    })
})

app.post('/logout', (req, res, next) => {
    //销毁session
    req.session.destroy((err) => {
        if (err) {
            console.log(err)
        } else {
            se = null
            res.json({
                code: 1
            })
        }
    })
})

//连接测试  
app.get('/test', (req, res, next) => {
    res.json({
        code: 1,
        status: 'OK'
    })
})


let server = app.listen(8081, () => {
    let host = server.address().address
    let port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)
})