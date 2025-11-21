const express = require('express');
const router = express.Router();
const db = require("../db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_KEY = "secret_key"; // 해시 함수 실행 위해 사용할 키로 아주 긴 랜덤한 문자를 사용하길 권장하며, 노출되면 안됨.

router.get("/", async (req, res) => {
    
    try {
        
    } catch (error) {
        console.log(error);
    }
})

router.post('/join', async (req, res) => {
    // 프론트엔드에서 보낸 변수명과 일치시키기
    let { id, pwd, userName } = req.body;
    console.log(req.body);
    try {
        let hashPwd = await bcrypt.hash(pwd, 10);
        console.log(hashPwd);
        let sql = "INSERT INTO TBL_USER"
                + "(USERID, PWD, USERNAME) "
                + "VALUES(?, ?, ?)";
        let result = await db.query(sql, [id, hashPwd, userName]);
        
        res.json({
            msg : "가입완료",
            result : result
        });
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;