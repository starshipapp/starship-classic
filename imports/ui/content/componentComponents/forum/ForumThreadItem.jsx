import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import "./css/ForumThreadItem";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Icon, Button, ButtonGroup, Intent, Alert } from "@blueprintjs/core";
import ReactMarkdown from "react-markdown";

class ForumThreadItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      textValue: this.props.post.content,
      editor: false,
      alert: false
    };

    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
    this.updateEditorValue = this.updateEditorValue.bind(this);
    this.toggleEditor = this.toggleEditor.bind(this);
    this.toggleAlert = this.toggleAlert.bind(this);
  }

  edit() {
    if(this.props.post.postId) {
      Meteor.call("forumreplies.update", this.props.post._id, this.state.textValue);
    } else {
      Meteor.call("forumposts.update", this.props.post._id, this.state.textValue);
    }
    this.setState({
      editor: false
    });
  }

  delete() {
    if(this.props.post.postId) {
      Meteor.call("forumreplies.delete", this.props.post._id);
    } else {
      Meteor.call("forumposts.delete", this.props.post._id);
    }
    this.setState({
      alert: false
    });
  }

  updateEditorValue(value) {
    this.setState({
      textValue: value
    });
  }

  toggleEditor() {
    this.setState({
      editor: !this.state.editor
    });
  }

  toggleAlert() {
    this.setState({
      alert: !this.state.alert
    });
  }

  render() {
    let creationDate = this.props.post.createdAt ? this.props.post.createdAt : new Date("2020-07-25T15:24:30+00:00");
    let creationDateText = creationDate.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    return (
      <div className="ForumThreadItem">
        <Alert
          isOpen={this.state.alert}
          className="bp3-dark"
          icon="trash"
          intent={Intent.DANGER}
          confirmButtonText="Delete"
          cancelButtonText="Cancel"
          canOutsideClickCancel={true}
          canEscapeKeyCancel={true}
          onCancel={this.toggleAlert}
          onConfirm={this.delete}
        >Are you sure you want to delete this post? It will be gone forever (a very long time)!</Alert>
        <div className="ForumThreadItem-info">
          <div className="ForumThreadItem-profilepic"/>
          <div className="ForumThreadItem-username">{this.props.user[0] && this.props.user[0].username}</div>
        </div>
        <div className="ForumThreadItem-content">
          <div className="ForumThreadItem-postinfo">
            <Icon icon="time" className="ForumThreadItem-postinfo-dateicon"/>
            <span className="ForumThreadItem-postinfo-date">{creationDateText}</span>
          </div>
          <div className="ForumThreadItem-text">
            {this.state.editor ? <div className="ForumThreadItem-editor">
              <SimpleMDE onChange={this.updateEditorValue} value={this.state.textValue}/>
              <Button
                icon="saved"
                onClick={this.edit}
                className="PageComponent-edit PageComponent-save-button"
              >
                Save
              </Button>
            </div> : <ReactMarkdown>{this.props.post.content}</ReactMarkdown>}
          </div>
          <div className="ForumThreadItem-bottom">
            <ButtonGroup>
              <Button small={true} icon="comment" text="Quote" onClick={() => this.props.addQuote(this.props.post)} minimal={true} alignText="left"/>
              <Button small={true} icon="edit" text="Edit" onClick={this.toggleEditor} minimal={true} alignText="left"/>
              <Button small={true} icon="trash" text="Delete" minimal={true} onClick={this.toggleAlert} alignText="left" intent={Intent.DANGER}/>
            </ButtonGroup>
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