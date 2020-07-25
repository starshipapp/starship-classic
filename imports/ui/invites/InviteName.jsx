import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import Planets from "../../api/planets";

class InviteText extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState;
  }

  render() {
    return (<span>{this.props.planet[0] && this.props.planet[0].name}</span>);
  }
}

export default withTracker((props) => {
  Meteor.subscribe("invites.planet", props.inviteId);
  return {
    planet: Planets.find({_id: props.planetId}).fetch(),
  };
})(InviteText);