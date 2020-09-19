import React from "react";
import GAdminSidebar from "./GAdminSidebar";
import {withTracker} from "meteor/react-meteor-data";
import "./css/GAdmin.css";
import { NonIdealState } from "@blueprintjs/core";
class GAdmin extends React.Component {
  render() {
    return (
      <div className="GAdmin bp3-dark">
        <div className="GAdmin-container">
          {this.props.user && this.props.user.admin && <GAdminSidebar/>}
          {(this.props.user && !this.props.user.admin) ? <div className="GAdmin-not-allowed">
            <NonIdealState
              icon="error"
              title="403 Forbidden"
              description="You don't have permission to view this page."
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
})(GAdmin);

