import { useContext, useState } from "react";
import "../CSS/ImageCard.css";
import CommentIcon from "@material-ui/icons/Comment";
import FavoriteSharpIcon from "@material-ui/icons/FavoriteSharp";
import { userContext } from "./AuthProvider";

let ImageCard = (props) => {
  let user = useContext(userContext);
  let [isPlaying, setIsPlaying] = useState(false);
  let isLikedByUser = props.data.likes.includes(user.uid);
  return (
    <>
      <div className="profile-post-container">
        <div className="post-src">
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
            
          }} className="profile-comment-container">
          <CommentIcon className="profile-comments-btn" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageCard;
