import { StateType } from "typesafe-actions";

export interface TodoData {
  id?: number;
  text: string;
}
export type Todo = Required<TodoData>;
export type TodoState = Todo[];

export interface TodoDisplayState {
  isFetching: boolean;
}
export interface LoginDisplayState {
  isFetching: boolean;
  serverErrors: string[];
}
export interface CreateAccountDisplayState {
  isFetching: boolean;
  serverErrors: string[];
}

export interface DisplayState {
  todo: TodoDisplayState;
  login: LoginDisplayState;
  createAccount: CreateAccountDisplayState;
}

interface CreateAccountData {
  username: string;
  password1: string;
  password2: string;
  email: string;
}
interface LoginData {
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

interface LoginSuccessPayload extends AuthData {
  user: User;
}

interface UserState {
  loggedIn: boolean;
  user?: User;
  key?: string;
}

export type RootState = StateType<typeof import("@src/store/reducers").default>;
