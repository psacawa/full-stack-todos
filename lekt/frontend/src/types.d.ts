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
export type RootState = StateType<typeof import("@src/store/reducers").default>;
