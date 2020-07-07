import React, { Component } from "react";
import { Drawer, Typography, Divider } from "@material-ui/core";
import { createStyles, withStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";
import { List, ListItem, ListItemText } from "@material-ui/core";
import { baseRoutes, loggedInRoutes, loggedOutRoutes } from "../routes";
import { RootState } from "@src/types";
import { connect } from "react-redux";
import { userSelector } from "../store/selectors";
import { WithStyles } from "@material-ui/core";

const mapStateToProps = (state: RootState) => ({
  user: userSelector(state),
  loggedIn: state.auth.loggedIn
});

const styles = createStyles({
  drawer: {
    flexShrink: 0
  },
  list: {
    width: 200
  }
});

type Props = ReturnType<typeof mapStateToProps> & WithStyles<typeof styles>;

class AppDrawer extends Component<Props, {}> {
  render() {
    const classes = this.props.classes;
    const { user, loggedIn } = this.props;
    const routes = baseRoutes.concat(loggedIn ? loggedInRoutes : loggedOutRoutes);
    const username = user?.username ?? "Not logged in";
    const listItems = routes.map((route, idx) => (
      <ListItem button key={idx}>
        <ListItemText>
          <NavLink key={idx} to={route.urlPath}>
            {route.drawerText}
          </NavLink>
        </ListItemText>
      </ListItem>
    ));
    return (
      <Drawer anchor="left" open variant="permanent" className={classes.drawer}>
        <List className={classes.list} children={listItems} />
        <Divider />
        <ListItem>
          <Typography>{username}</Typography>
        </ListItem>
      </Drawer>
    );
  }
}
export default withStyles(styles)(connect(mapStateToProps, {})(AppDrawer));
