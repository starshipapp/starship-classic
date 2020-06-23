import React from 'react';
import {Button, Divider} from "@blueprintjs/core";
import {withTracker} from 'meteor/react-meteor-data';
import {FlowRouter} from 'meteor/ostrio:flow-router-extra';

import "./css/InfoStrip.css"

class InfoStrip extends React.Component {
  constructor(props) {
    super(props)

    this.toggleFollow = this.toggleFollow.bind(this)
    this.goToAdmin = this.goToAdmin.bind(this)
  }

  toggleFollow() {
    Meteor.call("planets.togglefollow", this.props.planet._id)
  }

  goToAdmin() {
    FlowRouter.go('Planets.admin', {_id: this.props.planet._id})
  }

  render() {
    console.log(this.props.user)
    return (
      <div className="InfoStrip">
        {this.props.user[0] && <div className="InfoStrip-username">Created by {this.props.user[0].username}</div>}
        <Divider/>
        <div className="InfoStrip-followers">{this.props.planet.followers.length} {this.props.planet.followers.length === 1 ? "Follower" : "Followers"}</div>
        {Meteor.userId() && <div className="InfoStrip">
          <Divider/>
          <Button text={this.props.planet.followers.includes(Meteor.userId()) ? "Unfollow" : "Follow"} onClick={this.toggleFollow}/>  
        </div>}
        {Meteor.userId() === this.props.planet.owner && <div className="InfoStrip">
          <Divider/>
          <Button text="Admin" icon="wrench" intent="danger" onClick={this.goToAdmin}/>  
        </div>}
      </div>
    )
  }
}

export default withTracker((props) => {
  Meteor.subscribe("users.findId", props.planet.owner);

  return {
    user: Meteor.users.find({_id: props.planet.owner}).fetch(),
    currentUser: Meteor.user()
  };
})(InfoStrip);