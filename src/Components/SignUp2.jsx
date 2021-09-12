import { Button, Container, TextField } from "@material-ui/core";
import { firestore, storage } from "../firebase";
import { makeStyles } from "@material-ui/core/styles";
import "../CSS/signup.css";
import { useContext, useRef, useState } from "react";
import { userContext } from "./AuthProvider";
import { useHistory } from "react-router";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

const useStyles = makeStyles({
  root: {
    marginBottom: "15px",
  },

  other_login: {
    margin: "10px",
  },

  sign_up_btn: {
    margin: "10px",
  },

  bio: {
    wordBreak: "break-word",
  },
});

let SignUp = (props) => {
  const classes = useStyles();
  let [name, setName] = useState("");
  let [bio, setBio] = useState("");
  let user = useContext(userContext);
  let history = useHistory();
  const dpRef = useRef(null);
  return (
    <>
      <Container className="sign-up-box-container">
        <div className="sign-up-box">
          <div className="display-img-container">
            <img
              src="https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=750&q=80"
              alt=""
            />
          </div>
          <form color="primary">
            <TextField
              className={classes.root}
              id="name"
              label="Name"
              variant="outlined"
              color="primary"
              value={name}
              onChange={(e) => {
                setName(e.currentTarget.value);
              }}
            />
            <TextField
              className={classes.bio}
              id="bio"
              label="Bio"
              variant="outlined"
              color="primary"
              multiline
              value={bio}
              onChange={(e) => {
                setBio(e.currentTarget.value);
              }}
            />

            <Button onClick={()=>{
              dpRef.current.click();
            }} className="profile-pic-upload-container">
              Upload Profile Picture
              <CloudUploadIcon />
            </Button>
            <input
              style={{ display: "none" }}
              type="file"
              ref={dpRef}
              onChange={(e) => {
                let imgObj = e.currentTarget.files[0];
                let { type } = imgObj;
                type = type.split("/")[0];

                if (type !== "image") {
                  alert("Upload Image Only");
                  return;
                }

                let uploadTask = storage
                  .ref(`/dp/${user.uid + "-" + Date.now()}`)
                  .put(imgObj);
                uploadTask.on("state_changed", null, null, () => {
                  uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                    firestore
                      .collection("users")
                      .doc(user.uid)
                      .update({ photoURL: url });
                  });
                });
              }}
            />

            <Button
              onClick={async () => {
                let docRef = firestore.collection("users").doc(user.uid);
                await docRef.update({ displayName: name, bio: bio });

                setTimeout(() => {
                  history.push("/");
                }, 2500);
              }}
              className={classes.sign_up_btn}
              variant="contained"
              color="secondary"
            >
              Sign Up
            </Button>
          </form>
        </div>
      </Container>
    </>
  );
};

export default SignUp;
