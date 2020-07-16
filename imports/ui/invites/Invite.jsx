import React from "react";
import {Button} from "@blueprintjs/core";
import "./css/Invite.css";
import {withTracker} from "meteor/react-meteor-data";
import Invites from "../../api/invites";
import InviteName from "./InviteName";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";

class Invite extends React.Component {
  join() {
    Meteor.call("invites.use", this.props.inviteId)
    FlowRouter.go("Planets.home", {_id: this.props.planet});
  }

  render() {
    return (
      <div className="Invite">
        <div className="Invite-container">
          <div className="Invite-title">
            You've been invited to become a member of
          </div>
          <div className="Invite-name">
            {this.props.invite[0] && <InviteName inviteId={this.props.inviteId} planetId={this.props.invite[0].planet}/>}
          </div>
          <Button className="Invite-button" text="Join" onClick={() => this.join()}/>
        </div>
        <div className="Invite-debug">
          inviteId: {this.props.inviteId}<br/>
          {this.props.invite[0] && <span>planetId: {this.props.invite[0].planet}<br/></span>}
          (there will be more things on this page eventually, trust me, i'm debug information)
        </div>
      </div>
    );
  }
}

export default withTracker((props) => {
  Meteor.subscribe("invites.invite", props.inviteId);
  return {
    invite: Invites.find({_id: props.inviteId}).fetch(),
    currentUser: Meteor.user()
  };
})(Invite);