import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import Login from "./pages/Login";
import Maincontrol from "./pages/Maincontrol";

class App extends Component {
  componentDidMount() {}
  render() {
    return (
      <>
        <Route path="/login" component={Login}></Route>
        <Route path="/index" component={Maincontrol}></Route>
        <Redirect
          to={this.props.logindata.loginStates ? "/index" : "/login"}
        ></Redirect>
      </>
    );
  }
}
export default connect(
  (state, props) => ({
    logindata: state.logindata,
  }),
  {}
)(App);
