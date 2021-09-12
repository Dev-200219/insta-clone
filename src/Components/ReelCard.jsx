import { useContext, useEffect, useRef, useState } from "react";
import AudiotrackIcon from "@material-ui/icons/Audiotrack";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteSharpIcon from "@material-ui/icons/FavoriteSharp";
import { firestore } from "../firebase";
import CommentIcon from "@material-ui/icons/Comment";
import "../CSS/ReelCard.css";
import { userContext } from "./AuthProvider";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";

let ReelCard = (props) => {
  let user = useContext(userContext);
  let [isPlaying, setIsPlaying] = useState(true);
  let [isCommentBoxOpen, setIsCommentBoxOpen] = useState(false);
  let [comment, setComment] = useState("");
  let [currUserName, setCurrUserName] = useState("");
  let [currUserDP, setCurrUserDP] = useState("");
  let [isEmojiPalleteOpen, setIsEmojiPalleteOpen] = useState(false);

  useEffect(() => {
    firestore
      .collection("users")
      .doc(user.uid)
      .get()
      .then((docRef) => {
        setCurrUserName(docRef.data().displayName);
        setCurrUserDP(docRef.data().photoURL);
      });
  }, []);
  let isLikedByUser = props.data.likes.includes(user.uid);
  let commentsArr = props.data.comments;

  const commentsContainer = useRef(null);
  const openCommentBox = () => {
    commentsContainer.current.style = "display:block";
  };

  const closeCommentBox = () => {
    commentsContainer.current.style = "display:none";
  };

  //step 1 find the element which you want to observe
  const myEl = useRef(null);

  let observeConfig = {
    root: null,
    rootMargin: "0px",
    threshold: [0.25, 0.5, 0.75, 1],
  };

  useEffect(() => {
    //step 3
    const myObserver = new IntersectionObserver((elements) => {
      if (elements[0].intersectionRatio >= 0.5) {
        //play the video
        if (myEl.current) myEl.current.play();
      } else {
        //pause the video
        if (myEl.current) {
          myEl.current.pause();
        }
      }
    }, observeConfig);

    // //step 4
    myObserver.observe(myEl.current);
  }, []);

  const emojiPalleteRef = useRef(null);

  const openEmojiPallete = () => {
    emojiPalleteRef.current.style = "display:block";
  };

  const closeEmojiPallete = () => {
    emojiPalleteRef.current.style = "display:none";
  };

  return (
    <>
      <div className="video-container">
        <div className="video-src">
          <p className="reels-user-name">{props.data.name}</p>
          <span className="song-details">
            <AudiotrackIcon />
            <marquee>Song Name</marquee>
          </span>
          <video
            onClick={(e) => {
              if (isPlaying) {
                setIsPlaying(false);
                e.currentTarget.pause();
              } else {
                setIsPlaying(true);
                e.currentTarget.play();
              }
            }}
            src={props.data.url}
            ref={myEl}
            loop
            autoPlay
          ></video>
          <div
            onClick={() => {
              let arr = [];
              if (isLikedByUser) {
                for (let i = 0; i < props.data.likes.length; i++) {
                  if (props.data.likes[i] !== user.uid)
                    arr.push(props.data.likes[i]);
                }
              } else {
                arr = [...props.data.likes, user.uid];
              }
              firestore
                .collection("reels")
                .doc(props.data.id)
                .update({ likes: arr });
            }}
            className="like-btn-container"
          >
            {isLikedByUser ? (
              <FavoriteSharpIcon className="reels-like-btn" />
            ) : (
              <FavoriteBorderIcon className="reels-like-btn" />
            )}
          </div>
          <div className="num-likes">
            <p>{`${props.data.likes.length} ${
              props.data.likes.length > 1 ? "Likes" : "Like"
            }`}</p>
          </div>
          <div
            onClick={() => {
              if (isCommentBoxOpen) {
                setIsCommentBoxOpen(false);
                closeCommentBox();
              } else {
                setIsCommentBoxOpen(true);
                openCommentBox();
              }
            }}
            className="comment-btn-container"
          >
            <CommentIcon className="reels-comments-btn" />
          </div>
        </div>
        <div
          ref={commentsContainer}
          style={{ display: "none", border: "1px solid" }}
          className="reels-comments-container"
        >
          <div className="reels-add-comment">
            <input
              onChange={(e) => {
                setComment(e.currentTarget.value);
              }}
              value={comment}
              placeholder="Comment..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  let newCommArr = [
                    ...props.data.comments,
                    {
                      name: currUserName,
                      dp: currUserDP,
                      value: comment,
                    },
                  ];

                  firestore
                    .collection("reels")
                    .doc(props.data.id)
                    .update({ comments: newCommArr });

                  setComment("");
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
              className="reel-emoji-picker-btn"
            >
              <SentimentVerySatisfiedIcon />
            </button>
            <div
              ref={emojiPalleteRef}
              style={{ display: "none" }}
              className="reel-emoji-picker-container"
            >
              <Picker
                onClick={(emoji) => {
                  setComment(comment + emoji.native);
                }}
                sheetSize={16}
                perLine={9}
              />
            </div>
          </div>
          <div className="reel-all-comments">
            {commentsArr.map((el, idx) => {
              return (
                <div key={idx} className="actual-comment">
                  <div className="comment-user-info">
                    <div className="comm-user-img">
                      {el.dp ? (
                        <img src={el.dp} alt="" />
                      ) : (
                        <img src="https://i.stack.imgur.com/l60Hf.png" alt="" />
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
        </div>
      </div>
    </>
  );
};

export default ReelCard;
