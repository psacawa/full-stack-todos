import { RootState } from "@src/types";

export const userSelector = (state: RootState) => state.auth.user;
export const todosSelector = (state: RootState) => state.todos
