import React, { Component } from "react";
import { RootState } from "@src/types";
import { removeTodo } from "../store/actions";
import { connect } from "react-redux";
import { todosSelector } from "../store/selectors";
import CircularProgress from "@material-ui/core/CircularProgress";
import Clear from "@material-ui/icons/Clear";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  WithStyles,
  withStyles
} from "@material-ui/core";

const styles = {
  list: {
    width: 300
  }
};

const mapStateToProps = (state: RootState) => ({
  todos: todosSelector(state),
  isFetching: state.display.todos.isFetching
});
const dispatchProps = {
  removeTodo: removeTodo.request
};
type Props = ReturnType<typeof mapStateToProps> &
  typeof dispatchProps &
  WithStyles<typeof styles>;

class TodoList extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }
  render() {
    const { removeTodo, todos, isFetching, classes } = this.props;
    return isFetching ? (
      <CircularProgress />
    ) : (
      <div className="Todos">
        <List className={classes.list} dense>
          {todos.map(todo => (
            <ListItem key={todo.id}>
              <ListItemText primary={todo.text}></ListItemText>
              <ListItemSecondaryAction onClick={() => removeTodo(todo.id)}>
                <IconButton>
                  <Clear />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}
export default connect(mapStateToProps, dispatchProps)(withStyles(styles)(TodoList));
