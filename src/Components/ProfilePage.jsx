import { useContext, useEffect, useRef, useState } from "react";
import { userContext } from "./AuthProvider";
import Navbar from "./Navbar";
import "../CSS/ProfilePage.css";
import { firestore, storage } from "../firebase";
import { Redirect } from "react-router";
import ImageCard from "./ImageCard";
import { Button } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

let ProfilePage = () => {
  let user = useContext(userContext);
  let [currUserName, setCurrUserName] = useState("");
  let [currUserDP, setCurrUserDP] = useState("");
  let [currUserPost, setCurrUserPost] = useState([]);
  let [currUserBio, setCurrUserBio] = useState("");
  let [isBioInputOpen, setIsBioInputOpen] = useState(false);

  useEffect(() => {
    firestore
      .collection("users")
      .doc(user.uid)
      .get()
      .then((docRef) => {
        setCurrUserName(docRef.data().displayName);
        setCurrUserDP(docRef.data().photoURL);
        setCurrUserBio(docRef.data().bio);
      });
  }, []);

  useEffect(() => {
    firestore
      .collection("posts")
      .get()
      .then((data) => {
        let docsArr = data.docs;
        let arr = [];
        for (let i = 0; i < docsArr.length; i++) {
          if (docsArr[i].data().uid === user.uid) arr.push(docsArr[i].data());
        }
        setCurrUserPost(arr);
      });
  }, []);

  const inputFile = useRef(null);
  const inputBio = useRef(null);
  const inputBioSaveBtn = useRef(null);
  const openBioBox = () => {
    inputBio.current.style = "display:block";
    inputBioSaveBtn.current.style = "display:block";
  };
  const closeBioBox = () => {
    inputBio.current.style = "display:none";
    inputBioSaveBtn.current.style = "display:none";
  };
  const openInputBox = () => {
    inputFile.current.click();
  };

  // console.log(currUserPost.length);

  return (
    <>
      {user ? (
        <>
          <Navbar />
          <div className="profile-container">
            <div className="profile-user-info">
              <div className="profile-card">
                <div
                  onClick={() => {
                    openInputBox();
                  }}
                  className="profile-img"
                >
                  {currUserDP ? (
                    <img src={currUserDP} alt="" />
                  ) : (
                    <img src="https://i.stack.imgur.com/l60Hf.png" alt="" />
                  )}
                  <input
                    onChange={(e) => {
                      let newDPObj = e.currentTarget.files[0];
                      console.log(newDPObj);
                      let { name, type, size } = newDPObj;
                      type = type.split("/")[0];
                      if (type !== "image") {
                        alert("Upload Image Only");
                        return;
                      }

                      let uploadTask = storage
                        .ref(`/dp/${user.uid + "-" + Date.now()}`)
                        .put(newDPObj);
                      uploadTask.on("state_changed", null, null, () => {
                        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                          console.log(url);
                          firestore
                            .collection("users")
                            .doc(user.uid)
                            .update({ photoURL: url });

                          firestore
                            .collection("posts")
                            .get()
                            .then((data) => {
                              let docsArr = data.docs;
                              let arr = [];
                              for (let i = 0; i < docsArr.length; i++) {
                                if (docsArr[i].data().uid === user.uid) {
                                  docsArr[i].ref.update({ dp: url });
                                }
                              }
                            });

                          setCurrUserDP(url);
                        });
                      });
                    }}
                    ref={inputFile}
                    type="file"
                    style={{ display: "block" }}
                  ></input>
                </div>
                <div className="profile-user-name">
                  <h2>{currUserName}</h2>
                </div>
                <div className="profile-user-bio">
                  {currUserBio === "" ? (
                    <p>Add to bio..</p>
                  ) : (
                    <p>{currUserBio}</p>
                  )}
                  <Button
                    className="bio-edit-btn"
                    onClick={() => {
                      if (isBioInputOpen) {
                        setIsBioInputOpen(false);
                        closeBioBox();
                      } else {
                        setIsBioInputOpen(true);
                        openBioBox();
                      }
                    }}
                    variant="contained"
                    color="primary"
                  >
                    <EditIcon />
                  </Button>
                  <input
                    ref={inputBio}
                    type="text"
                    style={{ display: "none" }}
                    value={currUserBio}
                    onChange={(e) => {
                      setCurrUserBio(e.currentTarget.value);
                    }}
                  ></input>
                  <Button
                    onClick={() => {
                      closeBioBox();
                      firestore
                        .collection("users")
                        .doc(user.uid)
                        .get()
                        .then((docRef) => {
                          docRef.ref.update({ bio: currUserBio });
                        });
                    }}
                    style={{ display: "none" }}
                    ref={inputBioSaveBtn}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
            <div className="profile-user-posts">
              <h2>My Posts : {currUserPost.length}</h2>
              <div className="profile-posts-carousel">
                {currUserPost.map((el, idx) => {
                  return <ImageCard key={idx} data={el} />;
                })}
              </div>
            </div>
          </div>
        </>
      ) : (
        <Redirect to="/login" />
      )}
    </>
  );
};

export default ProfilePage;
