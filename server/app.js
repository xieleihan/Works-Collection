const express = require('express');

const app = express();
const PORT = 3000;

// 引入路由
const emailRouter = require('./router/httpapi');
const verifyImageRouter = require('./router/verifyImage');

// 使用路由
app.use('/api/email', emailRouter);
app.use('/api/verifyImage', verifyImageRouter);

// 测试
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log("服务启动成功");
    console.log(`Server is running at http://localhost:${PORT}`);
});