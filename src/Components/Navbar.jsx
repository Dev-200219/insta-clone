import { AppBar, Button, makeStyles, Toolbar } from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import MovieFilterIcon from "@material-ui/icons/MovieFilter";
import HomeIcon from "@material-ui/icons/Home";
import { useHistory } from "react-router";
import { auth } from "../firebase";

let Navbar = () => {
  let history = useHistory();
  const useStyles = makeStyles({
    title: {
      flexGrow: 1,
      height: "5rem",
      width: "5rem",
    },
    addBtn: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
    },
    logo: {
      height: "100%",
      objectFit: "cover",
    },
    logout_logo: {
      height: "2rem",
      width: "2rem",
      borderRadius: "50%",
    },
  });
  const classes = useStyles();
  return (
    <>
      <AppBar color="white" position="fixed">
        <Toolbar>
          <div
            onClick={() => {
              history.push("/");
            }}
            className={classes.title}
          >
            <img
              className={classes.logo}
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/800px-Instagram_logo.svg.png"
              alt=""
            />
          </div>
          <Button
            onClick={() => {
              history.push("/");
            }}
          >
            <HomeIcon />
          </Button>
          <Button
            onClick={() => {
              history.push("/reels");
            }}
          >
            <MovieFilterIcon />
          </Button>
          <Button
            onClick={() => {
              history.push("/profile-page");
            }}
          >
            <AccountCircleIcon />
          </Button>
          <Button
            onClick={() => {
              auth.signOut();
            }}
          >
            <img
              className={classes.logout_logo}
              src="https://png.pngtree.com/png-clipart/20190520/original/pngtree-vector-logout-icon-png-image_4233257.jpg"
              alt=""
            />
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
