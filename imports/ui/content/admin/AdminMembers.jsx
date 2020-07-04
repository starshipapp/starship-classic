import React from 'react';
import { NonIdealState } from "@blueprintjs/core";
import {withTracker} from 'meteor/react-meteor-data';
import './css/AdminMembers.css'
import {checkWritePermission} from "../../../util/checkPermissions";

class AdminMembers extends React.Component {
  constructor(props) {
    super(props);

    this.deleteComponent = this.deleteComponent.bind(this);
  }

  deleteComponent(component) {
    Meteor.call('planets.removecomponent', this.props.planet._id, component)
  }

  render() {
    return (
      <div className="Admin bp3-dark">
        {checkWritePermission(Meteor.userId(), this.props.planet) ? <div>
          <h2>Members</h2>
          <div className="AdminMembers-container">
            {this.props.planet.members && this.props.planet.members.length > 0 ? <table className="AdminComponents-table">
              <tbody>
              </tbody>
            </table> : <NonIdealState
              icon="people"
              title="No members!"
              description="There are no members in this planet!"
            />}
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
})(AdminMembers);