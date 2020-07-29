import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Button } from "@blueprintjs/core";

class ForumEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editingContent: ""
    };
    
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.setState({
      editingContent: value
    });
  }

  render() {
    return (
      <div className="ForumEditor">
        <SimpleMDE onChange={this.handleChange} value={this.state.editingContent}/>
        <Button text="Post"/>
        <Button text="Cancel"/>
      </div>
    );
  }
}

export default withTracker((props) => {
  return {
    currentUser: Meteor.user()
  };
})(ForumEditor);