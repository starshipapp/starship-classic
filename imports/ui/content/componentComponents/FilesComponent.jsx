import React from "react";
import Files from "../../../api/components/files/files";
import FileObjects from "../../../api/components/files/fileobjects";
import {withTracker} from "meteor/react-meteor-data";
import "./css/FilesComponent";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import { checkWritePermission } from "../../../util/checkPermissions";
import { Button, Divider, ButtonGroup, Classes, Popover, vertical, Text } from "@blueprintjs/core";
import FileBreadcrumbs from "./files/FileBreadcrumbs";
import axios from "axios";
import FileView from "./files/FileView";

class FilesComponent extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      newFolderTextbox: ""
    };
    
    this.createFolder = this.createFolder.bind(this);
    this.updateTextbox = this.updateTextbox.bind(this);
    this.onFileUploadClick = this.onFileUploadClick.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.fileInput = React.createRef();
  }

  createFolder() {
    let path = this.props.subId && this.props.currentObject[0] ? this.props.currentObject[0].path.concat(this.props.currentObject[0]._id) : ["root"];
    Meteor.call("fileobjects.createfolder", path, this.state.newFolderTextbox, this.props.id, (error, value) => {
      if(error) {
        //error
      }
      if(value) {
        this.gotoSubComponent(value);
      }
    });
  }

  updateTextbox(e) {
    this.setState({
      newFolderTextbox: e.target.value
    });
  }

  gotoSubComponent(componentId) {
    if(componentId === "root") {
      FlowRouter.go("Planets.component", {_id: this.props.planet._id, _cid: this.props.id});
    } else {
      FlowRouter.go("Planets.component.subid", {_id: this.props.planet._id, _cid: this.props.id, _sid: componentId});
    }
  }

  handleChange(e) {
    let file = e.target.files[0];
    let folderId = this.props.subId ? this.props.subId : "root";
    Meteor.call("aws.uploadfile", folderId, this.props.id, file.type, file.name, (error, value) => {
      if(error) {
        console.log(error);
      }
      if(value) {
        const options = { headers: { "Content-Type": file.type } };
        axios.put(value.url, file, options).then(function (response) {
          // handle success
          Meteor.call("fileobjects.completeupload", value.documentId);
        }).catch(function (error) {
          // handle error
          console.log(error);
        });
      }
    });
  }

  onFileUploadClick() {
    this.fileInput.current.click();
  }

  render() {
    return (
      <div className="bp3-dark FilesComponent">
        <div className="FilesComponent-top">
          <input
            type="file"
            ref={this.fileInput}
            id="upload-button"
            style={{ display: "none" }}
            onChange={this.handleChange}
          />
          <FileBreadcrumbs navigateTo={(value) => this.gotoSubComponent(value)} path={this.props.currentObject[0] ? this.props.currentObject[0].path.concat([this.props.currentObject[0]._id]) : ["root"]} planetId={this.props.planet._id}/>
          {checkWritePermission(Meteor.userId(), this.props.planet) && (!this.props.currentObject[0] || this.props.currentObject[0].type === "folder") && <ButtonGroup minimal={true} vertical={vertical} className="FilesComponent-top-actions">
            <Button text="Upload Files" icon="upload" onClick={this.onFileUploadClick}/>
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
        {(!this.props.currentObject[0] || this.props.currentObject[0].type === "folder") && <div className="FilesComponent-button-container">
          {this.props.folders.map((value) => (<Button alignText="left" key={value._id} large={true} className={"FilesComponent-filebutton"} icon="folder-close" text={value.name} onClick={(() => this.gotoSubComponent(value._id))}/>))}
          {this.props.files.map((value) => (<Button alignText="left" key={value._id} large={true} className={"FilesComponent-filebutton"} icon="document"  onClick={(() => this.gotoSubComponent(value._id))}><Text>{value.name}</Text></Button>))}
        </div>}
        {this.props.currentObject[0] && this.props.currentObject[0].type === "file" && <FileView file={this.props.currentObject[0]}/>}
      </div>
    );
  }
}

export default withTracker((props) => {
  let path = props.subId ? props.subId : "root";

  Meteor.subscribe("files.filecomponent", props.id);
  Meteor.subscribe("fileobjects.folders", props.id, path);
  Meteor.subscribe("fileobjects.files", props.id, path);
  if(props.subId) {
    Meteor.subscribe("fileobjects.object", props.subId);
  }

  return {
    fileComponent: Files.find({_id: props.id}).fetch(),
    folders: FileObjects.find({componentId: props.id, parent: path, type: "folder"}).fetch(),
    files: FileObjects.find({componentId: props.id, parent: path, type: "file", finishedUploading: true}).fetch(),
    currentObject: FileObjects.find({_id: path}).fetch(),
    currentUser: Meteor.user()
  };
})(FilesComponent);