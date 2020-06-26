import React, { Component } from "react";
import { Formik, Field, Form } from "formik";
import { addTodo } from "../store/actions";
import { connect } from "react-redux";

let dispatchProps = {
  addTodo: addTodo.request
};

type Props = typeof dispatchProps;

class TodoForm extends Component<Props, {}> {
  render() {
    const { addTodo } = this.props;
    return (
      <>
        <h4>Submit new Todo</h4>
        <Formik
          initialValues={{ text: "", author: "", other: "" }}
          onSubmit={values => {
            addTodo(values);
          }}
        >
          <Form>
            <p>
              <label htmlFor="text">Text: </label>
              <Field name="text" type="text" />{" "}
            </p>
            <input type="submit" value="Submit"></input>
          </Form>
        </Formik>
      </>
    );
  }
}
export default connect(null, dispatchProps)(TodoForm);
