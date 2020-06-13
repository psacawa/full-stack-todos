import React, { Component } from "react";
import { Formik, Field, Form } from "formik";
import { addTodo } from "../store/actions";
import { connect } from "react-redux";
import { TodoData } from "@src/types";

let dispatchProps = {
  addTodo: addTodo.request
};

type FormikValues = TodoData;

type Props = typeof dispatchProps;

class TodoForm extends Component<Props, {}> {
  render() {
    const { addTodo } = this.props;
    return (
      <>
        <h4>Submit new Todo</h4>
        <Formik
          initialValues={{ text: "", author: "" }}
          onSubmit={(values) => {
            addTodo(values);
          }}
        >
          <Form >
          <label htmlFor="text">Text: </label> 
          <Field name="text" type="text" /> <br />
            <label htmlFor="author">Author: </label>
            <Field
              name="author"
              type="text"
            />
            <br />
            <input type="submit" value="Submit"></input>
          </Form>
        </Formik>
      </>
    );
  }
}
export default connect(null, dispatchProps)(TodoForm);
