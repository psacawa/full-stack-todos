import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import { makeStyles } from "@material-ui/core";
import AppDrawer from "./components/AppDrawer";
import "main.css";
import routes from "./routes";

const history = createBrowserHistory();

const useStyles = makeStyles({
  root: { display: "flexbox" },
  content: { marginLeft: 200 }
});

function App() {
  const classes = useStyles();
  return (
    <Router history={history}>
      <AppDrawer />
      <main className={classes.content}>
        <Switch>
          {routes.map((route, idx) => {
            return (
              <Route
                key={idx}
                path={route.urlPath}
                exact={route.exact}
                component={route.component}
              />
            );
          })}
        </Switch>
      </main>
    </Router>
  );
}

export default App;
