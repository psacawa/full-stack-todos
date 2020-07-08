import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { RootState } from "../types";
import { login } from "../store/actions";
import { connect } from "react-redux";
import * as yup from "yup";
import {
  Button,
  withStyles,
  WithStyles,
  FormHelperText,
  Typography
} from "@material-ui/core";
import { TextField } from "formik-material-ui";

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .required()
    .label("Username"),
  password: yup
    .string()
    .required()
    .label("Password")
});

const styles = {
  submitButton: {
    margin: "10px"
  }
};

const mapStateToProps = (state: RootState) => ({
  loggedIn: state.auth.loggedIn,
  serverErrors: state.display.login.serverErrors
});

const dispatchProps = {
  login: login.request
};

type Props = WithStyles<typeof styles> &
  ReturnType<typeof mapStateToProps> &
  typeof dispatchProps;

class LoginView extends Component<Props> {
  render() {
    const { login, loggedIn, serverErrors } = this.props;
    const classes = this.props.classes;
    return loggedIn ? (
      <Redirect to="/" />
    ) : (
      <>
        <Typography variant="h5">Login</Typography>
        <Formik
          initialValues={{
            username: "",
            password: ""
          }}
          validationSchema={validationSchema}
          onSubmit={(values, bag) => {
            login(values, bag);
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
                name="password"
              />
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
  }
}

export default connect(mapStateToProps, dispatchProps)(withStyles(styles)(LoginView));
