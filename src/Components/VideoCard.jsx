import "../CSS/VideoCard.css";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";
import FavoriteSharpIcon from "@material-ui/icons/FavoriteSharp";
import Pagination from "@material-ui/lab/Pagination";
import { useContext, useState, useEffect, useRef } from "react";
import { userContext } from "./AuthProvider";
import { firestore } from "../firebase";
import { makeStyles } from "@material-ui/core/styles";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      marginTop: theme.spacing(2),
    },
    borderRadius: "5px",
    position: "absolute",
    top: "440px",
    left: "0px",
  },
}));

let VideoCard = (props) => {
  let user = useContext(userContext);
  let [currUserName, setCurrUserName] = useState("");
  let [currUserDP, setCurrUserDP] = useState("");
  let [currPage, setCurrPage] = useState(1);
  let [comment, setComment] = useState("");
  let [isEmojiPalleteOpen, setIsEmojiPalleteOpen] = useState(false);

  let isLikedByUser = props.data.likes.includes(user.uid);
  let post = props.data;
  let commentsArr = post.comments;
  const classes = useStyles();
  let startIndex = (currPage - 1) * 4;
  let endIndex = Math.min(commentsArr.length, currPage * 4);
  const emojiPalleteRef = useRef(null);

  const openEmojiPallete = () => {
    emojiPalleteRef.current.style = "display:block";
  };

  const closeEmojiPallete = () => {
    emojiPalleteRef.current.style = "display:none";
  };

  useEffect(() => {
    firestore
      .collection("users")
      .doc(user.uid)
      .get()
      .then((docRef) => {
        setCurrUserName(docRef.data().displayName);
        setCurrUserDP(docRef.data().photoURL);
      });
  }, [user.uid]);

  return (
    <>
      <div className="video-card-container">
        <div className="data-container">
          {post.type === "image" ? (
            <img src={post.url} alt="post_img"></img>
          ) : (
            <video controls src={post.url}></video>
          )}
        </div>
        <div className="vl"></div>
        <div className="like-comment-container">
          <div className="user-info">
            <div className="user-img">
              {post.dp ? (
                <img src={post.dp} alt=""></img>
              ) : (
                <img
                  src="https://i.stack.imgur.com/l60Hf.png"
                  alt="some_dp"
                ></img>
              )}
            </div>
            <p className="user-name">{post.name}</p>
          </div>
          <div className="add-comment">
            <input
              onChange={(e) => {
                setComment(e.currentTarget.value);
              }}
              value={comment}
              placeholder="Comment..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  let newCommArr = [
                    ...post.comments,
                    {
                      name: currUserName,
                      dp: currUserDP,
                      value: comment,
                    },
                  ];

                  firestore
                    .collection("posts")
                    .doc(post.id)
                    .update({ comments: newCommArr });

                  setComment("");
                  if (isEmojiPalleteOpen) {
                    setIsEmojiPalleteOpen(false);
                    closeEmojiPallete();
                  }
                }
              }}
            ></input>
            <button
              onClick={() => {
                if (isEmojiPalleteOpen) {
                  closeEmojiPallete();
                  setIsEmojiPalleteOpen(false);
                } else {
                  openEmojiPallete();
                  setIsEmojiPalleteOpen(true);
                }
              }}
              className="emoji-picker-btn"
            >
              <SentimentVerySatisfiedIcon />
            </button>
            <div
              ref={emojiPalleteRef}
              style={{ display: "none" }}
              className="emoji-picker-container"
            >
              <Picker
                onClick={(emoji) => {
                  setComment(comment + emoji.native);
                }}
              />
            </div>
          </div>
          <button
            onClick={() => {
              let arr = [];
              if (isLikedByUser) {
                for (let i = 0; i < post.likes.length; i++) {
                  if (post.likes[i] !== user.uid) arr.push(post.likes[i]);
                }
              } else {
                arr = [...post.likes, user.uid];
              }
              firestore.collection("posts").doc(post.id).update({ likes: arr });
            }}
            className="home-like-btn-container"
          >
            {isLikedByUser ? (
              <FavoriteSharpIcon className="like-btn" />
            ) : (
              <FavoriteBorderIcon className="like-btn" />
            )}
            <div>
              {`${props.data.likes.length} ${
                props.data.likes.length > 1 ? "Likes" : "Like"
              }`}
            </div>
          </button>

          <div className="actual-comments-container">
            {commentsArr.map((el, idx) => {
              if (idx >= startIndex && idx <= endIndex - 1)
                return (
                  <div key={idx} className="actual-comment">
                    <div className="comment-user-info">
                      <div className="comm-user-img">
                        {el.dp ? (
                          <img src={el.dp} alt="" />
                        ) : (
                          <img
                            src="https://i.stack.imgur.com/l60Hf.png"
                            alt=""
                          />
                        )}
                      </div>
                      <p>{el.name}</p>
                    </div>
                    <div className="comment-value">
                      <p>{el.value}</p>
                    </div>
                  </div>
                );
            })}
          </div>
          <div className={classes.root}>
            <Pagination
              count={Math.ceil(commentsArr.length / 4)}
              size="large"
              color="primary"
              onChange={(event, newPage) => {
                setCurrPage(newPage);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoCard;
