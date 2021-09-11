import { useContext, useRef, useState } from "react";
import "../CSS/ImageCard.css";
import CommentIcon from "@material-ui/icons/Comment";
import FavoriteSharpIcon from "@material-ui/icons/FavoriteSharp";
import { userContext } from "./AuthProvider";

let ImageCard = (props) => {
  let user = useContext(userContext);
  let [isPlaying, setIsPlaying] = useState(false);
  let [isCommBoxOpen, setIsCommBoxOpen] = useState(false);
  let commentsArr = props.data.comments;

  const commBoxRef = useRef(null);
  const postRef = useRef(null);

  const displayCommBox=()=>{
    commBoxRef.current.style = "display:block";
    postRef.current.style = "display:none";
  }

  const removeCommBox=()=>{
    commBoxRef.current.style = "display:none";
    postRef.current.style = "display:block";
  }

  return (
    <>
      <div className="profile-post-container">
        <div ref={commBoxRef} style={{display:"none"}} className="profile-all-comments-cont">
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
        <div ref={postRef} style={{display:"block"}} className="post-src">
          {props.data.type === "image" ? (
            <img src={props.data.url} alt="" />
          ) : (
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
              alt=""
            />
          )}
        </div>
        <div className="post-likes-comm">
          <div className="profile-like-container">
            <FavoriteSharpIcon className="reels-like-btn" />

            <div>
              {`${props.data.likes.length} ${props.data.likes.length > 1 ? "Likes" : "Like"}`}
            </div>
          </div>
          <div onClick={()=>{
            if(isCommBoxOpen)
            {
              setIsCommBoxOpen(false);
              removeCommBox();
            }
            else
            {
              displayCommBox();
              setIsCommBoxOpen(true);
            }
          }} className="profile-comment-container">
          <CommentIcon className="profile-comments-btn" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageCard;
