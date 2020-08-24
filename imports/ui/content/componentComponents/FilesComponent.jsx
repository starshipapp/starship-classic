import React from "react";
import Files from "../../../api/components/files/files";
import FileObjects from "../../../api/components/files/fileobjects";
import {withTracker} from "meteor/react-meteor-data";
import "./css/FilesComponent";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import { checkWritePermission } from "../../../util/checkPermissions";
import { Button, Divider, ButtonGroup, Classes, Popover, vertical, ProgressBar, Icon, Intent} from "@blueprintjs/core";
import FileBreadcrumbs from "./files/FileBreadcrumbs";
import axios from "axios";
import FileView from "./files/FileView";
import FileButton from "./files/FileButton";
import {uuid} from "uuidv4";
import MimeTypes from "../../../util/validMimes";

class FilesComponent extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      newFolderTextbox: "",
      uploadUpdateCounter: 0
    };
    
    this.createFolder = this.createFolder.bind(this);
    this.updateTextbox = this.updateTextbox.bind(this);
    this.onFileUploadClick = this.onFileUploadClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.gotoSubComponent = this.gotoSubComponent.bind(this);
    this.downloadZip = this.downloadZip.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
    this.dropHandler = this.dropHandler.bind(this);

    this.uploading = {};

    this.fileInput = React.createRef();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState;
  }

  createFolder() {
    let path = this.props.subId && this.props.currentObject[0] ? this.props.currentObject[0].path.concat(this.props.currentObject[0]._id) : ["root"];
    Meteor.call("fileobjects.createfolder", path, this.state.newFolderTextbox, this.props.id, (error, value) => {
      if(error) {
        //error
      }
      if(value) {
        this.setState({
          newFolderTextbox: ""
        });
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
    let folderId = this.props.subId ? this.props.subId : "root";
    for(let i = 0; i < e.target.files.length; i++) {
      let file = e.target.files[i];
      this.uploadFile(file, folderId);
    }
    this.setState({
      uploadUpdateCounter: this.state.uploadUpdateCounter + 1
    });
  }

  onFileUploadClick() {
    this.fileInput.current.click();
  }

  downloadZip() {
    Meteor.call("aws.generatezipkey", this.props.subId, (error, value) => {
      if(error) {
        console.log(error);
      }
      if(value && this.props.files && this.props.files.length !== 0) {
        window.open(window.location.protocol + "//" + window.location.host + "/aws/downloadzip/" + value,"_self");
      }
    });
  }

  downloadFile() {
    Meteor.call("aws.downloadfile", this.props.currentObject[0]._id, (error, value) => {
      if(error) {
        console.log(error);
      }
      if(value) {
        window.open(value,"_self");
      }
    });
  }

  dropHandler(e) {
    e.preventDefault();
    
    let folderId = this.props.subId ? this.props.subId : "root";
  
    if (e.dataTransfer.items) {
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        if (e.dataTransfer.items[i].kind === "file") {
          let file = e.dataTransfer.items[i].getAsFile();
          this.uploadFile(file, folderId);
        }
      }
    } else {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        this.uploadFile(e.dataTransfer.files[i], folderId);
      }
    }
  }

  uploadFile(file, folderId) {
    Meteor.call("aws.uploadfile", folderId, file.type, file.name, this.props.id, (error, value) => {
      if(error) {
        console.log(error);
      }
      if(value) {
        let currentIndex = uuid();
        this.uploading[currentIndex] = {
          name: file.name,
          progress: 0
        };
        const options = { headers: { "Content-Type": file.type }, onUploadProgress: progressEvent => {
          this.uploading[currentIndex].progress = progressEvent.loaded / progressEvent.total;
          if(this.uploading[currentIndex].progress === 1) {
            delete this.uploading[currentIndex];
          }
          this.setState({
            uploadUpdateCounter: this.state.uploadUpdateCounter + 1
          });
        }};
        axios.put(value.url, file, options).then(function () {
          // handle success
          Meteor.call("fileobjects.completeupload", value.documentId);
        }).catch(function (error) {
          // handle error
          console.log(error);
        });
      }
    });
  }
  
  onDragOver(e) {
    e.preventDefault();
  }

  render() {
    return (
      <div className="bp3-dark FilesComponent" onDrop={this.dropHandler} onDragOver={this.onDragOver} onDragEnd={this.onDragOver}>
        <div className="FilesComponent-top">
          <input
            type="file"
            ref={this.fileInput}
            id="upload-button"
            style={{ display: "none" }}
            onChange={this.handleChange}
            multiple
          />
          <FileBreadcrumbs className="FilesComponent-breadcrumbs" navigateTo={(value) => this.gotoSubComponent(value)} path={this.props.currentObject[0] ? this.props.currentObject[0].path.concat([this.props.currentObject[0]._id]) : ["root"]} planetId={this.props.planet._id}/>
          <div className="FilesComponent-uploading">
            {Object.values(this.uploading).length !== 0 && <div className="FilesComponent-uploading-container">
              <Icon className="FilesComponent-uploading-icon" iconSize={16} icon="upload"/>
              <ProgressBar className="FilesComponent-uploading-progress" intent={Intent.PRIMARY}/>
              <Popover>
                <Icon className="FilesComponent-uploading-icon" iconSize={16} icon="chevron-down"/>
                <div className="FilesComponent-uploading-info-container">
                  {Object.values(this.uploading).map((value, index) => (<div key={index} className="FilesComponent-uploading-info">
                    <div className="FilesComponent-uploading-info-name">{value.name}</div>
                    <ProgressBar className="FilesComponent-uploading-info" value={value.progress} intent={Intent.PRIMARY}/>
                  </div>))}
                </div>
              </Popover>
            </div>}
          </div>
          <Divider/>
          {this.props.currentObject[0] && this.props.currentObject[0].type === "file" && MimeTypes.previewTypes.includes(this.props.currentObject[0].fileType) && <ButtonGroup minimal={true} vertical={vertical} className="FilesComponent-top-actions">
            <Button text="Download" icon="download" onClick={this.downloadFile}/>
          </ButtonGroup>}
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
            <Button text="Download Folder" icon="download" onClick={this.downloadZip}/>
          </ButtonGroup>}
        </div>
        {(!this.props.currentObject[0] || this.props.currentObject[0].type === "folder") && <div className="FilesComponent-button-container">
          {this.props.folders.map((value) => (<FileButton planet={this.props.planet} key={value._id} object={value} gotoSubComponent={this.gotoSubComponent}/>))}
          {this.props.files.map((value) => (<FileButton planet={this.props.planet} key={value._id} object={value} gotoSubComponent={this.gotoSubComponent}/>))}
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
    folders: FileObjects.find({componentId: props.id, parent: path, type: "folder"}, {sort: {name: 1}}).fetch(),
    files: FileObjects.find({componentId: props.id, parent: path, type: "file", finishedUploading: true}, {sort: {name: 1}}).fetch(),
    currentObject: FileObjects.find({_id: path}).fetch(),
    currentUser: Meteor.user()
  };
})(FilesComponent);