import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import { Icon, Divider, Tag } from "@blueprintjs/core";
import "./css/ForumItem";

class ForumItem extends React.Component {
  constructor(props) {
    super(props);

    this.gotoSubComponent = this.gotoSubComponent.bind(this);
  }

  gotoSubComponent() {
    FlowRouter.go("Planets.component.subid", {_id: this.props.planet._id, _cid: this.props.id, _sid: this.props.post._id});
  }

  render() {
    let updateDate = this.props.post.updatedAt ? this.props.post.updatedAt : new Date("2020-07-25T15:24:30+00:00");
    let updateDateText = updateDate.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    let creationDate = this.props.post.createdAt ? this.props.post.createdAt : new Date("2020-07-25T15:24:30+00:00");
    let creationDateText = creationDate.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    
    return (
      <tr className="ForumItem" onClick={this.gotoSubComponent}>
        <td>
          <div className="ForumItem-name">
            <span className={this.props.stickied ? "ForumItem-name-text ForumItem-stickied" : "ForumItem-name-text"}>{this.props.stickied && <Icon icon="pin" color="#3dcc91" className="ForumItem-stickied-pin"/>} {this.props.post.name}</span>
            <div className="ForumItem-name-flex">
              <div className="ForumItem-tags"><Tag className="ForumItem-tag">Test</Tag></div>
            </div>
            <div className="ForumItem-rightside">
              <div className="ForumItem-right-container">
                <Icon icon="comment"/>
                <span className="ForumItem-replies">{this.props.post.replyCount}</span>
                <Divider/>
                <span className="ForumItem-updated">{updateDateText}</span>
              </div>
            </div>
          </div>
          <div className="ForumItem-info">
            <div>Posted by {this.props.user[0] && this.props.user[0].username} on {creationDateText}</div>
          </div>
        </td>
      </tr>
    );
  }
}

export default withTracker((props) => {
  Meteor.subscribe("users.findId", props.post.owner);

  return {
    user: Meteor.users.find({_id: props.post.owner}).fetch(),
    currentUser: Meteor.user()
  };
})(ForumItem);