import React, { Component } from "react";
import { RootState } from "@src/types";
import { removeTodo } from "../store/actions";
import { connect } from "react-redux";
import {todosSelector} from '../store/selectors';
import CircularProgress from "@material-ui/core/CircularProgress";

const mapStateToProps = (state: RootState) => ({
  todos: todosSelector(state),
  isFetching: state.display.isFetching
});
const dispatchProps = {
  removeTodo: removeTodo.request,
};
type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps 

class TodoList extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }
  render() {
    const { removeTodo, todos, isFetching } = this.props;
    return isFetching ? (
      <CircularProgress />
    ) : (
      <div className="Todos">
        <table>
          <tbody>
            {todos.map(todo => (
              <tr key={todo.id}>
                <td>{todo.text}</td>
                <td><b>{todo.author}</b></td>
                <td>
                <button onClick={() => removeTodo(todo.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
export default connect(mapStateToProps, dispatchProps)(TodoList);
