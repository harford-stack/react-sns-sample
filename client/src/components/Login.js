import React, { useRef } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  let idRef = useRef();
  let pwdRef = useRef();
  let navigate = useNavigate();

  let onLogin = async () => {
    let id = idRef.current.value;
    let pwd = pwdRef.current.value;

    if (!id || !pwd) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const param = { id, pwd };

    try {
      let response = await fetch("http://localhost:3010/user/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(param)
      });

      // 서버로부터 받은 HTTP 상태 코드가 2xx가 아닌 경우 에러 처리 (예: 500 Internal Server Error)
      if (!response.ok) {
        let errorData = await response.json();
        throw new Error(errorData.msg || `로그인 요청 실패 (HTTP ${response.status})`);
      }

      // 서버 응답 본문을 파싱합니다.
      // 이제 'data' 객체 안에 백엔드에서 보낸 'msg'와 'result'가 들어있습니다.
      let data = await response.json();
      
      // 여기에서 data.msg 와 data.result 를 사용합니다!
      if (data.result) { // 로그인이 성공했을 때 (data.result가 true)
        alert(data.msg); // 백엔드에서 받은 환영 메시지 사용
        console.log(data);
        localStorage.setItem("token", data.token); // localStorage는 브라우저가 가지는 저장 공간(브라우저가 닫히기 전까지)
        console.log(data.token);
        console.log("로그인 성공:", data);
        navigate("/feed"); // 성공 시 feed 페이지로 이동
      } else { // 로그인이 실패했을 때 (data.result가 false, 즉 아이디/비번 불일치)
        alert(data.msg); // 백엔드에서 받은 "비밀번호 확인" 또는 "아이디 없음" 메시지 사용
        console.log("로그인 실패:", data);
        // 로그인 실패 시에는 navigate하지 않거나, 다시 로그인 페이지에 머무르게 합니다.
      }

    } catch (error) {
      console.error("로그인 요청 에러:", error);
      alert("로그인에 실패했습니다: " + error.message); // 사용자에게 에러 메시지 표시
    }
  }

  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h4" gutterBottom>
          로그인
        </Typography>
        <TextField inputRef={idRef} label="Email" variant="outlined" margin="normal" fullWidth />
        <TextField
          inputRef={pwdRef}
          label="Password"
          variant="outlined"
          margin="normal"
          fullWidth
          type="password"
        />
        <Button onClick={onLogin} variant="contained" color="primary" fullWidth style={{ marginTop: '20px' }}>
          로그인
        </Button>
        <Typography variant="body2" style={{ marginTop: '10px' }}>
          회원이 아니신가요? <Link to="/join">회원가입</Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default Login;
