import { makeStyles, Fab, CircularProgress } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useContext, useEffect, useRef, useState } from "react";
import { Redirect, useHistory } from "react-router";
import { firestore, storage } from "../firebase";
import { userContext } from "./AuthProvider";
import VideoCard from "./VideoCard";
import "../CSS/Home.css";
import Navbar from "./Navbar";

let Home = () => {
  const inputFile = useRef(null);
  let history = useHistory();
  let user = useContext(userContext);
  let doc, docRef, userName;
  let [posts, setPosts] = useState([]);
  let [isUploading, setIsUploading] = useState(false);

  useEffect(async () => {
    if (user) {
      docRef = firestore.collection("users").doc(user.uid);
      doc = await docRef.get();
      userName = await doc.data().name;

      if (userName) {
        history.push("/sign-up2");
      }
    }

    let unsub = firestore.collection("posts").onSnapshot((querySnapshot) => {
      let docArr = querySnapshot.docs;
      let arr = [];

      for (let i = 0; i < docArr.length; i++) {
        arr.push({
          id: docArr[i].id,
          ...docArr[i].data(),
        });
      }
      setPosts(arr);

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
          <Navbar />
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

              if (type !== "image") {
                alert("Only Images can be uploaded");
                return;
              }

              if (size > 15) {
                alert("Can't upload files with size more than 15MB");
                return;
              }

              let uploadtask = storage
                .ref(`/posts/${user.uid}/${Date.now() + "-" + name}`)
                .put(uploadedObj);
              uploadtask.on(
                "state_changed",
                (snapshot) => {
                  var percent =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log(percent + "% done");
                  if (percent >= 0 && percent < 100) {
                    setIsUploading(true);
                  } else {
                    setIsUploading(false);
                  }
                },
                null,
                () => {
                  uploadtask.snapshot.ref.getDownloadURL().then((url) => {
                    firestore
                      .collection("users")
                      .doc(user.uid)
                      .get()
                      .then((docRef) => {
                        firestore.collection("posts").add({
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
                }
              );
            }}
          />
          {isUploading ? (
            <CircularProgress className="progress-circle" color="secondary" />
          ) : (
            ""
          )}
          <div className="posts-container">
            {posts.map((el, idx) => {
              return <VideoCard key={idx} data={el} />;
            })}
          </div>
        </>
      ) : (
        <Redirect to="/login"></Redirect>
      )}
    </>
  );
};

export default Home;
