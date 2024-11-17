const router = require('express').Router();
const db = require('../db/index');

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (username === '' || email === '' || password === '' || username == null || email == null || password == null || username === undefined || email === undefined || password === undefined) {
        return res.status(400).send({ message: '参数错误', "code": 400 });
    }
    // 检查数据库表有无重复的用户名
    const checkUsernameSql = `select * from superadmin where username = '${username}'`;
    const checkEmailSql = `select * from superadmin where email = '${email}'`;
    try {
        const checkUsernameResult = await db.query(checkUsernameSql);
        const checkEmailResult = await db.query(checkEmailSql);
        if (checkUsernameResult.length !== 0) {
            return res.status(400).send({ message: '用户名已存在', "code": 400 });
        }
        if (checkEmailResult.length !== 0) {
            return res.status(400).send({ message: '邮箱已存在', "code": 400 });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: '服务器错误', "code": 500 });
    }

});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (username === '' || password === '' || username == null || password == null || username == undefined || password == undefined) {
        return res.status(400).send({ message: '参数错误', "code": 400 });
    }
    const sql = `select * from superadmin where username = '${username}'`;
    try {
        const result = await db.query(sql);
        if (result.length === 0) {
            return res.status(404).send({ message: '用户不存在', "code": 404 });
        }
        const user = result[0];
        if (password !== user.password) {
            return res.status(400).send({ message: '密码错误', "code": 400 });
        }
        res.send({ "message": '登录成功', "code": 200 });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: '服务器错误', "code": 500 });
    }

});

module.exports = router;