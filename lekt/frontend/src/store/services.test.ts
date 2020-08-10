import axios from "axios";
import * as api from "./services";
import { Id } from "@src/types";
import { existsSync } from "fs";

jest.mock("axios");

// let mockExistsSync = existsSync as any as jest.Mock<typeof existsSync>;
let mockAxios = axios as jest.Mocked<typeof axios>;

describe("addTodos endpoint", () => {
  const inputTodo = { id: "qwer1234" as Id, text: "test todo app" };
  it("success", async () => {
    const inputTodo = { id: "qwer1234" as Id, text: "test todo app" };
    const completeTodo = { ...inputTodo, owner: 1 };
    const resp = { status: 200, data: completeTodo };
    mockAxios.post.mockResolvedValueOnce(resp);

    await expect(api.addTodo(inputTodo)).resolves.toEqual({ data: completeTodo });
    await expect(axios.post).toHaveBeenCalledWith("/api/todos/", inputTodo);
  });

  it("client error", async () => {
    const resp = {
      response: {
        status: 400,
        data: { text: ["This field is required."] }
      }
    };
    mockAxios.post.mockRejectedValueOnce(resp);

    await expect(api.addTodo(inputTodo)).resolves.toEqual({
      errors: ["This field is required."]
    });
  });

  it("authorization error", async () => {
    const resp = {
      response: {
        status: 401,
        data: { detail: "Authentication credentials were not provided." }
      }
    };
    mockAxios.post.mockRejectedValueOnce(resp);
    await expect(api.addTodo(inputTodo)).resolves.toEqual({
      errors: ["Authentication credentials were not provided."]
    });
  });

  it("request not fired", async () => {
    const resp = {};
    mockAxios.post.mockRejectedValueOnce(resp);
    await expect(api.addTodo(inputTodo)).resolves.toEqual({
      errors: ["Request failed"]
    });
  });
});

describe("fetchTodos endpoint", () => {
  xit("fetchTodos endpoint", () => {
    const todos = [{ id: 3, owner: 1, text: "todo1" }];
    const resp = { status: 200, data: todos };
    (axios.get as jest.Mock).mockResolvedValueOnce(resp);
    expect(api.fetchTodos());
  });
});
