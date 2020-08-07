import React from "react";
import {ErrorToaster} from "../../../Toaster";
import {withTracker} from "meteor/react-meteor-data";
import "./css/ForumThread";
import { ForumPosts, ForumReplies } from "../../../../api/collectionsStandalone";
import ForumThreadItem from "./ForumThreadItem";
import { Button, Classes, Intent } from "@blueprintjs/core";
import SimpleMDE from "react-simplemde-editor";

class ForumItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editingContent: ""
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.postThread = this.postThread.bind(this);
  }


  handleChange(value) {
    this.setState({
      editingContent: value
    });
  }

  postThread() {
    if(this.state.editingContent === "") {
      ErrorToaster.show({message: "Cannot create a thread with no content.", icon:"error", intent:Intent.DANGER});
    }
    Meteor.call("forumreplies.insert", this.props.postId, this.state.editingContent);
    this.setState({
      editingContent: ""
    });
  }


  render() {
    return (
      <div className="ForumThread">
        <div className="ForumThread-name">{this.props.post && this.props.post.name}</div>
        <div className="ForumThread-container">
          {this.props.post && <ForumThreadItem post={this.props.post}/>}
          {this.props.replies.map((value) => (<ForumThreadItem key={value._id} post={value}/>))}
        </div>
        <div className="ForumThread-reply-editor">
          <div className="ForumThread-reply">Reply</div>
          <SimpleMDE onChange={this.handleChange} value={this.state.editingContent}/>
          <Button text="Post" className="ForumEditor-button" onClick={this.postThread}/>
        </div>
      </div>
    );
  }
}

export default withTracker((props) => {
  Meteor.subscribe("forumposts.post", props.postId);
  Meteor.subscribe("forumreplies.replies", props.postId);

  return {
    post: ForumPosts.findOne(props.postId),
    replies: ForumReplies.find({}, {sort: { createdAt: 1 }, limit: 20}).fetch(),
    currentUser: Meteor.user()
  };
})(ForumItem);