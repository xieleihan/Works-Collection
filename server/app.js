const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')

const app = express();
const PORT = 3000;

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

// 使用路由
app.use('/api/email', emailRouter);
app.use('/api/verifyImage', verifyImageRouter);
app.use('/api/message', messageRouter);

// 测试
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// 读取静态资源图片
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log("服务启动成功");
    console.log(`Server is running at http://localhost:${PORT}`);
});