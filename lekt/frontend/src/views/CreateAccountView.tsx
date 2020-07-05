import React, { useCallback } from "react";
import { Formik, Field, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { createAccount } from "../store/actions";
import { CreateAccountData, RootState } from "../types";
import { TextField } from "formik-material-ui";
import { Typography, FormHelperText } from "@material-ui/core";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .required()
    .matches(
      /[\w-]{4,20}/,
      "Username must consist of letters, numbers, - or _ and have length between 4 and 20."
    ),
  password1: yup
    .string()
    .required()
    .min(8, "The minimum password length is 8."),
  password2: yup
    .string()
    .required()
    .oneOf([yup.ref("password1")], "Passwords don't match."),
  email: yup
    .string()
    .required()
    .email("Enter a valid email address.")
});

// const matStateToProps

export default () => {
  const dispatch = useDispatch();
  const createAccountCallback = useCallback(
    (values: CreateAccountData) => dispatch(createAccount.request(values)),
    [dispatch]
  );
  const serverErrors = useSelector(
    (state: RootState) => state.display.account.serverErrors
  );
  return (
    <>
      <Typography variant="h5">Create New Account</Typography>
      <Formik
        initialValues={{
          username: "",
          password1: "",
          password2: "",
          email: ""
        }}
        validationSchema={validationSchema}
        onSubmit={values => {
          createAccountCallback(values);
        }}
      >
        <Form>
          <div>
            <Field component={TextField} label="Username" type="text" name="username" />
          </div>
          <div>
            <Field
              component={TextField}
              label="Password"
              type="password"
              name="password1"
            />
          </div>
          <div>
            <Field
              component={TextField}
              label="Repeat Password"
              type="password"
              name="password2"
            />
          </div>
          <div>
            <Field component={TextField} type="email" label="Email" name="email" />
          </div>
          <input type="submit" value="Create Account" name="" id="" />
        </Form>
      </Formik>
      {serverErrors.map(error => (
        <FormHelperText error>{error}</FormHelperText>
      ))}
    </>
  );
};
