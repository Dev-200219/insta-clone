import "../CSS/VideoCard.css";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteSharpIcon from "@material-ui/icons/FavoriteSharp";
import { useContext, useState, useEffect } from "react";
import { userContext } from "./AuthProvider";
import { firestore } from "../firebase";

let VideoCard = (props) => {
  let user = useContext(userContext);
  let [currUserName, setCurrUserName] = useState("");
  let [currUserDP, setCurrUserDP] = useState("");
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

  let isLikedByUser = props.data.likes.includes(user.uid);
  let [comment, setComment] = useState("");
  let post = props.data;
  let commentsArr = post.comments;

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
                }
              }}
            ></input>
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

export default VideoCard;
