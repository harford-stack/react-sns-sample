const express = require('express');
const router = express.Router();
const db = require("../db");

router.get("/:userId", async (req, res) => {
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

module.exports = router;