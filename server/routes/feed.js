const express = require('express');
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../auth");
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/upload', upload.array('file'), async (req, res) => { // 파일 1개 첨부라면 array를 single로 변경
    let {feedId} = req.body;
    const files = req.files;
    // const filename = req.file.filename; 
    // const destination = req.file.destination; 
    try{
        let results = [];
        let host = `${req.protocol}://${req.get("host")}/`;
        for(let file of files){
            let filename = file.filename;
            let destination = file.destination;
            let query = "INSERT INTO TBL_FEED_IMG VALUES(NULL, ?, ?, ?)";
            let result = await db.query(query, [feedId, filename, host + destination + filename]);
            results.push(result);
        }
        res.json({
            message : "result",
            result : results
        });
    } catch(err){
        console.log("에러 발생!");
        res.status(500).send("Server Error");
    }
});

router.get("/:userId", async (req, res) => {
    console.log(`${req.protocol}://${req.get("host")}`);
    let {userId} = req.params;
    try {
        let sql = "SELECT * FROM TBL_FEED F "
                + "INNER JOIN TBL_FEED_IMG I ON F.ID = I.FEEDID "
                + "WHERE F.USERID = ?";
        let [list] = await db.query(sql, [userId]);
        res.json({
            list,
            result : "success"
        })
    } catch (error) {
        console.log(error);
    }
})

router.delete("/:feedId", authMiddleware, async (req, res) => {
    let { feedId } = req.params;
    try {
        let sql = "DELETE FROM TBL_FEED WHERE ID = ?";
        let result = await db.query(sql, [feedId]);
        res.json({
            result : result,
            msg : "삭제 완료"
        });
    } catch (error) {
        console.log(error);
    }
})

router.post("/", async (req, res) => {
    let { userId, content } = req.body; // 프론트에서 body에 담았음
    console.log(req.body);
    try {
        let sql = "INSERT INTO TBL_FEED (USERID, CONTENT, CDATETIME) VALUES (?, ?, NOW())";
        let result = await db.query(sql, [userId, content]); // select가 아니므로 result로 받는다
        console.log(result); // 확인해보면 result 안에 "insertId" 라는게 존재함 -> 이게 TBL_FEED의 insert되는 ID임
        res.json({
            result : result,
            msg : "success"
        });
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;