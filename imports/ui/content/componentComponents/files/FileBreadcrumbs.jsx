import React from "react";
import FileObjects from "../../../api/components/files/fileobjects";
import {withTracker} from "meteor/react-meteor-data";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import { Breadcrumbs, Breadcrumb } from "@blueprintjs/core";

class FilesComponent extends React.Component {
  render() {
    return (
      <Breadcrumbs
        currentBreadcrumbRenderer={this.breadcrumbRenderer}
        items={[
          {text: "Root", icon: "home"},
          {text: "Folder", icon: "folder-close"},
          {text: "Folder", icon: "folder-close"},
          {text: "Folder", icon: "folder-close"},
        ]}
      />
    );
  }

  breadcrumbRenderer({text, ...props}) {
    return <Breadcrumb {...props}>{text}</Breadcrumb>;
  }
}

export default withTracker((props) => {
  Meteor.subscribe("fileobjects.objectsList", props.path.slice(1))

  return {
    folders: FileObjects.find({_id: {$in: props.path.slice(1)}}).fetch(),
    currentUser: Meteor.user()
  };
})(FilesComponent);