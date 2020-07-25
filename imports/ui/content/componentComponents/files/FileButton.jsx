import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import "./css/FileView";
import {Button, Menu, MenuItem, ContextMenu, Popover, Classes, PopoverPosition} from "@blueprintjs/core";
import { checkWritePermission } from "../../../../util/checkPermissions";

class FileButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      renameText: "",
      rename: false 
    };

    this.handleContext = this.handleContext.bind(this);
    this.delete = this.delete.bind(this);
    this.rename = this.rename.bind(this);
    this.updateRenameText = this.updateRenameText.bind(this);
    this.finishRename = this.finishRename.bind(this);
  }

  delete() {
    Meteor.call("aws.deletefile", this.props.object._id);
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

  render() {
    return (
      <Button
        alignText="left"
        onContextMenu={this.handleContext} large={true} className={"FilesComponent-filebutton"}
        icon={this.props.object.type === "folder" ? "folder-close" : "document"}
        onClick={(() => this.props.gotoSubComponent(this.props.object._id))}
        text={this.props.object.name}
      >
        <Popover isOpen={this.state.rename} position={PopoverPosition.AUTO_START}>
          <div className="FilesComponent-dummytarget"></div>
          <div className="MainSidebar-menu-form" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()} onKeyPress={(e) => e.stopPropagation()} onKeyUp={(e) => e.stopPropagation()}>
            <input className={Classes.INPUT + " MainSidebar-menu-input"} value={this.state.newFolderTextbox} onChange={this.updateRenameText}/>
            <Button text="Rename" className="MainSidebar-menu-button" onClick={this.finishRename}/>
          </div>
        </Popover>
      </Button>
    );
  }
}

export default withTracker(() => {
  return {
    currentUser: Meteor.user()
  };
})(FileButton);