import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import {Button, Menu, MenuItem, ContextMenu, Popover, Classes, PopoverPosition, Alert, Intent, Icon} from "@blueprintjs/core";
import { checkWritePermission } from "../../../../util/checkPermissions";
import "./css/FileListButton.css";

class FileListButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      renameText: "",
      rename: false,
      delete: false 
    };

    this.handleContext = this.handleContext.bind(this);
    this.delete = this.delete.bind(this);
    this.rename = this.rename.bind(this);
    this.updateRenameText = this.updateRenameText.bind(this);
    this.finishRename = this.finishRename.bind(this);
    this.finishDelete = this.finishDelete.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
  }

  delete() {
    (e) => e.stopPropagation();
    this.setState({
      delete: !this.state.delete
    });
  }

  finishDelete() {
    (e) => e.stopPropagation();
    Meteor.call("aws.deletefile", this.props.object._id);
    this.delete();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState;
  }

  rename() {
    this.setState({
      renameText: this.props.object.name,
      rename: true
    });
  }

  updateRenameText(e) {
    this.setState({
      renameText: e.target.value
    });
  }

  finishRename() {
    Meteor.call("fileobjects.renamefile", this.props.object._id, this.state.renameText);
    this.setState({
      renameText: "",
      rename: false
    });
  }

  downloadFile() {
    Meteor.call("aws.downloadfile", this.props.object._id, (error, value) => {
      if(error) {
        console.log(error);
      }
      if(value) {
        window.open(value,"_self");
      }
    });
  }

  handleContext(e) {
    if(checkWritePermission(Meteor.userId(), this.props.planet)) {
      e.preventDefault();
      ContextMenu.show(<Menu>
        <MenuItem text="Delete" icon="delete" onClick={this.delete}/>
        <MenuItem text="Rename" icon="edit" onClick={this.rename}/>
        {this.props.object.type === "file" && <MenuItem text="Download" icon="download" onClick={this.downloadFile}/>}
      </Menu>, { left: e.clientX, top: e.clientY }, () => {
        // menu was closed; callback optional
      }, true);
    }
  }

  onDragStart(e) {
    e.stopPropagation();
    e.dataTransfer.setData("text/plain", this.props.object._id);
  }

  onDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    if(e.dataTransfer.items[0].kind === "string") {
      e.dataTransfer.items[0].getAsString((stringValue) => {
        if(stringValue !== this.props.object._id) {
          Meteor.call("fileobjects.moveobject", stringValue, this.props.object._id);
        }
      });
    }
  }

  render() {
    let date = this.props.object.createdAt ? this.props.object.createdAt : new Date("2020-07-25T15:24:30+00:00");
    let fileDate = date.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    return (
      <div
        draggable={true}
        alignText="left"
        onContextMenu={this.handleContext} large={true}
        onClick={(() => this.props.gotoSubComponent(this.props.object._id))}
        onDragStart={this.onDragStart}
        onDrop={this.onDrop} 
        className="FileListButton"
      >
        <div><Icon className="FileListButton-icon" icon={this.props.object.type === "folder" ? "folder-close" : "document"}/>{this.props.object.name}</div>
        <div className="FileListButton-date">{fileDate}</div>
        <Popover isOpen={this.state.rename} position={PopoverPosition.AUTO_START}>
          <div className="FilesComponent-dummytarget"></div>
          <div className="MainSidebar-menu-form" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()} onKeyPress={(e) => e.stopPropagation()} onKeyUp={(e) => e.stopPropagation()}>
            <input className={Classes.INPUT + " MainSidebar-menu-input"} value={this.state.renameText} onChange={this.updateRenameText}/>
            <Button text="Rename" className="MainSidebar-menu-button" onClick={this.finishRename}/>
          </div>
        </Popover>
        <Alert
          isOpen={this.state.delete}
          className="bp3-dark"
          icon="trash"
          intent={Intent.DANGER}
          confirmButtonText="Delete"
          cancelButtonText="Cancel"
          canOutsideClickCancel={true}
          canEscapeKeyCancel={true}
          onCancel={this.delete}
          onConfirm={this.finishDelete}
        >Are you sure you want to delete this file?<br/>&apos;{this.props.object.name}&apos; will be lost forever! (A long time!)</Alert>
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    currentUser: Meteor.user()
  };
})(FileListButton);