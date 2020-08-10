import React, { Component } from "react";
import { Formik, Field, Form, FormikHelpers } from "formik";
import { addTodo } from "store/actions";
import { connect } from "react-redux";
import { Button, Typography } from "@material-ui/core";
import { TextField } from "formik-material-ui";
import * as yup from "yup";

function staggerForm(bag: FormikHelpers<any>) {
  bag.setSubmitting(true);
  setTimeout(() => {
    bag.resetForm();
  }, 1000);
}

let dispatchProps = {
  addTodo: addTodo.request
};

type Props = typeof dispatchProps;

class TodoForm extends Component<Props, {}> {
  render() {
    const { addTodo } = this.props;
    return (
      <>
        <Typography variant="h6">Submit new Todo</Typography>
        <Formik
          initialValues={{ text: "" }}
          validationSchema={yup.object().shape({
            text: yup
              .string()
              .required()
              .label("Text")
          })}
          onSubmit={(values, bag) => {
            addTodo(values);
            staggerForm(bag);
          }}
        >
          <Form>
            <Field component={TextField} label="Todo" name="text" type="text" />
            <div>
              <Button type="submit">Submit</Button>
            </div>
          </Form>
        </Formik>
      </>
    );
  }
}
export default connect(null, dispatchProps)(TodoForm);
