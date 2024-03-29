import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import {Button} from "@blueprintjs/core";
import { ForumPosts } from "../../../../api/collectionsStandalone";
import ForumItem from "./ForumItem";

class ForumItemContainer extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState;
  }

  render() {
    return (
      <tbody className="ForumComponent-item-container">
        {this.props.stickiedPosts.map((value) => (<ForumItem key={value._id} post={value} planet={this.props.planet} stickied={true} id={this.props.id}/>))}
        {this.props.forumPosts.map((value) => (<ForumItem key={value._id} post={value} planet={this.props.planet} id={this.props.id}/>))}
        <tr>
          {this.props.threadCount > this.props.postCount && <td className="ForumComponent-loadmore">
            <Button text="Load More" onClick={this.props.loadMore}/>
          </td>}
        </tr>
      </tbody>
    );
  }
}

export default withTracker((props) => {
  Meteor.subscribe("forumposts.posts", props.id);

  let forumPostsSelector = {componentId: props.id, stickied: false};

  if(props.tag !== null) {
    forumPostsSelector["tags"] = props.tag;
  }

  return {
    stickiedPosts: ForumPosts.find({componentId: props.id, stickied: true}, {sort: { updatedAt: -1 }}).fetch(),
    forumPosts: ForumPosts.find(forumPostsSelector, {sort: props.sort, limit: props.postCount}).fetch(),
    threadCount: ForumPosts.find({componentId: props.id}).count(),
    currentUser: Meteor.user()
  };
})(ForumItemContainer);