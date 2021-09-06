import "../CSS/VideoCard.css"
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

let VideoCard = () => {
  return (
    <>
      <div className="video-card-container">
        <div className="data-container">
          <img src="https://api.time.com/wp-content/uploads/2017/02/2-instagram-edit-multiple.png"></img>
        </div>
        <div className="vl"></div>
        <div className="like-comment-container">
            <FavoriteBorderIcon className="like-btn"/>
        </div>
      </div>
    </>
  );
};

export default VideoCard;
