import { Button, Container, TextField, FormControl } from "@material-ui/core";
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
    marginBottom: "15px",
    width: "16rem",
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
  let [showPass, setShowPass] = useState(false);
  let [showConfirmPass, setShowConfirmPass] = useState(false);
  let user = useContext(userContext);
  let history = useHistory();

  const handleClickShowPassword = () => {
    setShowPass(!showPass);
  };

  const heandleConfirmPassShow = ()=>{
    setShowConfirmPass(!showConfirmPass);
  }

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
            <form color="primary">
              <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Email
                </InputLabel>
                <OutlinedInput
                  className={classes.root}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.currentTarget.value);
                  }}
                  labelWidth={40}
                />
              </FormControl>
              <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  className={classes.root}
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
              <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showConfirmPass ? "text" : "password"}
                  value={confirmPass}
                  onChange={(e) => {
                    setConfirmPass(e.currentTarget.value);
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={heandleConfirmPassShow}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showConfirmPass ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  labelWidth={132}
                />
              </FormControl>

              <Button
                onClick={() => {
                  if (email !== "" && pass !== "" && pass === confirmPass) {
                    let error;
                    auth.createUserWithEmailAndPassword(email, pass).catch((err)=>{
                      error = err;
                      alert(err.message)
                    })

                    setTimeout(()=>{
                      if(!error)
                      history.push("/sign-up2");
                    },1000);
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
                  history.push("/login");
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
                    signUpWithGoogle().catch((err)=>{
                      alert(err.message);
                    })
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

export default SignUpPersonal;
