const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db/index');
const svgCaptcha = require('svg-captcha');

router.get('/generateVerifyimages', async (req, res) => {
    // 下面这行代码是随机生成验证码图片和文本并返回给客户端 
    const img = svgCaptcha.create({
        size: 4, // 验证码长度
        ignoreChars: '0o1i', // 验证码字符中排除 0o1i
        color: true, // 验证码是否有彩色
        noise: 3, //干扰线
        background: '#666' // 背景颜色
    })
    let code_id = uuidv4();
    console.log(img.text);
    let verifyImage_code = img.text;

    let client_email = req.query.client_email;

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

    // 检查数据表里是否有该邮箱的验证码
    let selectSql = `select * from db_verifyImage_code where client_email = '${client_email}'`;

    await db.query(selectSql)
        .then(
            rows => {
                if (rows.length > 0) {
                    // 删除之前的验证码
                    let deleteSql = `delete from db_verifyImage_code where client_email = '${client_email}'`;

                    db.query(deleteSql)
                        .then(
                            rows => {
                                console.log("成功删除", rows);
                            }
                        )
                        .catch(
                            err => {
                                console.log(err);
                            }
                        )
                }
            }
        )

    // 将验证码存入数据库
    let sql = `insert into db_verifyImage_code (code_id, client_email, verifyImage_code) values ('${code_id}', '${client_email}', '${verifyImage_code}')`;

    await db.query(sql)
        .then(
            rows => {
                console.log("成功写入", rows);
            }
        )
        .catch(
            err => {
                console.log(err);
            }
        )

    res.send(img.data);
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