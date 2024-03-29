import React from "react";
import {Button} from "@blueprintjs/core";
import Pages from "../../../api/components/pages";
import {withTracker} from "meteor/react-meteor-data";
import ReactMarkdown from "react-markdown";
import "./css/PageComponent";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { checkWritePermission } from "../../../util/checkPermissions";
import editorOptions from "../../../util/editorOptions";

class PageComponent extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      isEditing: false,
      editingContent: ""
    };
    
    this.startEditing = this.startEditing.bind(this);
    this.save = this.save.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState;
  }

  startEditing() {
    this.setState({
      isEditing: true,
      editingContent: this.props.page[0].content
    });
  }

  save() {
    Meteor.call("pages.update", this.props.id, this.state.editingContent);
    this.setState({
      isEditing: false
    });
  }

  handleChange(value) {
    this.setState({
      editingContent: value
    });
  }

  render() {
    return (
      <div className="bp3-dark PageComponent">
        {this.props.page[0] && !this.state.isEditing && <ReactMarkdown>{this.props.page[0].content}</ReactMarkdown>}
        {this.props.page[0] && this.state.isEditing && <SimpleMDE onChange={this.handleChange} value={this.state.editingContent} options={editorOptions}/>}
        {(this.props.page[0] && checkWritePermission(Meteor.userId(), this.props.planet)) && (!this.state.isEditing ? <Button
          icon="edit"
          onClick={this.startEditing}
          minimal={true}
          className="PageComponent-edit PageComponent-edit-button"
        /> : <Button
          icon="saved"
          onClick={this.save}
          className="PageComponent-edit PageComponent-save-button"
        >
          Save
        </Button>)}
      </div>
    );
  }
}

export default withTracker((props) => {
  Meteor.subscribe("pages.page", props.id);

  return {
    page: Pages.find({_id: props.id}).fetch(),
    currentUser: Meteor.user()
  };
})(PageComponent);