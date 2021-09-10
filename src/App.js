import AuthProvider, { userContext } from "./Components/AuthProvider";
import Login from "./Components/Login";
import SignUpPersonal from "./Components/SignUp1";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Components/Home";
import SignUp from "./Components/SignUp2";
import ProfilePage from "./Components/ProfilePage";
import { useContext } from "react";
import Reels from "./Components/Reels";

let App = () => {
  return (
    <>
      <AuthProvider>
        <Router>
          <Switch>
            <Route exact path="/reels">
              <Reels />
            </Route>
            <Route exact path="/profile-page">
              <ProfilePage />
            </Route>
            <Route exact path="/sign-up1">
              <SignUpPersonal />
            </Route>
            <Route exact path="/sign-up2">
              <SignUp />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
          </Switch>
        </Router>
      </AuthProvider>
    </>
  );
};

export default App;
