import { makeStyles, Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Navbar from "./Navbar";
import "../CSS/Reels.css";
import ReelCard from "./ReelCard";
import { useContext, useEffect, useState, useRef } from "react";
import { firestore, storage } from "../firebase";
import { userContext } from "./AuthProvider";
import { Redirect } from "react-router";

let Reels = () => {
  const inputFile = useRef(null);
  let user = useContext(userContext);
  let [postsArr, setPostsArr] = useState([]);

  useEffect(async () => {
    let unsub = firestore.collection("reels").onSnapshot((querySnapshot) => {
      let docArr = querySnapshot.docs;
      let arr = [];

      for (let i = 0; i < docArr.length; i++) {
        arr.push({
          id: docArr[i].id,
          ...docArr[i].data(),
        });
      }
      setPostsArr(arr);

      return () => {
        unsub();
      };
    });
  }, []);

  const useStyles = makeStyles({
    title: {
      flexGrow: 1,
    },
    addBtn: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
    },
  });
  const classes = useStyles();
  const onButtonClick = () => {
    // `current` points to the mounted file input element
    inputFile.current.click();
  };

  return (
    <>
      {user ? (
        <>
          <div className="navbar-container">
            <Navbar />
          </div>
          <div className="all-video-container">
            {postsArr.map((el, idx) => {
              return <ReelCard key={idx} data={el} />;
            })}
          </div>
          <Fab
            onClick={() => {
              onButtonClick();
            }}
            color="primary"
            aria-label="add"
            className={classes.addBtn}
          >
            <AddIcon />
          </Fab>
          <input
            type="file"
            id="file"
            ref={inputFile}
            style={{ display: "none" }}
            onChange={(e) => {
              let uploadedObj = e.currentTarget.files[0];
              let { name, size, type } = uploadedObj;

              type = type.split("/")[0];
              size = size / 1000000;

              if (type !== "video") {
                alert("Only Videos can be uploaded");
                return;
              }

              if (size > 40) {
                alert("Can't upload files with size more than 40MB");
                return;
              }

              let uploadtask = storage
                .ref(`/reels/${user.uid}/${Date.now() + "-" + name}`)
                .put(uploadedObj);
              uploadtask.on("state_changed", null, null, () => {
                uploadtask.snapshot.ref.getDownloadURL().then((url) => {
                  firestore
                    .collection("users")
                    .doc(user.uid)
                    .get()
                    .then((docRef) => {
                      firestore.collection("reels").add({
                        uid: user.uid,
                        name: docRef.data().displayName,
                        dp: docRef.data().photoURL,
                        likes: [],
                        comments: [],
                        url: url,
                        type,
                      });
                    });
                });
              });
            }}
          />
        </>
      ) : (
        <Redirect to="/login"/>
      )}
    </>
  );
};

export default Reels;
