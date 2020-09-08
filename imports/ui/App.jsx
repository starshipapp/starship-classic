import React from "react";
import MainSidebar from "./sidebars/MainSidebar";
import {withTracker} from "meteor/react-meteor-data";
import "./css/App.css";
import { NonIdealState } from "@blueprintjs/core";
class App extends React.Component {
  render() {
    console.log(Meteor.user());
    return (
      <div className="App bp3-dark">
        <div className="App-container">
          <MainSidebar/>
          {(this.props.user && this.props.user.banned) ? <div className="App-banned">
            <NonIdealState
              icon="error"
              title="You've been banned!"
              description="You have been banned for violating our rules. You will not be able to access any starship planets."
            />
          </div>: this.props.component}
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe("user.currentUserData");

  return {
    user: Meteor.user()
  };
})(App);

