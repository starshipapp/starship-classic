import React from 'react';
import { NonIdealState, Menu } from "@blueprintjs/core";
import {withTracker} from 'meteor/react-meteor-data';
import './css/Admin.css'
import AdminComponents from './admin/AdminComponents';
import AdminGeneral from './admin/AdminGeneral';
import {checkWritePermission} from "../../util/checkPermissions";
import AdminMembers from "./admin/AdminMembers";

class Admin extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      tab: "general"
    }
  }

  goToTab(tab) {
    this.setState({
      tab
    })
  }

  render() {
    return (
      <div className="Admin bp3-dark">
        {checkWritePermission(Meteor.userId(), this.props.planet) ? <div>
          <h1>Admin</h1>
          <div className="Admin-container">
            <div className="Admin-sidebar">
              <Menu>
                <Menu.Item icon="wrench" text="General" onClick={() => this.goToTab("general")}/>
                <Menu.Item icon="document" text="Components" onClick={() => this.goToTab("components")}/>
                <Menu.Item icon="people" text="Members" onClick={() => this.goToTab("members")}/>
              </Menu>
            </div>
            <div className="Admin-main">
              {this.state.tab === "general" && <AdminGeneral planet={this.props.planet}/>}
              {this.state.tab === "components" && <AdminComponents planet={this.props.planet}/>}
              {this.state.tab === "members" && <AdminMembers planet={this.props.planet}/>}
            </div>
          </div>
        </div> : <div>
        <NonIdealState
          icon="error"
          title="403"
          description="You aren't the admin of this planet."
        />
        </div>}
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    currentUser: Meteor.user()
  };
})(Admin);