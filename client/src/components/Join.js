import React, { useRef } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function Join() {
  let idRef = useRef();
  let pwdRef = useRef();
  let userNameRef = useRef();
  let navigate = useNavigate();

  let handleJoin = async () => { // async 함수로 선언하여 비동기 처리
    let id = idRef.current.value;
    let pwd = pwdRef.current.value;
    let userName = userNameRef.current.value;

    // 입력값 유효성 검사 (예시)
    if (!id || !pwd || !userName) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const param = {
      id: id, // 실제 값을 전달
      pwd: pwd, // 실제 값을 전달
      userName: userName // 실제 값을 전달
    };

    try {
      let response = await fetch("http://localhost:3010/user/join", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(param)
      });

      if (!response.ok) { // HTTP 상태 코드가 2xx가 아닌 경우 에러 처리
        let errorData = await response.json();
        throw new Error(errorData.message || "회원가입 중 오류가 발생했습니다.");
      }

      let data = await response.json(); // 응답 본문 파싱

      alert("가입되었습니다.");
      console.log("회원가입 성공:", data);
      navigate("/"); // 회원가입 성공 후 로그인 페이지로 이동 (예시)

    } catch (error) {
      console.error("회원가입 요청 에러:", error);
      alert("회원가입에 실패했습니다: " + error.message); // 사용자에게 에러 메시지 표시
    }
  };

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
          회원가입
        </Typography>
        <TextField inputRef={idRef} label="ID" variant="outlined" margin="normal" fullWidth />
        <TextField
          inputRef={pwdRef}
          label="Password"
          variant="outlined"
          margin="normal"
          fullWidth
          type="password"
        />
        <TextField inputRef={userNameRef} label="Username" variant="outlined" margin="normal" fullWidth />
        <Button onClick={handleJoin} variant="contained" color="primary" fullWidth style={{ marginTop: '20px' }}>
            회원가입
        </Button>
        <Typography variant="body2" style={{ marginTop: '10px' }}>
          이미 회원이라면? <Link to="/login">로그인</Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default Join;