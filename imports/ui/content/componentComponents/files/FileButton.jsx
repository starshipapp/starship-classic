import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import "./css/FileView";
import {Button, Menu, MenuItem, ContextMenu, Popover, Classes, PopoverPosition, Tooltip, Alert, Intent} from "@blueprintjs/core";
import { checkWritePermission } from "../../../../util/checkPermissions";

class FileButton extends React.Component {
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

  handleContext(e) {
    if(checkWritePermission(Meteor.userId(), this.props.planet)) {
      e.preventDefault();
      ContextMenu.show(<Menu>
        <MenuItem text="Delete" icon="delete" onClick={this.delete}/>
        <MenuItem text="Rename" icon="edit" onClick={this.rename}/>
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
    console.log(e.dataTransfer);
    if(e.dataTransfer.items[0].kind === "string") {
      e.dataTransfer.items[0].getAsString((stringValue) => {
        if(stringValue !== this.props.object._id) {
          Meteor.call("fileobjects.moveobject", stringValue, this.props.object._id);
        }
      });
    }
  }

  render() {
    return (
      <div>
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
        >Are you sure you want to delete {this.props.object.name}? It will be gone forever (a very long time)!</Alert>
        <Tooltip content={this.props.object.name} inheritDarkTheme={true}>
          <Button
            draggable={this.props.object.type !== "folder"}
            alignText="left"
            onContextMenu={this.handleContext} large={true} className={"FilesComponent-filebutton"}
            icon={this.props.object.type === "folder" ? "folder-close" : "document"}
            onClick={(() => this.props.gotoSubComponent(this.props.object._id))}
            text={this.props.object.name}
            onDragStart={this.onDragStart}
            onDrop={this.onDrop}
          >
            <Popover isOpen={this.state.rename} position={PopoverPosition.AUTO_START}>
              <div className="FilesComponent-dummytarget"></div>
              <div className="MainSidebar-menu-form" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()} onKeyPress={(e) => e.stopPropagation()} onKeyUp={(e) => e.stopPropagation()}>
                <input className={Classes.INPUT + " MainSidebar-menu-input"} value={this.state.newFolderTextbox} onChange={this.updateRenameText}/>
                <Button text="Rename" className="MainSidebar-menu-button" onClick={this.finishRename}/>
              </div>
            </Popover>
          </Button>
        </Tooltip>
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    currentUser: Meteor.user()
  };
})(FileButton);