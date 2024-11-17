const router = require('express').Router();
const db = require('../db/index');
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const safe_key = 'JZkA@Xeq}X_@=CD?9eBjK5)eM28-.]t,#Azjhgf!fGaEAJEr+1M-3o+etWgAFUFsgkp=i2E8XU16Dt3TNKLKmoiqjPGEtn+uDxnP?o.o41aR7^uKgjD8Kk4>Jf^FM,DzwJ?zyz1dDV46xPpgUim4#N^FLt+L:@Lp7sd%c]^4RXBfF9o5.n2oivK].QZ%Px4ZJYP)BtEv'

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (username === '' || email === '' || password === ''|| username == null || email == null || password == null || username === undefined || email === undefined || password === undefined) {
        return res.status(400).send({ message: '参数错误',"code":400 });
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


    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const sql = `insert into superadmin (username,email, password) values ('${username}','${email}', '${hashPassword}')`;
    try {
        const result = await db.query(sql);
        res.status(200).send({ message: '注册成功', "code": 200 });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: '服务器错误', "code": 500 });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    if (username === '' || password === ''|| username == null || password == null || username == undefined || password == undefined) {
        return res.status(400).send({ message: '参数错误',"code":400 });
    }
    const sql = `select * from superadmin where username = '${username}'`;
    try {
        const result = await db.query(sql);
        if (result.length === 0) {
            return res.status(404).send({ message: '用户不存在', "code": 404 });
        }
        const user = result[0];
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(400).send({ message: '密码错误', "code": 400 });
        }
        const hashUsername = bcrypt.hashSync(username, salt);
        const token = jwt.sign({ username: hashUsername }, safe_key,{ expiresIn: '24h' });
        res.send({ "message": '登录成功', "code": 200, "token":token });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: '服务器错误', "code": 500 });
    }
});

module.exports = router;