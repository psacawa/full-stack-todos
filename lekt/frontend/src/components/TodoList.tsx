import React, { Component } from "react";
import { RootState } from "@src/types";
import { removeTodo, fetchTodos } from "../store/actions";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";

const mapStateToProps = (state: RootState) => ({
  todos: state.todos,
  isFetching: state.display.isFetching
});
const dispatchProps = {
  removeTodo: removeTodo.request,
  fetchTodos: fetchTodos.request
};
type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

class TodoList extends Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }
  // componentDidMount() {
  //   this.props.fetchTodos();
  // }
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
