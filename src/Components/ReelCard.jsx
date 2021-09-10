import { useContext, useState } from "react";
import AudiotrackIcon from "@material-ui/icons/Audiotrack";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteSharpIcon from "@material-ui/icons/FavoriteSharp";
import { firestore } from "../firebase";
import CommentIcon from "@material-ui/icons/Comment";
import "../CSS/ReelCard.css";
import { userContext } from "./AuthProvider";
let ReelCard = (props) => {
  let user = useContext(userContext);
  let [isPlaying, setIsPlaying] = useState(false);
  let isLikedByUser = props.data.likes.includes(user.uid);
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
          <div className="comment-btn-container">
            <CommentIcon className="reels-comments-btn" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ReelCard;
