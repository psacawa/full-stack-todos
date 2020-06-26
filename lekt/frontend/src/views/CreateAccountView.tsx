import React, {useCallback}from "react";
import { Formik, Field, Form } from "formik";
import {useDispatch} from 'react-redux';
import {createAccount} from '../store/actions';
import {CreateAccountData} from '../types';

export default () => {
  const dispatch = useDispatch()
  const createAccountCallback = useCallback(
    (values: CreateAccountData) => dispatch(createAccount.request(values)), [dispatch])
  return (
    <>
      <h3>Create New Account</h3>
      <Formik
        initialValues={{
          username: "",
          password1: "",
          password2: "",
          email: ""
        }}
        validate={(values: CreateAccountData) => {
        }}
        onSubmit={values => {createAccountCallback(values)}}
      >
        <Form>
          <div>
            <label htmlFor="username">Username: </label>
            <Field type="text" name="username" />
          </div>
          <div>
            <label htmlFor="password1">Password: </label>
            <Field type="password" name="password1" />
          </div>
          <div>
            <label htmlFor="password2">Confirm Password: </label>
            <Field type="password" name="password2" />
          </div>
          <div>
            <label htmlFor="email">Email: </label>
            <Field type="email" name="email" />
          </div>
          <input type="submit" value="Create Account" name="" id="" />
        </Form>
      </Formik>
    </>
  );
};
