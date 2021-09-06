import AuthProvider from "./Components/AuthProvider";
import Login from "./Components/Login";
import SignUpPersonal from "./Components/SignUp1";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Components/Home";
import SignUp from "./Components/SignUp2";

let App = () => {
  return (
    <>
      <Router>
        <AuthProvider>
          <Switch>
            <Route exact path="/sign-up1">
              <SignUpPersonal />
            </Route>
            <Route exact path="/sign-up2">
              <SignUp/>
            </Route>
            <Route exact path="/login">
              <Login/>
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
          </Switch>
        </AuthProvider>
      </Router>
    </>
  );
};

export default App;
