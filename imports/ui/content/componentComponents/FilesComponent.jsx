import React from "react";
import Files from "../../../api/components/files/files";
import {withTracker} from "meteor/react-meteor-data";
import "./css/PageComponent";
import { checkWritePermission } from "../../../util/checkPermissions";
import { Tree, Classes, Icon } from "@blueprintjs/core";

class FilesComponent extends React.Component {
  render() {
    return (
      <div className="bp3-dark FilesComponent">
        <h1>files</h1>
        <div className={Classes.ELEVATION_0 + " FilesComponent-filebutton"}>
          <Icon icon="folder-close"/> Folder 1
        </div>
      </div>
    );
  }
}

export default withTracker((props) => {
  Meteor.subscribe("files.filecomponent", props.id);

  return {
    fileComponent: Files.find({_id: props.id}).fetch(),
    currentUser: Meteor.user()
  };
})(FilesComponent);