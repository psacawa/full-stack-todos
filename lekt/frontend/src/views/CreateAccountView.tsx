import React from "react";
import { Formik, Field, Form } from "formik";

interface FormValues {
  username: string;
  password: string;
}

export default () => {
  window.location.pathname = '/auth/'
  return (
    <>
      <h3>Create New Account</h3>
      <Formik
        initialValues={{
          username: "",
          password: ""
        }}
        validate={(values: FormValues) => {
          // let errors: FormikErrors<FormValues> = {};
        }}
        onSubmit={values => {}}
      >
        <Form>
          <div>
            <label htmlFor="username">Username: </label>
            <Field type="text" name="username" />
          </div>
          <div>
            <label htmlFor="password">Password: </label>
            <Field type="text" name="password" />
          </div>
          <input type="submit" value="Create Account" name="" id="" />
        </Form>
      </Formik>
    </>
  );
};
