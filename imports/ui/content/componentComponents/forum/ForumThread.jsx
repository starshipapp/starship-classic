import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import {Icon, Divider} from "@blueprintjs/core";
import "./css/ForumThread";
import { ForumPosts } from "../../../../api/collectionsStandalone";

class ForumItem extends React.Component {
  render() {    
    return (
      <div className="ForumThread">
        <h1>{this.props.post && this.props.post.name}</h1>
      </div>
    );
  }
}

export default withTracker((props) => {
  Meteor.subscribe("forumposts.post", props.postId);

  return {
    post: ForumPosts.findOne(props.postId),
    currentUser: Meteor.user()
  };
})(ForumItem);