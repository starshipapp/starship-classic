import React from "react";
import {ErrorToaster} from "../../../Toaster";
import {withTracker} from "meteor/react-meteor-data";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Button, Classes, Intent } from "@blueprintjs/core";
import "./css/ForumEditor";

class ForumEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      editingContent: ""
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.postThread = this.postThread.bind(this);
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
    Meteor.call("forumposts.insert", this.props.forumId, this.state.editingContent, this.state.name);
    this.props.onClose();
  }

  render() {
    return (
      <div className="ForumEditor">
        <input className={Classes.INPUT + " ForumEditor-name " + Classes.LARGE} value={this.state.name} onChange={this.handleNameChange} placeholder="Thread Name"/>
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