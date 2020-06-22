import { StateType } from "typesafe-actions";

export interface TodoData {
  id?: number;
  text: string;
  author: string;
}
export type Todo = Required<TodoData>;
export type TodoState = Todo[];

export interface DisplayState {
  isFetching: boolean;
}

interface CreateAccountFormValues {
  username: string;
  password1: string;
  password2: string;
}
interface LoginFormValues {
  username: string;
  password: string;
}

interface AuthData {
  key: string;
}

interface User {
  pk: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface UserState extends Optional <AuthData> {
  loggedIn: boolean;
  user?: User,
}

export type RootState = StateType<typeof import("@src/store/reducers").default>;
