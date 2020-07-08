import React, { useCallback } from "react";
import { Formik, Field, Form, FormikHelpers } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { loggedInSelector } from "../store/selectors";
import { createAccount } from "../store/actions";
import { CreateAccountData, RootState } from "../types";
import { TextField } from "formik-material-ui";
import { Typography, FormHelperText, Button, makeStyles } from "@material-ui/core";
import * as yup from "yup";
import { Redirect } from "react-router-dom";

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

const useStyles = makeStyles({
  submitButton: {
    margin: "10px"
  }
});

export default () => {
  const classes = useStyles();
  const loggedIn = useSelector(loggedInSelector);
  const dispatch = useDispatch();
  const createAccountCallback = useCallback(
    (values: CreateAccountData, bag: FormikHelpers<any>) =>
      dispatch(createAccount.request(values, bag)),
    [dispatch]
  );
  const serverErrors = useSelector(
    (state: RootState) => state.display.account.serverErrors
  );
  // const isFetching = useSelector((state: RootState) => state.display.account.isFetching);
  return loggedIn ? (
    <Redirect to="/" />
  ) : (
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
        onSubmit={(values, bag) => {
          createAccountCallback(values, bag);
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
          {serverErrors.map((error, idx) => (
            <FormHelperText key={idx} error>
              {error}
            </FormHelperText>
          ))}
          <Button className={classes.submitButton} variant="outlined" type="submit">
            Submit
          </Button>
        </Form>
      </Formik>
    </>
  );
};
