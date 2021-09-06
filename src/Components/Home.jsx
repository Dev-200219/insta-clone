import {
  AppBar,
  Button,
  makeStyles,
  Toolbar,
  Typography,
  Fab,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddIcon from "@material-ui/icons/Add";
import { useContext, useEffect, useRef } from "react";
import { Redirect, useHistory } from "react-router";
import { auth, firestore, storage } from "../firebase";
import { userContext } from "./AuthProvider";
import VideoCard from "./VideoCard";
import "../CSS/Home.css";

let Home = () => {
  const inputFile = useRef(null);
  let history = useHistory();
  let user = useContext(userContext);
  let doc, docRef, userName;

  useEffect(async () => {
    if (user) {
      docRef = firestore.collection("users").doc(user.uid);
      console.log(docRef);
      doc = await docRef.get();
      userName = await doc.data().name;

      if (userName) {
        history.push("/sign-up2");
      }
    }
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
          <AppBar position="fixed">
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                Instagram
              </Typography>
              <Button>
                <AccountCircleIcon />
              </Button>
              <Button
                onClick={() => {
                  auth.signOut();
                }}
                color="inherit"
              >
                Logout
              </Button>
            </Toolbar>
          </AppBar>
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

              if (type !== "video" && type !== "image") {
                alert("Only Images and Videos can be uploaded");
                return;
              }

              if (size > 15) {
                alert("Can't upload files with size more than 15MB");
                return;
              }

              let uploadtask = storage
                .ref(`/posts/${user.uid}/${Date.now() + "-" + name}`)
                .put(uploadedObj);
              uploadtask.on("state_changed", null, null, () => {
                uploadtask.snapshot.ref.getDownloadURL().then((url) => {
                  firestore.collection("posts").add({
                    id: user.uid,
                    likes: [],
                    comments: [],
                    url: url,
                    type,
                  });
                });
              });
            }}
          />
          <div className="posts-container">
            <VideoCard />
            <VideoCard />
            <VideoCard />
          </div>
        </>
      ) : (
        <Redirect to="/login"></Redirect>
      )}
    </>
  );
};

export default Home;
