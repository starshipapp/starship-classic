import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import "./css/ForumThread";
import { ForumPosts } from "../../../../api/collectionsStandalone";
import ForumThreadItem from "./ForumThreadItem";

class ForumItem extends React.Component {
  render() {    
    return (
      <div className="ForumThread">
        <h1>{this.props.post && this.props.post.name}</h1>
        <div className="ForumThread-container">
          {this.props.post && <ForumThreadItem post={this.props.post}/>}
        </div>
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