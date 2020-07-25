import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import "./css/FileView";
import { Icon, Button } from "@blueprintjs/core";

class FileView extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState;
  }

  downloadFile() {
    console.log("a");
    Meteor.call("aws.downloadfile", this.props.file._id, (error, value) => {
      if(error) {
        console.log(error);
      }
      if(value) {
        window.open(value,"_self");
        console.log(value);
      }
    });
  }

  render() {
    return (
      <div className="FileView">
        <div className="FileView-container">
          <Icon className="FileView-icon" icon="document" iconSize={128}/>
          <div className="FileView-name">{this.props.file.name}</div>
          <Button icon="download" className="FileView-button" text="Download" onClick={() => this.downloadFile()}/>
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    currentUser: Meteor.user()
  };
})(FileView);