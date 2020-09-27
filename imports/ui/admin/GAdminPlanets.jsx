import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import "./css/GAdmin-page.css";
import "./css/GAdminHome.css";
import { Classes, HTMLTable } from "@blueprintjs/core";
import { VictoryPie, VictoryTooltip } from "victory";
import Planets from "../../api/planets";

class GAdminPlanets extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="GAdmin-page bp3-dark">
        <div className="GAdmin-page-header">
          <div className="GAdmin-page-header-text">Planets</div>
        </div>
        <div className="GAdmin-page-container">
          
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe("user.currentUserData");
  Meteor.subscribe("planets.admin");
  Meteor.subscribe("users.admin");

  return {
    user: Meteor.user(),
    users: Meteor.users.find({}, {limit: 15, sort: {createdAt: 1}}),
    planets: Planets.find({}, {limit: 15, sort: {createdAt: 1}})
  };
})(GAdminPlanets);

