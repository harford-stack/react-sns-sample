// express 패키지 : spring처럼 백엔드 서버 역할
// npm install express
// npm install cors

// 서버 자동 재시작 패키지 : nodemon
// npm install nodemon
// 설치 후 앞으로 서버 실행은 nodemon server.js

const express = require('express')
const cors = require('cors')
// const db = require("./db");
const path = require('path'); // uploads 폴더에 접근 가능하게 하기 위한 패키지

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

app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // uploads 폴더에 접근 가능하게 허용하겠다라는 path 패키지를 만든 사람의 문법이라고 보면 됨

// 3000번 포트를 사용하겠다
app.listen(3010, ()=>{
    console.log("server start!");
})