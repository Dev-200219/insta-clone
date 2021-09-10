import { Button, Container, TextField } from "@material-ui/core";
import { firestore } from "../firebase";
import { makeStyles } from "@material-ui/core/styles";
import "../CSS/signup.css";
import { useContext, useState } from "react";
import { userContext } from "./AuthProvider";
import { useHistory } from "react-router";

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
    height: "5rem",
    wordBreak: "break-word",
  },
});

let SignUp = (props) => {
  const classes = useStyles();
  let [name, setName] = useState("");
  let [bio, setBio] = useState("");
  let user = useContext(userContext);
  let history = useHistory();
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
              value={bio}
              onChange={(e) => {
                setBio(e.currentTarget.value);
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
