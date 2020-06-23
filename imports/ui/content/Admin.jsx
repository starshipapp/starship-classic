import React from 'react';
import { NonIdealState, Menu } from "@blueprintjs/core";
import {withTracker} from 'meteor/react-meteor-data';
import './css/Admin.css'
import AdminComponents from './admin/AdminComponents';

class Admin extends React.Component {
  render() {
    return (
      <div className="Admin bp3-dark">
        {Meteor.userId() === this.props.planet.owner ? <div>
          <h1>Admin</h1>
          <div className="Admin-container">
            <div className="Admin-sidebar">
              <Menu>
                <Menu.Item icon="wrench" text="General"/>
                <Menu.Item icon="document" text="Components"/>
              </Menu>
            </div>
            <div className="Admin-main">
              <AdminComponents planet={this.props.planet}/>
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

export default withTracker((props) => {
  return {
    currentUser: Meteor.user()
  };
})(Admin);