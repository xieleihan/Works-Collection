const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db/index');
const svgCaptcha = require('svg-captcha');

router.get('/generateVerifyimages', async (req, res) => {
    const client_email = req.query.client_email;

    if (!client_email) {
        return res.status(400).json({ error: '缺少 email 参数' });
    }

    try {
        // 检查邮箱是否存在于 db_message_board 表
        const emailSql = `SELECT * FROM db_message_board WHERE email = '${client_email}'`;
        const emailRows = await db.query(emailSql);

        if (emailRows.length > 1) {
            return res.status(500).json({ error: '你已经留言过了' });
        }

        // 创建验证码
        const img = svgCaptcha.create({
            size: 4,
            ignoreChars: '0o1i',
            color: true,
            noise: 3,
            background: '#666',
        });

        const code_id = uuidv4();
        const verifyImage_code = img.text;
        console.log("图片验证码是:", verifyImage_code);

        // 检查是否已存在验证码记录
        const selectSql = `SELECT * FROM db_verifyImage_code WHERE client_email = '${client_email}'`;
        const verifyRows = await db.query(selectSql);

        if (verifyRows.length > 0) {
            // 删除旧的验证码
            const deleteSql = `DELETE FROM db_verifyImage_code WHERE client_email = '${client_email}'`;
            await db.query(deleteSql);
            console.log('已删除旧验证码记录');
        }

        // 插入新的验证码记录
        const insertSql = `
            INSERT INTO db_verifyImage_code (code_id, client_email, verifyImage_code)
            VALUES ('${code_id}', '${client_email}', '${verifyImage_code}')
        `;
        await db.query(insertSql);
        console.log('验证码记录已写入');

        // 返回验证码图像
        res.json({
            img: img.data, // SVG 数据
            code: 200
        });
    } catch (error) {
        console.error('生成验证码时发生错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
})

// 查询验证码是否正确
router.get('/selectVerifyimages', async (req, res) => {
    const { client_email, code } = req.query;

    if (!client_email || !code) {
        return res.status(400).json({ error: '缺少参数 client_email 或 code' });
    }

    const emailSql = `SELECT * FROM db_message_board WHERE email = '${client_email}'`;
    await db.query(emailSql)
        .then(
            rows => {
                if (rows.length === 0) {
                    return res.status(404).json({ error: '没有找到对应的邮箱记录' });
                }
            }
    ).catch(
        err => {
            return res.status(500).json({ error: '服务器内部错误' });
            }
    )

    const selectSql = `SELECT * FROM db_verifyImage_code WHERE client_email = '${client_email}'`;

    try {
        const rows = await db.query(selectSql, [client_email]);
        if (rows.length === 0) {
            return res.status(404).json({ error: '没有找到对应的验证码记录' });
        }

        const storedCode = rows[0].verifyImage_code;
        if (storedCode.toLowerCase() === code.toLowerCase()) {
            // 验证成功，删除验证码记录
            const deleteSql = `DELETE FROM db_verifyImage_code WHERE client_email = '${client_email}'`;
            await db.query(deleteSql, [client_email]);
            return res.json({ success: true, message: '验证码正确' });
        } else {
            return res.status(400).json({ success: false, message: '验证码错误' });
        }
    } catch (error) {
        console.error('查询验证码时发生错误:', error);
        return res.status(500).json({ error: '服务器内部错误' });
    }
});

module.exports = router;