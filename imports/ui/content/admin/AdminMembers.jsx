import React from "react";
import {NonIdealState, Button, Icon} from "@blueprintjs/core";
import {withTracker} from "meteor/react-meteor-data";
import "./css/AdminMembers.css";
import Invites from "../../../api/invites";
import {checkWritePermission} from "../../../util/checkPermissions";

class AdminMembers extends React.Component {
  constructor(props) {
    super(props);

    this.createInvite = this.createInvite.bind(this);
  }

  createInvite() {
    Meteor.call("invites.insert", this.props.planet._id);
  }

  render() {
    const baseurl = window.location.protocol + "//" + window.location.host + "/invite/";
    return (
      <div className="Admin bp3-dark">
        {checkWritePermission(Meteor.userId(), this.props.planet) ? <div>
          <h2>Members</h2>
          <div className="AdminMembers-container">
            {this.props.invites && this.props.invites.length > 0 && <div>
              <h3>Invites <Icon className="AdminMembers-add-icon" icon="plus" onClick={this.createInvite}/></h3>
              <table className="AdminComponents-table">
                <tbody>
                  {this.props.invites.map((value) => (
                    <tr key={value._id}>
                      <td className="AdminComponents-table-name"><a href={baseurl + value._id}>{baseurl + value._id}</a></td>
                      <td className="AdminComponents-table-action"><Button intent="danger" small={true} icon="trash" onClick={() => {this.deleteComponent(value._id);}}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>}
            {this.props.planet.members && this.props.planet.members.length > 0 ? <div>

            </div> : <NonIdealState
              icon="people"
              title="No members!"
              description="Members can edit and add content to the planet. Members can also always access the planet, even when it's in private mode."
              action={<Button text="Create Invite" onClick={this.createInvite}/>}
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

export default withTracker((props) => {
  Meteor.subscribe("invites.fromplanet", props.planet._id);

  return {
    invites: Invites.find({planet: props.planet._id}).fetch(),
    currentUser: Meteor.user()
  };
})(AdminMembers);