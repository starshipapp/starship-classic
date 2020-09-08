import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import "./css/Settings.css";
import { Label, Button } from "@blueprintjs/core";

class Settings extends React.Component {
  render() {
    console.log(Meteor.user());
    return (
      <div className="Settings bp3-dark">
        <div className="Settings-header">
          <div className="Settings-header-text">
            Settings
          </div>
        </div>
        <div className="Settings-container">
          <h1>Profile</h1>
          <div className="Settings-profilepic"></div>
          <Button text="Save"/>
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
})(Settings);

