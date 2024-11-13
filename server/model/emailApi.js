// 导包
const fs = require('fs');
const path = require('path');
const sendEmail = require('./sendEmail');
// 生成ID
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const qq = require('./qq');
// 导入已封装的数据函数
const db = require('../db/index');
const PROJECT_NAME = qq.name;
const FROM_EMAIL = qq.email;//开发者邮箱

// 储存验证码的方案：
// 1: 写入.txt文件
// 2: 储存在数据库(推荐)
// 3: 使用nodejs储存机制
class Email {
    static delay = {}; // 以 client_email 为键的延迟状态对象

    static getEmailCode(client_email) {
        return new Promise((resolve, reject) => {
            let email_code = Math.random().toString().slice(-6); // 生成6位随机验证码
            let code_id = uuidv4(); // 唯一ID
            let email = {
                title: `${PROJECT_NAME}---邮箱验证码`,
                body: `
<div style="width: 400px;height: 50px;display: flex;flex-direction: row ;align-items: center;">
<img style="width:50px;height:50px;margin-right: 10px;" src="https://github.com/xieleihan/QingluanSearch-AndroidDev/raw/main/peacock_flat.png" alt="" />
<span style="font-weight: bold;font-family: kaiti;">南秋SouthAki<span style="font-family: kaiti;letter-spacing: 15px;color: #ccc;display: block;margin-left: 10px;font-size: 12px;">邮箱验证平台</span></span>
</div>
<h1>您好：</h1>
<p style="font-size: 18px;color:#000;">
您的验证码为：
<span style="font-size: 16px;color:#f00;"><b>${email_code}</b>,</span>
<p>您当前正在使用${PROJECT_NAME}的邮箱验证服务，验证码告知他人将会导致数据信息被盗，请勿泄露!
</p >
<p>他人之招,谨防上当受骗.</p >
</p >
<p style="font-size: 1.5rem;color:#999;">3分钟内有效</p >
`
            };

            let emailContent = {
                from: FROM_EMAIL,
                to: client_email,
                subject: email.title,
                html: email.body
            };

            // 查询数据库，检查该邮箱是否有延迟
            let sql = `select client_email from db_email_code where client_email='${client_email}'`;

            db.query(sql)
                .then(async (rows) => {
                    if (rows.length >= 1 && Email.delay[client_email]) {
                        resolve({
                            code: 1,
                            msg: '请60秒后重新发送验证码。',
                        });
                        return;
                    }

                    // 发送邮件
                    await sendEmail.send(emailContent);

                    // 将验证码写入数据库
                    await Email.writeEmailCode(client_email, email_code, code_id);

                    resolve({
                        code: 200,
                        msg: '验证码发送成功。',
                    });

                    // 设置延迟状态
                    Email.delay[client_email] = setTimeout(() => {
                        Email.removeEmailCode(client_email); // 删除验证码
                        clearTimeout(Email.delay[client_email]);
                        delete Email.delay[client_email]; // 移除延迟状态
                    }, 60 * 1000); // 60秒后清除延迟状态
                })
                .catch((err) => {
                    reject({
                        code: -1,
                        msg: '服务端发生异常。',
                        err,
                    });
                });
        });
    }

    // 添加验证码
    static async writeEmailCode(client_email, email_code, code_id) {
        let sql = `insert into db_email_code(client_email, email_code, code_id) values('${client_email}', '${email_code}', '${code_id}')`;
        return db.query(sql);
    }

    // 删除验证码
    static async removeEmailCode(client_email) {
        let sql = `delete from db_email_code where client_email = '${client_email}'`;
        return db.query(sql);
    }

    // 验证邮箱验证码
    static async verifyEmailCode(client_email, email_code) {
        let sql = `select client_email from db_email_code where client_email = '${client_email}' and email_code='${email_code}'`;
        let rows = await db.query(sql);
        if (rows.length === 1) {
            return {
                code: 200,
                msg: '邮箱验证成功。',
            };
        } else {
            return {
                code: -1,
                msg: '邮箱验证失败。',
            };
        }
    }
}

module.exports = Email;