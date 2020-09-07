import React from "react";
import {ErrorToaster} from "../../../Toaster";
import {withTracker} from "meteor/react-meteor-data";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Button, Classes, Intent, Popover, Menu, MenuItem } from "@blueprintjs/core";
import "./css/ForumEditor";

class ForumEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      editingContent: "",
      activeTag: null
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.postThread = this.postThread.bind(this);
    this.setActiveTag = this.setActiveTag.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState;
  }

  handleChange(value) {
    this.setState({
      editingContent: value
    });
  }

  handleNameChange(value) {
    this.setState({
      name: value.target.value
    });
  }

  postThread() {
    if(this.state.name === "") {
      ErrorToaster.show({message: "Please provide a name.", icon:"error", intent:Intent.DANGER});
    }

    if(this.state.editingContent === "") {
      ErrorToaster.show({message: "Cannot create a thread with no content.", icon:"error", intent:Intent.DANGER});
    }
    Meteor.call("forumposts.insert", this.props.forumId, this.state.editingContent, this.state.name, this.state.activeTag);
    this.props.onClose();
  }

  setActiveTag(tag) {
    this.setState({
      activeTag: this.state.activeTag === tag ? null : tag
    });
  }

  render() {
    return (
      <div className="ForumEditor">
        <div className="ForumEditor-title">
          <input className={Classes.INPUT + " ForumEditor-name " + Classes.LARGE} value={this.state.name} onChange={this.handleNameChange} placeholder="Thread Name"/>
          {this.props.forum.tags && this.props.forum.tags.length !== 0 && <Popover>
            <Button large={true} text={this.state.activeTag ? this.state.activeTag : "Tags"} icon="chevron-down"/>
            <Menu>
              {this.props.forum.tags.map((value) => (<MenuItem icon={this.state.activeTag === value && "tick"} text={value} onClick={() => this.setActiveTag(value)} key={value}/>))}
            </Menu>
          </Popover>}
        </div>
        <SimpleMDE onChange={this.handleChange} value={this.state.editingContent}/>
        <Button text="Post" className="ForumEditor-button" onClick={this.postThread}/>
        <Button text="Cancel" className="ForumEditor-button" onClick={this.props.onClose}/>
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    currentUser: Meteor.user()
  };
})(ForumEditor);