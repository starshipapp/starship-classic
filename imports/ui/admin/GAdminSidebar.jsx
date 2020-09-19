import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import "./css/GAdminSidebar.css";
import { Menu, MenuItem } from "@blueprintjs/core";
class GAdminSidebar extends React.Component {
  render() {
    return (
      <div className="GAdminSidebar bp3-dark">
        <Menu className="GAdminSidebar-menu">
          <div className="GAdminSidebar-menu-logo">starship<span className="GAdminSidebar-version">admin</span></div>
          <MenuItem icon="home" text="Home"/>
          <MenuItem icon="warning-sign" text="Reports"/>
          <MenuItem icon="control" text="Planets"/>
          <MenuItem icon="user" text="Users"/>
        </Menu>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe("user.currentUserData");

  return {
    user: Meteor.user()
  };
})(GAdminSidebar);