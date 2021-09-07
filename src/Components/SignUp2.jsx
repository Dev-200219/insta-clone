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
});

let SignUp = (props) => {
  const classes = useStyles();
  let [name, setName] = useState("");
  let user = useContext(userContext);
  let history = useHistory();
  return (
    <>
      <Container className="sign-up-box">
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

          <Button
            onClick={async () => {
              let docRef = firestore.collection("users").doc(user.uid);
              await docRef.update({ displayName: name });

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
      </Container>
    </>
  );
};

export default SignUp;
