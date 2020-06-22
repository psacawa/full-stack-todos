import { Component } from "react";
import LoginView from "./views/LoginView";
import LogoutView from "./views/LogoutView";
import TodoView from "./views/TodoView";
import CreateAccountView from "./views/CreateAccountView";
interface AppRoute {
  urlPath: string;
  drawerText: string;
  component: React.ComponentType<any>;
  exact: boolean;
}
export const baseRoutes: AppRoute[] = [
  {
    urlPath: "/",
    drawerText: "Todos",
    component: TodoView,
    exact: true
  },
];
export const loggedOutRoutes: AppRoute[] = [
  {
    urlPath: "/login",
    drawerText: "Login",
    component: LoginView,
    exact: false
  },
  {
    urlPath: "/create-account",
    drawerText: "Create Account",
    component: CreateAccountView,
    exact: false
  },
]

export const loggedInRoutes: AppRoute[] = [
  {
    urlPath: "/logout",
    drawerText: "Logout",
    component: LogoutView,
    exact: false
  },
]

const routes = baseRoutes.concat(loggedInRoutes).concat(loggedOutRoutes)
export default  routes
