import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import { Button } from "@blueprintjs/core";

class MemberTableItem extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState;
  }

  render() {
    return (
      <tr>
        <td className="AdminComponents-table-name">{this.props.user[0] && this.props.user[0].username}</td>
        <td className="AdminComponents-table-action"><Button intent="danger" small={true} icon="trash" onClick={() => {this.props.kickMember(this.props.userId);}}/></td>
      </tr>
    );
  }
}

export default withTracker((props) => {
  Meteor.subscribe("users.findId", props.userId);

  return {
    user: Meteor.users.find({_id: props.userId}).fetch(),
    currentUser: Meteor.user()
  };
})(MemberTableItem);