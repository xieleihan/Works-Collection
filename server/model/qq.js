require('dotenv').config({ path: './.env' });

const email = process.env.email
const pass = process.env.pass

console.log("邮箱服务提供: 邮箱:" + email + ",授权码:" + pass + ".")

module.exports = {
    email: email,
    name: '南秋SouthAki邮箱验证服务',
    pass: pass
}