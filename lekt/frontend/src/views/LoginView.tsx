import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { LoginFormValues } from "../types";
import { login } from "../store/actions";
import { connect } from "react-redux";

const dispatchProps = {
  login: login.request
};

type Props = typeof dispatchProps;

class LoginView extends Component<Props, {}> {
  render() {
    const { login } = this.props;
    return (
      <>
        <h3>Login</h3>
        <Formik
          initialValues={{
            username: "",
            password: ""
          }}
          onSubmit={values => {login(values)}}
        >
          <Form>
            <p>
              <label htmlFor="username">Username: </label>
              <Field type="text" name="username" />
            </p>
            <p>
              <label htmlFor="password">Password: </label>
              <Field type="text" name="password" />
            </p>
            <input type="submit" value="Submit" name="" id="" />
          </Form>
        </Formik>
      </>
    );
  }
}

export default connect(null, dispatchProps)(LoginView);
