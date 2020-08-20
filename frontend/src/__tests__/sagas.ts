import { rest } from "msw";
import { setupServer } from "msw/node";
import { expectSaga } from "redux-saga-test-plan";
import { login } from "store/actions";
import * as api from "store/services";
import rootSaga, { loginFlow, authenticate } from "store/sagas";
import * as matchers from "redux-saga-test-plan/matchers";

const server = setupServer(
  rest.post("/auth/login/", (req, res, ctx) => {
    return res(ctx.json({ key: "a354ef19d9efe0170e912cf5760db597533da8fb" }));
  }),
  rest.get("/api/todos/", (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 1, text: "lekt" },
        { id: 2, text: "other todo" }
      ])
    );
  })
);

describe("login saga", () => {
  const user = {
    pk: 1,
    username: "psacawa",
    first_name: "paweł",
    last_name: "sacawa",
    email: "psacawa@abc.com"
  };
  const loginResponseData = { key: "asdf1234" };
  xit("login success", () => {
    return expectSaga(loginFlow)
      .put(login.success({ user, ...loginResponseData }))
      // .fork(authenticate)
      .dispatch(login.request({ email: "psacawa@abc.com", password: "asdfasdf" }))
      .provide([[matchers.call(api.login), loginResponseData]])
      .run();
  });
});
