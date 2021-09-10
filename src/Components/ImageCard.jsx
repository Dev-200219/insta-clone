import { useState } from "react";
import "../CSS/ImageCard.css";

let ImageCard = (props) => {
  let [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <div className="profile-post-container">
        <div className="post-src">
          {props.data.type === "image" ? (
            <img src={props.data.url} alt="" />
          ) : (
            <video onClick={(e)=>{
              if(isPlaying)
              {
                setIsPlaying(false)
                e.currentTarget.pause();
              }
              else
              {
                setIsPlaying(true);
                e.currentTarget.play();
              }
            }} src={props.data.url} alt="" />
          )}
        </div>
        <div className="post-likes-comm"></div>
      </div>
    </>
  );
};

export default ImageCard;
