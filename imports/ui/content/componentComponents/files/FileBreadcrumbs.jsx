import React from "react";
import FileObjects from "../../../../api/components/files/fileobjects";
import {withTracker} from "meteor/react-meteor-data";
import { Breadcrumbs, Breadcrumb } from "@blueprintjs/core";

class FileBreadcrumbs extends React.Component {
  render() {
    let items = [
      {text: "Root", icon: "home", onClick: () => this.props.navigateTo("root")}
    ];

    let array = this.props.folders.slice();
    array.sort((a, b) => this.props.path.indexOf(a._id) - this.props.path.indexOf(b._id));
    array.map((value) => {items.push({text: value.name, icon: (value.type === "folder" ? "folder-close" : "document"), onClick: () => this.props.navigateTo(value._id)});});

    return (
      <Breadcrumbs
        className="FilesComponent-breadcrumbs"
        currentBreadcrumbRenderer={this.breadcrumbRenderer}
        items={items}
      />
    );
  }

  breadcrumbRenderer({text, ...props}) {
    return <Breadcrumb {...props}>{text}</Breadcrumb>;
  }
}

export default withTracker((props) => {
  Meteor.subscribe("fileobjects.objectslist", props.path.slice(1), props.planetId);

  return {
    folders: FileObjects.find({_id: {$in: props.path.slice(1)}}).fetch(),
    currentUser: Meteor.user()
  };
})(FileBreadcrumbs);