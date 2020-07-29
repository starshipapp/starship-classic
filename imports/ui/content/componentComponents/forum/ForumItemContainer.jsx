import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import { ForumPosts } from "../../../../api/collectionsStandalone";
import ForumItem from "./ForumItem";

class ForumItemContainer extends React.Component {
  render() {
    return (
      <tbody className="ForumComponent-item-container">
        {this.props.forumPosts.map((value) => (<ForumItem key={value._id} post={value} planet={this.props.planet} id={this.props.id}/>))}
      </tbody>
    );
  }
}

export default withTracker((props) => {
  Meteor.subscribe("forumposts.posts", props.id);

  return {
    forumPosts: ForumPosts.find({componentId: props.id}, {sort: { updatedAt: -1 }, limit: props.postCount}).fetch(),
    currentUser: Meteor.user()
  };
})(ForumItemContainer);