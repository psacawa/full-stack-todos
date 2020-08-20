import axios from "axios";
import * as api from "store/services";
import { Id, Todo } from "@src/types";

jest.mock("axios");

let mockAxios = axios as jest.Mocked<typeof axios>;

describe("addTodos endpoint", () => {
  const inputTodo = { id: "qwer1234" as Id, text: "test todo app" };
  it("success", async () => {
    const inputTodo = { id: "qwer1234" as Id, text: "test todo app" };
    const completeTodo = { ...inputTodo, owner: 1 };
    const resp = { status: 200, data: completeTodo };
    mockAxios.post.mockResolvedValueOnce(resp);

    await expect(api.addTodo(inputTodo)).resolves.toEqual(completeTodo);
    expect(axios.post).toHaveBeenCalledWith("/api/todos/", inputTodo);
  });

  it("client validation error", async () => {
    const resp = {
      response: {
        status: 400,
        data: { text: ["This field is required."] }
      }
    };
    mockAxios.post.mockRejectedValueOnce(resp);

    expect.hasAssertions();
    return api.addTodo(inputTodo).catch((error: api.ValidationError<Todo>) => {
      expect(error).toBeInstanceOf(api.ValidationError);
      expect(error.validationErrors).toMatchObject({ text: ["This field is required."] });
    });
  });

  it("client authentication error", async () => {
    const resp = {
      response: {
        status: 401,
        data: { detail: "Authentication credentials were not provided." }
      }
    };
    mockAxios.post.mockRejectedValueOnce(resp);
    expect.hasAssertions();
    await api.addTodo(inputTodo).catch((error: api.ClientError) => {
      expect(error).toBeInstanceOf(api.ClientError);
      expect(error.message).toEqual("Authentication credentials were not provided.");
    });
  });

  it("server error", async () => {
    const resp = {
      response: {
        status: 500,
        data: "<p>500 Internal Server Error</p>"
      }
    };
    mockAxios.post.mockRejectedValueOnce(resp);
    expect.hasAssertions();
    await api.addTodo(inputTodo).catch((error: api.ServerError) => {
      expect(error).toBeInstanceOf(api.ServerError);
      expect(error.message).toMatch(/server error/i);
    });
  });
});

describe("fetchTodos endpoint", () => {
  it("fetchTodos endpoint", () => {
    const todos = [{ id: 3, owner: 1, text: "todo1" }];
    const resp = { status: 200, data: todos };
    mockAxios.get.mockResolvedValueOnce(resp);
    expect(api.fetchTodos()).resolves.toEqual(todos);
  });
});
