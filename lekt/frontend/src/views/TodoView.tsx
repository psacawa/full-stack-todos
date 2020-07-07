import React from "react";
import TodoList from "../components/TodoList";
import TodoForm from "../components/TodoForm";
import { Typography } from "@material-ui/core";

export default () => (
  <>
    <Typography variant="h5">Persistent Todo App</Typography>
    <TodoList />
    <TodoForm />
  </>
);
