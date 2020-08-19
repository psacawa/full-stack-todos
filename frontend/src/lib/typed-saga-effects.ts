import { take as rawTake } from "redux-saga/effects";
import { SagaGenerator } from "typed-redux-saga";
import { Action } from "@reduxjs/toolkit";

export function takeCreator<AC extends (...args: any[]) => Action>(
  pattern?: AC
): SagaGenerator<ReturnType<AC>, never>;
export function takeCreator<AC extends (...args: any[]) => Action>(
  pattern?: AC[]
): SagaGenerator<ReturnType<AC>, never>;
export function* takeCreator(...args: any): any {
  return yield rawTake(...args);
}
