import { Button, Container, FormControl, TextField } from "@material-ui/core";
import { auth, signUpWithGoogle } from "../firebase";
import { makeStyles } from "@material-ui/core/styles";
import "../CSS/signup.css";
import { useContext, useState } from "react";
import { userContext } from "./AuthProvider";
import { Redirect, useHistory } from "react-router";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";

const useStyles = makeStyles({
  root: {
    margin: "15px",
    width: "16rem",
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
  let [showPass, setShowPass] = useState(false);
  let user = useContext(userContext);
  let history = useHistory();
  const classes = useStyles();

  const handleClickShowPassword = () => {
    setShowPass(!showPass);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      {!user ? (
        <Container className="sign-up-box-container">
          <div className="sign-up-box">
            <div className="display-img-container">
              <img
                src="https://images.unsplash.com/photo-1586191582151-f73872dfd183?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8M3wxNzA4Mjc2fHxlbnwwfHx8fA%3D%3D&w=1000&q=80"
                alt=""
              />
            </div>
            <form>
              <TextField
                id="outlined-adornment-weight"
                value={email}
                onChange={(e) => {
                  setEmail(e.currentTarget.value);
                }}
                labelWidth={0}
                className={classes.root}
                label="Email"
                color="black"
                variant="outlined"
              />
              <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPass ? "text" : "password"}
                  value={pass}
                  onChange={(e) => {
                    setPass(e.currentTarget.value);
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPass ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  labelWidth={70}
                />
              </FormControl>
              <Button
                onClick={() => {
                  auth.signInWithEmailAndPassword(email, pass).catch((err)=>{
                    var errMsg = err.message;
                    if(errMsg === "auth/wrong-password")
                    alert("Wrong Password!!!")
                    else if(errMsg === "auth/user-not-found")
                    alert("User does not exist");
                    else
                    alert(errMsg)
                  })
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
                  <img
                    src="http://localhost:3000/icons/google-icon.svg"
                    alt="google_icon"
                  ></img>
                </Button>
              </div>
            </form>
          </div>
        </Container>
      ) : (
        <Redirect to="/"></Redirect>
      )}
    </>
  );
};

export default Login;
