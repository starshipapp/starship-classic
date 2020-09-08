import React from "react";
import {Button, Divider, Icon, Tooltip} from "@blueprintjs/core";
import {withTracker} from "meteor/react-meteor-data";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import Profile from "../profile/Profile";

import "./css/InfoStrip.css";
import { checkWritePermission, checkAdminPermission } from "../../util/checkPermissions";

class InfoStrip extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showProfile: false
    };

    this.toggleFollow = this.toggleFollow.bind(this);
    this.goToAdmin = this.goToAdmin.bind(this);
    this.showProfile = this.showProfile.bind(this);
    this.closeProfile = this.closeProfile.bind(this);
  }

  toggleFollow() {
    Meteor.call("planets.togglefollow", this.props.planet._id);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState;
  }

  goToAdmin() {
    FlowRouter.go("Planets.admin", {_id: this.props.planet._id});
  }

  showProfile() {
    this.setState({
      showProfile: true
    });
  }

  closeProfile() {
    this.setState({
      showProfile: false
    });
  }

  render() {
    return (
      <div className="InfoStrip">
        <Profile isOpen={this.state.showProfile} userId={this.props.planet.owner} planet={this.props.planet} onClose={this.closeProfile}/>
        {this.props.planet.verified && <Tooltip content="Verified" className="InfoStrip-icon bp3-dark"><Icon icon="tick-circle"/></Tooltip>}
        {this.props.planet.partnered && <Tooltip content="Partnered" className="InfoStrip-icon bp3-dark"><Icon icon="unresolve"/></Tooltip>}
        {(this.props.planet.verified || this.props.planet.partnered) && <Divider/>}
        {this.props.user[0] && <div className="InfoStrip-username" onClick={this.showProfile}>Created by {this.props.user[0].username}</div>}
        <Divider/>
        {(this.props.planet.followerCount !== null && this.props.planet.followerCount !== undefined) && <div className="InfoStrip-followers">{this.props.planet.followerCount} {this.props.planet.followerCount === 1 ? "Follower" : "Followers"}</div>}
        {(this.props.planet.followerCount === null || this.props.planet.followerCount === undefined) && <div className="InfoStrip-followers">0 Followers</div>}
        {Meteor.userId() && <div className="InfoStrip">
          <Divider/>
          <Button text={(Meteor.user() && Meteor.user().following && Meteor.user().following.includes(this.props.planet._id) ) ? "Unfollow" : "Follow"} onClick={this.toggleFollow}/>  
        </div>}
        {checkWritePermission(Meteor.userId(), this.props.planet) && <div className="InfoStrip">
          <Divider/>
          <Button text="Admin" icon="wrench" intent="danger" onClick={this.goToAdmin}/>  
        </div>}
        {checkAdminPermission(Meteor.userId()) && <div className="InfoStrip">
          <Divider/>
          <Button text="Mod Tools" icon="wrench" onClick={this.props.goToTools}/>  
        </div>}
      </div>
    );
  }
}

export default withTracker((props) => {
  Meteor.subscribe("users.findId", props.planet.owner);
  Meteor.subscribe("user.currentUserData");

  return {
    user: Meteor.users.find({_id: props.planet.owner}).fetch(),
    currentUser: Meteor.user()
  };
})(InfoStrip);