import React, { Component } from "react";
import { Redirect } from "react-router";
import {connect} from 'react-redux';
import {logout} from '../store/actions';

const dispatchProps = {
  logout: logout.request
}

type Props = typeof dispatchProps

const LogoutView = (props: Props) => {
  props.logout()
  return (
    <>
      <Redirect to="/" />
    </>
  );
};
export default connect (null, dispatchProps)(LogoutView);
