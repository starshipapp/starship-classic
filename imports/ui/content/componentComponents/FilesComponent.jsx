import React from "react";
import Files from "../../../api/components/files/files";
import {withTracker} from "meteor/react-meteor-data";
import "./css/FilesComponent";
import { checkWritePermission } from "../../../util/checkPermissions";
import { Breadcrumbs, Breadcrumb, Button, Divider, ButtonGroup, Classes, Icon, vertical } from "@blueprintjs/core";

class FilesComponent extends React.Component {
  render() {
    return (
      <div className="bp3-dark FilesComponent">
        <div className="FilesComponent-top">
          <Breadcrumbs
            currentBreadcrumbRenderer={this.breadcrumbRenderer}
            items={[
              {text: "Root"},
              {text: "Folder", icon: "folder-close"},
              {text: "Folder", icon: "folder-close"},
              {text: "Folder", icon: "folder-close"},
            ]}
          />
          <ButtonGroup minimal={true} vertical={vertical} className="FilesComponent-top-actions">
            <Button text="Upload Files" icon="upload"/>
            <Button text="New Folder" icon="folder-new"/>
            <Divider />
            <Button text="Download Folder" icon="download"/>
          </ButtonGroup>
        </div>
        <div className="FilesComponent-button-container">
          <div className={Classes.ELEVATION_0 + " FilesComponent-filebutton"}>
            <Icon icon="folder-close" className="FilesComponent-file-icon"/> Folder 1
          </div>
          <div className={Classes.ELEVATION_0 + " FilesComponent-filebutton"}>
            <Icon icon="folder-close" className="FilesComponent-file-icon"/> Folder 1
          </div>
          <div className={Classes.ELEVATION_0 + " FilesComponent-filebutton"}>
            <Icon icon="folder-close" className="FilesComponent-file-icon"/> Folder 1
          </div>
          <div className={Classes.ELEVATION_0 + " FilesComponent-filebutton"}>
            <Icon icon="folder-close" className="FilesComponent-file-icon"/> Folder 1
          </div>
          <div className={Classes.ELEVATION_0 + " FilesComponent-filebutton"}>
            <Icon icon="folder-close" className="FilesComponent-file-icon"/> Folder 1
          </div>
          <div className={Classes.ELEVATION_0 + " FilesComponent-filebutton"}>
            <Icon icon="folder-close" className="FilesComponent-file-icon"/> Folder 1
          </div>
          <div className={Classes.ELEVATION_0 + " FilesComponent-filebutton"}>
            <Icon icon="folder-close" className="FilesComponent-file-icon"/> Folder 1
          </div>
          <div className={Classes.ELEVATION_0 + " FilesComponent-filebutton"}>
            <Icon icon="folder-close" className="FilesComponent-file-icon"/> Folder 1
          </div>
          <div className={Classes.ELEVATION_0 + " FilesComponent-filebutton"}>
            <Icon icon="folder-close" className="FilesComponent-file-icon"/> Folder 1
          </div>
          <div className={Classes.ELEVATION_0 + " FilesComponent-filebutton"}>
            <Icon icon="folder-close" className="FilesComponent-file-icon"/> Folder 1
          </div>
          <div className={Classes.ELEVATION_0 + " FilesComponent-filebutton"}>
            <Icon icon="folder-close" className="FilesComponent-file-icon"/> Folder 1
          </div>
          <div className={Classes.ELEVATION_0 + " FilesComponent-filebutton"}>
            <Icon icon="folder-close" className="FilesComponent-file-icon"/> Folder 1
          </div>
          <div className={Classes.ELEVATION_0 + " FilesComponent-filebutton"}>
            <Icon icon="folder-close" className="FilesComponent-file-icon"/> Folder 1
          </div>
          <div className={Classes.ELEVATION_0 + " FilesComponent-filebutton"}>
            <Icon icon="folder-close" className="FilesComponent-file-icon"/> Folder 1
          </div>
          <div className={Classes.ELEVATION_0 + " FilesComponent-filebutton"}>
            <Icon icon="folder-close" className="FilesComponent-file-icon"/> Folder 1
          </div>
          <div className={Classes.ELEVATION_0 + " FilesComponent-filebutton"}>
            <Icon icon="folder-close" className="FilesComponent-file-icon"/> Folder 1
          </div>
        </div>
      </div>
    );
  }

  breadcrumbRenderer({text, ...props}) {
    return <Breadcrumb {...props}>{text}</Breadcrumb>;
  }
}

export default withTracker((props) => {
  Meteor.subscribe("files.filecomponent", props.id);

  return {
    fileComponent: Files.find({_id: props.id}).fetch(),
    currentUser: Meteor.user()
  };
})(FilesComponent);