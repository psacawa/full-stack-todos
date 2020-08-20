import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import configureStore from "redux-mock-store";

import TodoList from "./TodoList";
import { Provider } from "react-redux";
import { removeTodo } from "store/actions";
import { Id, TodoState, RootState } from "@src/types";
import { DeepPartial } from "utility-types";

let createMockStore = configureStore([]);

describe("TodoList", () => {
  let store: ReturnType<typeof createMockStore>;
  let container: ReturnType<typeof render>;

  beforeEach(() => {
    store = createMockStore({
      todos: {
        "1": { isSubmitting: false, value: { id: "1", text: "lekt" } },
        tmpKey: { isSubmitting: false, value: { id: "tmpKey", text: "full-stack-todos" } }
      }
    });
    store.dispatch = jest.fn();
    const { container } = render(
      <Provider store={store}>
        <TodoList />
      </Provider>
    );
  });

  it("renders todo state", () => {
    expect.assertions(5);
    expect(screen.getByText(/lekt/i)).toBeInTheDocument();
    expect(screen.getByText(/full-stack-todos/i)).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(2);

    fireEvent.click(screen.getAllByRole("button")[0]);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(removeTodo.request("1" as Id));
  });
});
