import React from 'react';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import "main.css"

function App() {
  return (
    <div className="App">
    <h3>Persistent Todo App</h3>
      <TodoList />
      <TodoForm />
    </div>
  );
}

export default App;
