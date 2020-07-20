import React from "react";
import Files from "../../../api/components/files/files";
import FileObjects from "../../../api/components/files/fileobjects";
import {withTracker} from "meteor/react-meteor-data";
import "./css/FilesComponent";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import { checkWritePermission } from "../../../util/checkPermissions";
import { Breadcrumbs, Breadcrumb, Button, Divider, ButtonGroup, Classes, Icon, Popover, vertical } from "@blueprintjs/core";

class FilesComponent extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      newFolderTextbox: ""
    }
    
    this.createFolder = this.createFolder.bind(this);
    this.updateTextbox = this.updateTextbox.bind(this);
  }

  createFolder() {
    console.log(this.props);
    let path = this.props.subId && this.props.currentObject[0] ? this.props.currentObject[0].path.concat(this.props.currentObject[0]._id) : ["root"];
    Meteor.call("fileobjects.createfolder", path, this.state.newFolderTextbox, this.props.id)
  }

  updateTextbox(e) {
    this.setState({
      newFolderTextbox: e.target.value
    })
  }

  gotoSubComponent(componentId) {
    FlowRouter.go("Planets.component.subid", {_id: this.props.planet._id, _cid: this.props.id, _sid: componentId});
  }

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
          {checkWritePermission(Meteor.userId(), this.props.planet) && <ButtonGroup minimal={true} vertical={vertical} className="FilesComponent-top-actions">
            <Button text="Upload Files" icon="upload"/>
            <Popover>
              <Button text="New Folder" icon="folder-new"/>
              <div className="MainSidebar-menu-form">
                <input className={Classes.INPUT + " MainSidebar-menu-input"} value={this.state.newFolderTextbox} onChange={this.updateTextbox}/>
                <Button text="Create" className="MainSidebar-menu-button" onClick={this.createFolder}/>
              </div>
            </Popover>
            <Divider/>
            <Button text="Download Folder" icon="download"/>
          </ButtonGroup>}
        </div>
        <div className="FilesComponent-button-container">
          {this.props.folders.map((value) => (<Button alignText="left" large={true} className={"FilesComponent-filebutton"} icon="folder-close" text={value.name} onClick={(() => this.gotoSubComponent(value._id))}/>))}
        </div>
      </div>
    );
  }

  breadcrumbRenderer({text, ...props}) {
    return <Breadcrumb {...props}>{text}</Breadcrumb>;
  }
}

export default withTracker((props) => {
  let path = props.subId ? props.subId : "root";

  console.log(path);

  Meteor.subscribe("files.filecomponent", props.id);
  Meteor.subscribe("fileobjects.folders", props.id, path);
  if(props.subId) {
    Meteor.subscribe("fileobjects.object", props.subId)
  }

  return {
    fileComponent: Files.find({_id: props.id}).fetch(),
    folders: FileObjects.find({componentId: props.id, parent: path, type: "folder"}).fetch(),
    currentObject: FileObjects.find({_id: path}).fetch(),
    currentUser: Meteor.user()
  };
})(FilesComponent);