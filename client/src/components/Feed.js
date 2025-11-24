import React, { useEffect, useState } from 'react';
import {
  Grid2,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

function Feed() {
  const [open, setOpen] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  let [feeds, setFeeds] = useState([]);
  let navigate = useNavigate();

  function fnFeeds() {
    // 아이디를 jwt 토큰에서 꺼내기
    const token = localStorage.getItem("token");
    if(token) {
      const decoded = jwtDecode(token);
      console.log("decoded ==> ", decoded);
      fetch("http://localhost:3010/feed/" + decoded.userId)
      .then(res => res.json())
      .then(data => {
        setFeeds(data.list);
        console.log("data , " , data);
      })
    } else {
      // 로그인 페이지로 이동
      alert("로그인이 필요합니다");
      navigate("/");
    }
  }

  // function fnRemove(feedId) {
  //   if(!window.confirm("삭제할거?")){
  //       return;
  //   }
  //   fetch("http://localhost:3010/feed/" + feedId, {
  //     method : "DELETE",
  //     headers : {
  //       "Authorization" : "Bearer " + localStorage.getItem("token") // 첫글자 대문자 및 공백 꼭 확인(문법)
  //     }
  //   })
  //     .then( res => res.json() )
  //     .then( data => {
  //         console.log(data);
  //         alert("삭제되었습니다.");
  //     })
  // }
  
  useEffect(() => {
    fnFeeds();
  }, [])

  const handleClickOpen = (feed) => {
    setSelectedFeed(feed);
    setOpen(true);
    setComments([
      { id: 'user1', text: '멋진 사진이에요!' },
      { id: 'user2', text: '이 장소에 가보고 싶네요!' },
      { id: 'user3', text: '아름다운 풍경이네요!' },
    ]); // 샘플 댓글 추가
    setNewComment(''); // 댓글 입력 초기화
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFeed(null);
    setComments([]); // 모달 닫을 때 댓글 초기화
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, { id: 'currentUser', text: newComment }]); // 댓글 작성자 아이디 추가
      setNewComment('');
    }
  };

  return (
    <Container maxWidth="md">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">SNS</Typography>
        </Toolbar>
      </AppBar>

      <Box mt={4}>
        <Grid2 container spacing={3}>
          {feeds.length > 0 ? feeds.map((feed) => (
            <Grid2 xs={12} sm={6} md={4} key={feed.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={feed.imgPath}
                  alt={feed.imgName}
                  onClick={() => handleClickOpen(feed)}
                  style={{ cursor: 'pointer' }}
                />
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    {feed.content}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          )) : "등록된 피드가 없습니다. 피드를 등록해보세요"}
        </Grid2>
      </Box>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg"> {/* 모달 크기 조정 */}
        <DialogTitle>
          {/* tilte이 들어가야할 곳 */}
          {selectedFeed?.imgName}
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1">{selectedFeed?.content}</Typography>
            {selectedFeed?.imgPath && (
              <img
                src={selectedFeed.imgPath}
                alt={selectedFeed.imgName}
                style={{ width: '100%', marginTop: '10px' }}
              />
            )}
            {/* 첨부파일을 여러개 올리면 대표사진 하나만 올라가는게 아닌 사진 모두가 올라감(join했기 때문에) 그래서 spring처럼 썸네일 컬럼 만들어서 y/n 형식으로 대표이미지 하나만 나타나도록 하던가 */}
          </Box>

          <Box sx={{ width: '300px', marginLeft: '20px' }}>
            <Typography variant="h6">댓글</Typography>
            <List>
              {comments.map((comment, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar>{comment.id.charAt(0).toUpperCase()}</Avatar> {/* 아이디의 첫 글자를 아바타로 표시 */}
                  </ListItemAvatar>
                  <ListItemText primary={comment.text} secondary={comment.id} /> {/* 아이디 표시 */}
                </ListItem>
              ))}
            </List>
            <TextField
              label="댓글을 입력하세요"
              variant="outlined"
              fullWidth
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}           
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddComment}
              sx={{ marginTop: 1 }}
            >
              댓글 추가
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            console.log(selectedFeed);
            // 삭제 요청하면서 selectedFeed.id를 보낸다
            if(!window.confirm("삭제하시겠습니까?")){
              return;
            }
            fetch("http://localhost:3010/feed/" + selectedFeed.id, {
              method : "DELETE",
              headers : {
                "Authorization" : "Bearer " + localStorage.getItem("token") // 첫글자 대문자 및 공백 꼭 확인(문법)
                // 토큰 확인이 필요하다면 썬더에서 주소 끝에 /feedId 번호 넣고 실행시켜보면 "인증 토큰 없음"이 뜨는 것을 확인가능함
              }
            })
              .then( res => res.json() )
              .then( data => {
                  alert("삭제되었습니다.");
                  setOpen(false);
                  fnFeeds();
              })
          }} variant='contained' color="secondary">
            삭제
          </Button>
          <Button onClick={handleClose} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Feed;