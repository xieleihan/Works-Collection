const router = require('express').Router();
const emailApi = require('../model/emailApi');
const db = require('../db/index');

getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

router.post('/addMessage', async (req, res) => {
    const { email, message, username, code, verifycode } = req.body;

    // 检验邮箱
    try {
        const emailVerificationResult = await emailApi.verifyEmailCode(email, code);
        if (emailVerificationResult.code !== 200) {
            return res.status(400).json({ error: '邮箱验证码验证失败' });
        }
        // 验证通过后删除验证码
        emailApi.removeEmailCode(email);
    } catch (error) {
        console.log("邮箱验证失败", error);
        return res.status(500).json({ error: '邮箱验证失败' });
    }

    // 检验图片验证码
    try {
        const selectSql = `SELECT * FROM db_verifyImage_code WHERE client_email = '${email}'`;
        const rows = await db.query(selectSql);

        if (rows.length === 0) {
            return res.status(404).json({ error: '没有找到对应的验证码记录' });
        }

        const verifyImage_code = rows[0].verifyImage_code;
        if (verifycode !== verifyImage_code) {
            return res.status(400).json({ error: '验证码错误' });
        }
    } catch (error) {
        console.error('检验验证码时发生错误:', error);
        return res.status(500).json({ error: '检验验证码时发生错误' });
    }

    // 生成随机头像
    const index = getRandomNumber(1, 35);
    const avater = `/img/${index}.png`;

    // 验证输入参数
    if (!email || !message || !username || email === '' || message === '' || username === '') {
        return res.status(400).json({ error: '缺少 email 或 message 参数' });
    }

    // 插入留言
    try {
        const sql = `
            INSERT INTO db_message_board (email, message, username, avater)
            VALUES ('${email}', '${message}', '${username}', '${avater}')
        `;
        await db.query(sql);
        return res.json({ code: 200, message: '留言成功' });
    } catch (error) {
        console.error('留言时发生错误:', error);
        return res.status(500).json({ error: '服务器内部错误' });
    }
});

// 获取留言列表
router.get('/getMessageList', async (req, res) => {
    try {
        const sql = 'SELECT * FROM db_message_board ORDER BY id DESC';
        const rows = await db.query(sql);
        return res.json({ code: 200, data: rows });
    } catch (error) {
        console.error('获取留言列表时发生错误:', error);
        return res.status(500).json({ error: '服务器内部错误' });
    }
});

module.exports = router;