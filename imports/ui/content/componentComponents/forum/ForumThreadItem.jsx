import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import "./css/ForumThreadItem";
import { Icon } from "@blueprintjs/core";
import ReactMarkdown from "react-markdown";

class ForumThreadItem extends React.Component {
  render() {
    let creationDate = this.props.post.createdAt ? this.props.post.createdAt : new Date("2020-07-25T15:24:30+00:00");
    let creationDateText = creationDate.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    return (
      <div className="ForumThreadItem">
        <div className="ForumThreadItem-info">
          <div className="ForumThreadItem-profilepic"/>
          <div className="ForumThreadItem-username">{this.props.user[0] && this.props.user[0].username}</div>
        </div>
        <div className="ForumThreadItem-content">
          <div className="ForumThreadItem-postinfo">
            <Icon icon="time"/>
            <span> {creationDateText}</span>
          </div>
          <div className="ForumThreadItem-text">
            <ReactMarkdown>{this.props.post.content}</ReactMarkdown>
          </div>
          <div className="ForumThreadItem-bottom">
            <div className="ForumThreadItem-bottom-item">
              <Icon icon="comment"/>
              <span> Quote</span>
            </div>
            <div className="ForumThreadItem-bottom-item">
              <Icon icon="new-object"/>
              <span> Add Reaction</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTracker((props) => {
  Meteor.subscribe("users.findId", props.post.owner);

  return {
    user: Meteor.users.find({_id: props.post.owner}).fetch(),
    currentUser: Meteor.user()
  };
})(ForumThreadItem);