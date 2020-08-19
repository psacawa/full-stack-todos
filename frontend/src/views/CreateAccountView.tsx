import React, { Component } from "react";
import { Formik, Field, Form, FormikHelpers } from "formik";
import { connect } from "react-redux";
import { createAccount } from "store/actions";
import { CreateAccountData, RootState } from "types";
import { TextField } from "formik-material-ui";
import {
  DialogContentText,
  FormHelperText,
  Button,
  withStyles,
  createStyles,
  WithStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import * as yup from "yup";
import { Redirect } from "react-router-dom";
import axios, { AxiosResponse, AxiosError } from "axios";
import { flatten } from "lodash";

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

const classes = createStyles({
  submitButton: {
    margin: "10px"
  }
});

const mapStateToProps = (state: RootState) => ({
  loggedIn: state.auth.loggedIn
});
type Props = ReturnType<typeof mapStateToProps> & WithStyles<typeof classes>;
interface State {
  requestFailedDialogOpen: boolean;
  requestSucceededDialogOpen: boolean;
  serverSideErrors: string[];
  redirect?: string;
}

class CreateAccoutView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      requestFailedDialogOpen: false,
      requestSucceededDialogOpen: false,
      serverSideErrors: []
    };
  }
  handleSuccessClose = () => {
    this.setState({ requestSucceededDialogOpen: false });
  };
  handleFailureClose = () => {
    this.setState({ requestFailedDialogOpen: false });
  };
  handleLoginRedirectClick = () => {
    this.setState({ redirect: "/login" });
  };
  render() {
    const { loggedIn, classes } = this.props;
    const {
      serverSideErrors,
      requestFailedDialogOpen,
      requestSucceededDialogOpen,
      redirect
    } = this.state;
    return loggedIn ? (
      <Redirect to="/" />
    ) : redirect ? (
      <Redirect to={redirect} />
    ) : (
      <>
        <DialogContentText variant="h5">Create New Account</DialogContentText>
        <Formik
          initialValues={{
            username: "",
            password1: "",
            password2: "",
            email: ""
          }}
          validationSchema={validationSchema}
          onSubmit={(values, bag) => {
            // createAccountCallback(values, bag);
            return axios
              .post("/auth/registration/", values)
              .then(response => {
                this.setState({ serverSideErrors: [], requestSucceededDialogOpen: true });
              })
              .catch((error: AxiosError<any>) => {
                if (error.response) {
                  console.log(error.response);
                  const errors: string[] = flatten(Object.values(error.response.data));
                  this.setState({ serverSideErrors: errors });
                } else {
                  this.setState({ serverSideErrors: [], requestFailedDialogOpen: true });
                }
              });
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
            {serverSideErrors.map((error, idx) => (
              <FormHelperText key={idx} error>
                {error}
              </FormHelperText>
            ))}
            <Button className={classes.submitButton} variant="outlined" type="submit">
              Submit
            </Button>
          </Form>
        </Formik>
        <Dialog open={requestSucceededDialogOpen}>
          <DialogContent>
            <DialogTitle>Confirmation Email Sent</DialogTitle>
            <DialogContentText>
              A confirmation email has been sent and should arrive within five minutes. It
              contains a link to confirm your email address.{" "}
            </DialogContentText>
            <DialogActions>
              <Button onClick={this.handleLoginRedirectClick} color="primary">
                Goto Login Page
              </Button>
              <Button onClick={this.handleSuccessClose} autoFocus color="primary">
                Continue
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
        <Dialog open={requestFailedDialogOpen}>
          <DialogContent>
            <DialogTitle>Request failed</DialogTitle>
            <DialogContentText>Check your network connection status...</DialogContentText>
            <DialogActions>
              <Button onClick={this.handleFailureClose} autoFocus color="primary">
                Continue
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </>
    );
  }
}
export default connect(mapStateToProps)(withStyles(classes)(CreateAccoutView));
