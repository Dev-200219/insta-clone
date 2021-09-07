import "../CSS/ImageCard.css";

let ImageCard = (props) => {
  return (
    <>
      <div className="profile-post-container">
        <div className="post-src">
          {props.data.type === "image" ? (
            <img src={props.data.url} alt="" />
          ) : (
            <video src={props.data.url} alt="" />
          )}
        </div>
        <div className="post-likes-comm"></div>
      </div>
    </>
  );
};

export default ImageCard;
