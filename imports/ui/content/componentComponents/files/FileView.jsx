import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import "./css/FileView";
import { Icon, Button } from "@blueprintjs/core";
import MimeTypes from "../../../../util/validMimes";
import { Files } from "../../../../api/collectionsStandalone";

class FileView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      previewUrl: null
    };
  }

  componentDidMount() {
    if(MimeTypes.previewTypes.includes(this.props.file.fileType)) {
      Meteor.call("aws.getpreview", this.props.file._id, (error, value) => {
        if(error) {
          console.log(error);
        }
        if(value) {
          this.setState({
            previewUrl: value
          });
        }
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState;
  }

  downloadFile() {
    Meteor.call("aws.downloadfile", this.props.file._id, (error, value) => {
      if(error) {
        console.log(error);
      }
      if(value) {
        window.open(value,"_self");
      }
    });
  }

  render() {
    let date = this.props.file.createdAt ? this.props.file.createdAt : new Date("2020-07-25T15:24:30+00:00");
    let fileDate = date.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    return (
      <div className="FileView">
        {MimeTypes.previewTypes.includes(this.props.file.fileType) ? <div className="FileView-container">
          {this.props.user[0] && <div className="FileView-upload-info">Uploaded at {fileDate} by {this.props.user[0].username}</div>}
          {MimeTypes.audioTypes.includes(this.props.file.fileType) && this.state.previewUrl && <audio preload="auto" className="FileView-preview-audio" controls src={this.state.previewUrl} type={this.props.file.fileType}/>}
          {MimeTypes.imageTypes.includes(this.props.file.fileType) && this.state.previewUrl && <img className="FileView-preview" src={this.state.previewUrl} type={this.props.file.fileType}/>}
          {MimeTypes.videoTypes.includes(this.props.file.fileType) && this.state.previewUrl && <video preload="auto" className="FileView-preview" controls src={this.state.previewUrl} type={this.props.file.fileType}/>}
        </div> : <div className="FileView-container">
          <Icon className="FileView-icon" icon="document" iconSize={128}/>
          <div className="FileView-name">{this.props.file.name}</div>
          {this.props.user[0] && <div className="FileView-upload-info">Uploaded at {fileDate} by {this.props.user[0].username}</div>}
          <Button icon="download" className="FileView-button" text="Download" onClick={() => this.downloadFile()}/>
        </div>}
      </div>
    );
  }
}

export default withTracker((props) => {
  Meteor.subscribe("users.findId", props.file.owner);

  return {
    user: Meteor.users.find({_id: props.file.owner}).fetch(),
    currentUser: Meteor.user()
  };
})(FileView);