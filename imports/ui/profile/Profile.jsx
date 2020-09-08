import React from "react";
import {Dialog, Classes, Divider, Tag, Intent, AnchorButton} from "@blueprintjs/core";
import {withTracker} from "meteor/react-meteor-data";
import "./css/Profile.css";
import { checkAdminPermission, checkWritePermission } from "../../util/checkPermissions";

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.globalBan = this.globalBan.bind(this);
    this.ban = this.ban.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState;
  }

  globalBan() {
    Meteor.call("users.toggleban", this.props.userId);
  }

  ban() {
    Meteor.call("planets.toggleban", this.props.planet._id, this.props.userId);
  }

  render() {
    let creationDateText = (this.props.user[0] && this.props.user[0].createdAt) ? this.props.user[0].createdAt.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "loading";
    return (
      <Dialog className="bp3-dark" title={this.props.user[0] && this.props.user[0].username} onClose={this.props.onClose} isOpen={this.props.isOpen}>
        <div className={Classes.DIALOG_BODY}>
          {this.props.user[0] && <div className="Profile-container">
            <div className="Profile-icon">
              {this.props.user[0].profilePicture ? <div className="Profile-pfp"><img src={this.props.user[0].profilePicture + "?t=" + Number(Date.now())}/></div> : <div className="Profile-pfp"/>}
            </div>
            <div className="Profile-info">
              <div className="Profile-name">{this.props.user[0].username}</div>
              <div className="Profile-date">User since {creationDateText}</div>
              <Divider/>
              <div className="Profile-tags">
                {this.props.user[0].admin && <Tag intent={Intent.DANGER}>Global Admin</Tag>}
                {this.props.user[0].banned && <Tag intent={Intent.DANGER}>Globally Banned</Tag>}
              </div>
            </div>
          </div>}
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            {this.props.user[0] && checkAdminPermission(Meteor.userId()) && !checkAdminPermission(this.props.userId) && <AnchorButton text={this.props.user[0].banned ? "Global Unban" : "Global Ban"} intent={Intent.DANGER} onClick={this.globalBan}/>}
            {this.props.planet && checkWritePermission(Meteor.userId(), this.props.planet) && !checkWritePermission(this.props.userId, this.props.planet) && <AnchorButton text={(this.props.planet.banned && this.props.planet.banned.includes(this.props.userId)) ? "Unban" : "Ban"} intent={Intent.DANGER} onClick={this.ban}/>}
            <AnchorButton text="Close" onClick={this.props.onClose}/>
          </div>
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