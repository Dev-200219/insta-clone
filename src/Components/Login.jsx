import { Button, Container, TextField } from "@material-ui/core";
import { auth, signUpWithGoogle } from "../firebase";
import { makeStyles } from "@material-ui/core/styles";
import "../CSS/signup.css";
import { useContext, useState } from "react";
import { userContext } from "./AuthProvider";
import { Redirect, useHistory } from "react-router";

const useStyles = makeStyles({
  root: {
    margin: "15px",
  },

  other_login: {
    margin: "10px",
  },

  sign_up_btn: {
    margin: "10px",
  },
});

let Login = () => {
  let [email, setEmail] = useState("");
  let [pass, setPass] = useState("");
  let user = useContext(userContext);
  let history = useHistory();
  const classes = useStyles();
  return (
    <>
      {!user ? (
        <Container className="sign-up-box">
          <form>
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
            <Button
              onClick={() => {
                auth.signInWithEmailAndPassword(email, pass);
              }}
              className={classes.sign_up_btn}
              variant="contained"
              color="secondary"
            >
              Log In
            </Button>

            <Button
              onClick={() => {
                history.push("/sign-up1");
              }}
              className={classes.sign_up_btn}
              variant="contained"
              color="secondary"
            >
              Sign Up
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

export default Login;
