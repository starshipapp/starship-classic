import React from "react";
import {Dialog, Classes, Divider, Tag, Intent} from "@blueprintjs/core";
import {withTracker} from "meteor/react-meteor-data";
import "./css/Profile.css";

class Profile extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState;
  }

  render() {
    let creationDateText = (this.props.user[0] && this.props.user[0].createdAt) ? this.props.user[0].createdAt.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "loading";
    return (
      <Dialog className="bp3-dark" title={this.props.user[0] && this.props.user[0].username} onClose={this.props.onClose} isOpen={this.props.isOpen}>
        <div className={Classes.DIALOG_BODY}>
          {this.props.user[0] && <div className="Profile-container">
            <div className="Profile-icon">
              {this.props.user[0].profilePicture ? <div></div> : <div className="Profile-no-pfp"/>}
            </div>
            <div className="Profile-info">
              <div className="Profile-name">{this.props.user[0].username}</div>
              <div className="Profile-date">User since {creationDateText}</div>
              <Divider/>
              <div className="Profile-tags">
                {this.props.user[0].admin && <Tag intent={Intent.DANGER}>Global Admin</Tag>}
              </div>
            </div>
          </div>}
        </div>
      </Dialog>
    );
  }
}

export default withTracker((props) => {
  Meteor.subscribe("users.findId", props.userId);
  Meteor.subscribe("user.currentUserData");

  return {
    user: Meteor.users.find({_id: props.userId}).fetch(),
    currentUser: Meteor.user()
  };
})(Profile);