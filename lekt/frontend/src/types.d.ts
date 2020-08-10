import { StateType } from "typesafe-actions";
import {Brand} from 'utility-types';

type Id = Brand <string, "Id">

export interface Todo {
  id: Id;
  text: string;
}
export interface PersistanceWrapper<T> {
  value: T;
  isSubmitting: boolean;
}
export type TodoState = Record<string, PersistanceWrapper<Todo>>;

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
  email: string;
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

type Incomplete<T> = Omit<T, "id">;

export type RootState = StateType<typeof import("@src/store/reducers").default>;
