import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import "./css/GAdmin-page.css";
import "./css/GAdminHome.css";
import { Classes, HTMLTable } from "@blueprintjs/core";
import { VictoryPie, VictoryTooltip } from "victory";
import Planets from "../../api/planets";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import Profile from "../profile/Profile";

class GAdminHome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      profile: ""
    };
  }

  goToPlanet(id) {
    FlowRouter.go("Planets.home", {_id: id});
  }

  setProfile(profile) {
    this.setState({
      profile
    });
  }

  render() {
    return (
      <div className="GAdmin-page bp3-dark">
        
        <Profile isOpen={this.state.profile !== ""} userId={this.state.profile} onClose={() => (this.setProfile(""))}/>
        <div className="GAdmin-page-header">
          <div className="GAdmin-page-header-text">Home</div>
        </div>
        <div className="GAdmin-page-container">
          {/*<div className="GAdminHome-stats">
            <div className="GAdminHome-stat">
              <h2>Users</h2>
              <div><b>Total: </b> 3</div>
              <div><b>New (today): </b> 1</div>
            </div>
            <div className="GAdminHome-stat">
              <h2>Planets</h2>
              <div><b>Total: </b> 3</div>
              <div><b>New (today): </b> 1</div>
            </div>
            <div className="GAdminHome-stat">
              <h2>Reports</h2>
              <div><b>Total: </b> 3</div>
              <div><b>New (today): </b> 1</div>
            </div>
          </div>*/}
          <div className="GAdminHome-big-stats">
            <div className="GAdminHome-stat">
              <h2>Newest Users</h2>
              <HTMLTable style={{width: "100%"}}>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.users.map((value) => (
                    <tr className="GAdminHome-clickable-table" key={value._id} onClick={() => (this.setProfile(value._id))}>
                      <td>{value.username && value.username}</td>
                      <td>{value.createdAt && value.createdAt.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td>
                    </tr>
                  ))}
                </tbody>
              </HTMLTable>
            </div>
            <div className="GAdminHome-stat">
              <h2>Newest Planets</h2>
              <HTMLTable style={{width: "100%"}}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.planets.map((value) => (
                    <tr className="GAdminHome-clickable-table" key={value._id} onClick={() => this.goToPlanet(value._id)}>
                      <td>{value.name && value.name}</td>
                      <td>{value.createdAt && value.createdAt.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td>
                    </tr>
                  ))}
                </tbody>
              </HTMLTable>
            </div>
            <div className="GAdminHome-stat">
              <h2>Reports by Type</h2>
              <VictoryPie
                labelComponent={<VictoryTooltip className={Classes.TOOLTIP}/>}
                data={[
                  { x: "Spam", y: 200, colorAtt: "#C22762" },
                  { x: "Illegal Content", y: 40, colorAtt: "#8F398F" },
                  { x: "Copyright Infringment", y: 55, colorAtt: "#DB3737" },
                  { x: "Harrasment", y: 400, colorAtt: "#D9822B" },
                  { x: "Inappropriate Content", y: 57, colorAtt: "#0F9960" },
                  { x: "Malware", y: 30, colorAtt: "#137CBD" },
                ]}
                style={{
                  data: {
                    fill: (d) => d.datum.colorAtt
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe("user.currentUserData");
  Meteor.subscribe("planets.adminrecent");
  Meteor.subscribe("users.adminrecent");

  return {
    user: Meteor.user(),
    users: Meteor.users.find({}, {limit: 15, sort: {createdAt: -1}}),
    planets: Planets.find({}, {limit: 15, sort: {createdAt: -1}})
  };
})(GAdminHome);

