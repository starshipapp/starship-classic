import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import "./css/ForumThread";
import {ForumReplies} from "../../../../api/collectionsStandalone";
import ForumThreadItem from "./ForumThreadItem";

class ForumThreadItemContainer extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState;
  }

  render() {
    return (
      <div className="ForumThread-itemcontainer">
        {this.props.replies.map((value) => (<ForumThreadItem key={value._id} planet={this.props.planet} post={value} addQuote={this.props.addQuote}/>))}
      </div>
    );
  }
}

export default withTracker((props) => {
  Meteor.subscribe("forumreplies.page", props.postId, props.page);
  //, {sort: { createdAt: 1 }, skip: (props.page - 1) * 25 , limit: 25}
  return {
    replies: ForumReplies.find({postId: props.postId}).fetch(),
    currentUser: Meteor.user()
  };
})(ForumThreadItemContainer);