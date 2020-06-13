export {};
declare module "typesafe-actions" {
  import { ActionType } from "typesafe-actions";
  export type RootAction = ActionType<typeof import("./actions").default>;
}
