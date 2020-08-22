import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import configureStore from "redux-mock-store";

import TodoList from "components/TodoList";
import { Provider } from "react-redux";
import { removeTodo } from "store/actions";
import { Id, TodoState, RootState } from "@src/types";
import { DeepPartial } from "utility-types";
import TodoForm from "components/TodoForm";

let createMockStore = configureStore([]);

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
});

describe("TodoList", () => {
  beforeEach(() => {
    render(
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

    userEvent.click(screen.getAllByRole("button")[0]);

    expect(store.dispatch)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith(removeTodo.request("1" as Id));
  });
});

describe("TodoForm", () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <TodoForm />
      </Provider>
    );
  });
  it("renders properly", async () => {
    expect(screen.getByRole("textbox"))
      .toHaveValue("")
      .toBeEnabled();
    expect(screen.getByRole("button"))
      .toHaveTextContent(/submit/i)
      .toBeEnabled();
  });
  it("form renders error on no input", async () => {
    const textbox = screen.getByRole("textbox", { name: /todo/i });
    await screen.findByLabelText("Todo")
    fireEvent.click(textbox);
    fireEvent.blur(textbox);
    await screen.findByText(/text.*required/i)
  });
});

describe("aria", () => {
  beforeEach(() => {
    render(
      <>
        <a href="/">
          <img src="/" alt="a dog!" /> click
        </a>
        <button>submit</button>
      </>
    );
  });
  it("role test", () => {
    screen.getByRole("link", { name: /dog.+click/ });
    screen.getByRole("button", { name: /submit/ });
  });
});
