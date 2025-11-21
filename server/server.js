// express 패키지 : spring처럼 백엔드 서버 역할
// npm install express
// npm install cors

// 서버 자동 재시작 패키지 : nodemon
// npm install nodemon
// 설치 후 앞으로 서버 실행은 nodemon server.js

const express = require('express')
const cors = require('cors')
// const db = require("./db");

const userRouter = require("./routes/user");
const feedRouter = require("./routes/feed");

const app = express()

app.use(cors({
    origin : "*", // 현재 사용 컴퓨터 ip // 해당 ip는 허용하겠다는 뜻
    credentials : true
}))
app.use(express.json());

// router 영역
app.use("/user", userRouter);
app.use("/feed", feedRouter);

// 3000번 포트를 사용하겠다
app.listen(3010, ()=>{
    console.log("server start!");
})