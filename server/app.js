const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
require('dotenv').config({ path: './.env' });
const jwt = require('jsonwebtoken');

const ipquery_key = process.env.gaode_key

const app = express();
const PORT = 3000;
const safe_key = 'JZkA@Xeq}X_@=CD?9eBjK5)eM28-.]t,#Azjhgf!fGaEAJEr+1M-3o+etWgAFUFsgkp=i2E8XU16Dt3TNKLKmoiqjPGEtn+uDxnP?o.o41aR7^uKgjD8Kk4>Jf^FM,DzwJ?zyz1dDV46xPpgUim4#N^FLt+L:@Lp7sd%c]^4RXBfF9o5.n2oivK].QZ%Px4ZJYP)BtEv'

// 增加请求体大小限制（例如设置为 50MB） 
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 跨域
app.use(cors({
    origin: '*', // 只允许来自这个域名的请求
    methods: 'GET,POST,PUT,DELETE,OPTIONS', // 允许的HTTP方法
    allowedHeaders: 'Content-Type,Authorization', // 允许的自定义头
    expressHeaders: 'Content-Type,Authorization', // 允许的自定义头
    credentials: true,
}))

// 解析Body内容
app.use(bodyParser.urlencoded({ extended: false }))

// 引入路由
const emailRouter = require('./router/httpapi');
const verifyImageRouter = require('./router/verifyImage');
const messageRouter = require('./router/message');
// 管理员的路由
const adminRouter = require('./router/SuperAdmin');
const userRouter = require('./router/UserInfo');

// 使用路由
app.use('/api/email', emailRouter);
app.use('/api/verifyImage', verifyImageRouter);
app.use('/api/message', messageRouter);
app.use('/api/private', adminRouter);
app.use('/api/private/user', userRouter);


// 测试(公开接口)
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// 测试受保护的接口
// 测试token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN6eSIsImlhdCI6MTczMTY4OTMxNCwiZXhwIjoxNzMxNzc1NzE0fQ.UJZilQwxLDdODI0MBT3zGU7h0pTOGIl48Hob_486Ct4
app.get('/protected', (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).send({ message: '未授权的访问', "code": 401 });
    } else {
        jwt.verify(token, safe_key, (err, decoded) => {
            if (err) {
                res.status(401).send({ message: '无效的token', "code": 401 });
            } else {
                res.send({ message: '授权成功', "code": 200 });
            }
        });
    }
})

// ip信息接口
app.get('/api/proxy/ipqueryinfo', (req, res) => {
    const ip = req.query.ip;
    const request = require('request');
    const url = `https://restapi.amap.com/v3/ip?key=${ipquery_key}&ip=${ip}`;
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        } else {
            res.send(error);
        }
    });
})

// 读取静态资源图片
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log("服务启动成功");
    console.log(`Server is running at http://localhost:${PORT}`);
});

