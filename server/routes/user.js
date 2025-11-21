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

router.post('/login', async (req, res) => {
    let {id, pwd} = req.body
    console.log(req.body);
    try {
        let sql = "SELECT * FROM TBL_USER WHERE USERID = ?";
        let [list] = await db.query(sql, [id]);
        let msg = "";
        let result = false;
        if(list.length > 0){
            // 아이디 존재
            const match = await bcrypt.compare(pwd, list[0].pwd);
            if(match){
                msg = list[0].userId + "님 환영합니다!";
                result = true;
            } else {
                msg = "비밀번호가 일치하지 않습니다";
            }
        } else {
            // 아이디 없음
            msg = "해당 아이디가 존재하지 않습니다.";
        }
        
        res.json({
            msg : msg, // 양쪽 이름이 같을 때에는 생략 가능
            result : result // result 로 작성 가능 // 자바스크립트에서만 사용 가능한 문법
        });
    } catch (error) {
        console.error("로그인 처리 중 서버 에러 발생:", error); // console.log 대신 console.error 권장
        // 백엔드에서 에러 발생 시에도 클라이언트에게 응답을 보내야 합니다.
        res.status(500).json({ msg: "로그인 처리 중 서버 오류가 발생했습니다.", result: false });
    }
})

router.get("/:userId", async (req, res) => {
    let {userId} = req.params;
    try {
       // 1. 두개 쿼리 써서 리턴
    //    let [list] = await db.query("SELECT * FROM TBL_USER WHERE USERID = ?", [userId]);
    //    let [cnt] = await db.query("SELECT COUNT(*) FROM TBL_FEED WHERE USERID = ?", [userId]);
    //    res.json({
    //     user : list[0],
    //     cnt : cnt[0]
    //    }) 

       // 2. 조인쿼리 만들어서 하나로 리턴
        let sql = "SELECT U.*, cnt "
                + "FROM TBL_USER U "
                + "INNER JOIN ( "
                + "SELECT USERID, COUNT(*) CNT "
                + "FROM TBL_FEED "
                + "WHERE USERID = ? "
                + ") T ON U.USERID = T.USERID";
        let [list] = await db.query(sql, [userId]);
        res.json({
            user : list[0],
            result : "success"
        })



    } catch (error) {
        console.log(error);
    }
})

module.exports = router;