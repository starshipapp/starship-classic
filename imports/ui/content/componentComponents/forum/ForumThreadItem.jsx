import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import "./css/ForumThreadItem";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Icon, Button, ButtonGroup, Intent, Alert, Popover } from "@blueprintjs/core";
import ReactMarkdown from "react-markdown";
import { checkWritePermission } from "../../../../util/checkPermissions";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import Twemoji from "react-twemoji";
import { PickerEmojis, DefaultCustom } from "../../../assets/emojis/customemojis.jsx";
import Profile from "../../../profile/Profile";

class ForumThreadItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      textValue: this.props.post.content,
      editor: false,
      alert: false,
      showEmojiPrompt: false,
      showProfile: false
    };

    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
    this.updateEditorValue = this.updateEditorValue.bind(this);
    this.toggleEditor = this.toggleEditor.bind(this);
    this.toggleAlert = this.toggleAlert.bind(this);
    this.sticky = this.sticky.bind(this);
    this.lock = this.lock.bind(this);
    this.selectEmoji = this.selectEmoji.bind(this);
    this.toggleEmojiPrompt = this.toggleEmojiPrompt.bind(this);
    this.closePrompt = this.closePrompt.bind(this);
    this.showProfile = this.showProfile.bind(this);
    this.closeProfile = this.closeProfile.bind(this);
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
    if(!this.props.isParent) {
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

  sticky() {
    Meteor.call("forumposts.sticky", this.props.post._id);
  }

  lock() {
    Meteor.call("forumposts.lock", this.props.post._id);
  }

  selectEmoji(emoji, isPrompt) {
    console.log(emoji);
    let stringToSend = emoji.native ? emoji.native : emoji.id;
    if(!this.props.isParent) {
      Meteor.call("forumreplies.react", stringToSend, this.props.post._id);
    } else {
      Meteor.call("forumposts.react", stringToSend, this.props.post._id);
    }
    if(isPrompt) {
      this.toggleEmojiPrompt();
    }
  }

  toggleEmojiPrompt() {
    this.setState({
      showEmojiPrompt: !this.state.showEmojiPrompt
    });
  }

  closePrompt() {
    this.setState({
      showEmojiPrompt: false
    });
  }

  showProfile() {
    this.setState({
      showProfile: true
    });
  }

  closeProfile() {
    this.setState({
      showProfile: false
    });
  }

  render() {
    let creationDate = this.props.post.createdAt ? this.props.post.createdAt : new Date("2020-07-25T15:24:30+00:00");
    let creationDateText = creationDate.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    let canEdit = this.props.post.owner === Meteor.userId() || checkWritePermission(Meteor.userId(), this.props.planet);

    return (
      <div className="ForumThreadItem">
        <Profile isOpen={this.state.showProfile} planet={this.props.planet} userId={this.props.post.owner} onClose={this.closeProfile}/>
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
        >Are you sure you want to delete this post? It will be lost forever! (A long time!)</Alert>
        <div className="ForumThreadItem-info">
          <div className="ForumThreadItem-profilepic" onClick={this.showProfile}/>
          <div className="ForumThreadItem-username" onClick={this.showProfile}>{this.props.user[0] && this.props.user[0].username}</div>
        </div>
        <div className="ForumThreadItem-content">
          <div className="ForumThreadItem-postinfo">
            <div>
              <Icon icon="time" className="ForumThreadItem-postinfo-dateicon"/>
              <span className="ForumThreadItem-postinfo-date">{creationDateText}</span>
            </div>
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
              {canEdit && <Button small={true} icon="edit" text="Edit" onClick={this.toggleEditor} minimal={true} alignText="left"/>}
              {canEdit && <Button small={true} icon="trash" text="Delete" minimal={true} onClick={this.toggleAlert} alignText="left" intent={Intent.DANGER}/>}
              {this.props.isParent && checkWritePermission(Meteor.userId(), this.props.planet) && <Button small={true} icon="pin" text={this.props.post.stickied ? "Unsticky" : "Sticky"} minimal={true} onClick={this.sticky} alignText="left" intent={Intent.SUCCESS}/>}
              {this.props.isParent && checkWritePermission(Meteor.userId(), this.props.planet) && <Button small={true} icon="lock" text={this.props.post.locked ? "Unlock" : "Lock"} minimal={true} onClick={this.lock} alignText="left" intent={Intent.WARNING}/>}
            </ButtonGroup>
            <ButtonGroup className="ForumThreadItem-reactions">
              {this.props.post.reactions.map((value) => (<Button key={value.emoji} onClick={() => this.selectEmoji({native: value.emoji})} minimal={!value.reactors.includes(Meteor.userId())} small={true} icon={Object.keys(DefaultCustom).includes(value.emoji) ? <img src={DefaultCustom[value.emoji]} className="ForumThreadItem-customemoji"/> : <Twemoji className="ForumThreadItem-twemoji">{value.emoji}</Twemoji>} text={value.reactors.length}/>))}
              <Popover isOpen={this.state.showEmojiPrompt} onClose={this.closePrompt}>
                <Button minimal={true} small={true} icon="new-object" onClick={this.toggleEmojiPrompt}/>
                <div>
                  <Picker theme="dark" set="twitter" title="Pick an emoji" emoji="smile" custom={PickerEmojis} onSelect={(e) => this.selectEmoji(e, true)}/>
                </div>
              </Popover>
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