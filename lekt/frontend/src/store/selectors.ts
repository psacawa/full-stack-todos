import { RootState } from "@src/types";

export const getUser = (state: RootState) => state.auth.user;
export const getTodos = (state: RootState) => state.todos;
export const getLoginStatus = (state: RootState) => state.auth.loggedIn;
export const getAuthKey = (state: RootState) => state.auth.key;
