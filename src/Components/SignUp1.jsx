import { Button, Container, TextField } from "@material-ui/core";
import { auth, signUpWithGoogle } from "../firebase";
import { makeStyles } from "@material-ui/core/styles";
import "../CSS/signup.css";
import { useContext, useState } from "react";
import { userContext } from "./AuthProvider";
import { Redirect, useHistory } from "react-router";

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

let SignUpPersonal = () => {
  const classes = useStyles();
  let [email, setEmail] = useState("");
  let [pass, setPass] = useState("");
  let [confirmPass, setConfirmPass] = useState("");
  let user = useContext(userContext);
  let history = useHistory();
  return (
    <>
      {!user ? (
        <Container className="sign-up-box">
          <form color="primary">
            <TextField
              className={classes.root}
              id="email"
              label="Email"
              variant="outlined"
              color="primary"
              value={email}
              onChange={(e) => {
                setEmail(e.currentTarget.value);
              }}
            />
            <TextField
              className={classes.root}
              id="password"
              label="Password"
              type="password"
              variant="outlined"
              color="primary"
              value={pass}
              onChange={(e) => {
                setPass(e.currentTarget.value);
              }}
            />
            <TextField
              className={classes.root}
              id="password"
              label="Confirm Password"
              type="password"
              variant="outlined"
              color="primary"
              value={confirmPass}
              onChange={(e) => {
                setConfirmPass(e.currentTarget.value);
              }}
            />
            <Button
              onClick={() => {
                if (pass === confirmPass) {
                  auth.createUserWithEmailAndPassword(email, pass);
                  history.push("/sign-up2");
                }
              }}
              className={classes.sign_up_btn}
              variant="contained"
              color="secondary"
            >
              Sign Up
            </Button>

            <Button
              onClick={() => {
               history.push("/login")
              }}
              className={classes.sign_up_btn}
              variant="contained"
              color="secondary"
            >
              Log In
            </Button>

            <div className={classes.other_login}>
              <Button
                onClick={() => {
                  signUpWithGoogle();
                }}
              >
                <img src="http://localhost:3000/icons/google-icon.svg"></img>
              </Button>
            </div>
          </form>
        </Container>
      ) : (
        <Redirect to="/"></Redirect>
      )}
    </>
  );
};

export default SignUpPersonal;
