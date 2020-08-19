import React, { Component } from "react";
import { RootState } from "@src/types";
import { removeTodo } from "store/actions";
import { connect } from "react-redux";
import { getTodos } from "store/selectors";
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
import { toPairs } from "lodash";

const styles = {
  list: {
    width: 300
  }
};

const mapStateToProps = (state: RootState) => ({
  todos: getTodos(state)
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
    const { removeTodo, todos, classes } = this.props;
    return (
      <div className="Todos">
        <List className={classes.list} dense>
          {toPairs(todos).map(([key, todo]) => (
            <ListItem key={todo.value.id}>
              <ListItemText primary={todo.value.text}></ListItemText>
              {todo.isSubmitting ? (
                <ListItemSecondaryAction>
                  <IconButton>
                    <CircularProgress size="1em" />
                  </IconButton>
                </ListItemSecondaryAction>
              ) : (
                <ListItemSecondaryAction onClick={() => removeTodo(todo.value.id)}>
                  <IconButton>
                    <Clear />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}
export default connect(mapStateToProps, dispatchProps)(withStyles(styles)(TodoList));
