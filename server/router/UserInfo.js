const router = require('express').Router();
const db = require('../db/index');
const jwt = require('jsonwebtoken');

const safe_key = 'JZkA@Xeq}X_@=CD?9eBjK5)eM28-.]t,#Azjhgf!fGaEAJEr+1M-3o+etWgAFUFsgkp=i2E8XU16Dt3TNKLKmoiqjPGEtn+uDxnP?o.o41aR7^uKgjD8Kk4>Jf^FM,DzwJ?zyz1dDV46xPpgUim4#N^FLt+L:@Lp7sd%c]^4RXBfF9o5.n2oivK].QZ%Px4ZJYP)BtEv'

// 查询
router.get('/getUserInfo', async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).send({ message: '未授权的访问', "code": 401 });
    } else {
        jwt.verify(token, safe_key, async (err, decoded) => {
            if (err) {
                res.status(401).send({ message: '无效的token', "code": 401 });
            } else {
                const sql = `select * from userinfo`;
                try {
                    const result = await db.query(sql);
                    res.status(200).send({ "code": 200, "data": result });
                } catch (err) {
                    console.log(err);
                    res.status(500).send({ message: '服务器错误', "code": 500 });
                }
            }
        });
    }
    
});
// 修改
router.post('/updateUserInfo', async (req, res) => {
    
});
// 删除
router.post('/deleteUserInfo', async (req, res) => { });
// 添加
router.post('/addUserInfo', async (req, res) => { });

module.exports = router;