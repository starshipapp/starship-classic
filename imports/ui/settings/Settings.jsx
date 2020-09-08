import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import "./css/Settings.css";
import { Button, Icon } from "@blueprintjs/core";
import axios from "axios";

class Settings extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      time: Date.now()
    };

    this.handleChange = this.handleChange.bind(this);
    this.onFileUploadClick = this.onFileUploadClick.bind(this);

    this.fileInput = React.createRef();
    this.image = React.createRef();
  }

  onFileUploadClick() {
    this.fileInput.current.click();
  }

  handleChange(e) {
    let file = e.target.files[0];
    Meteor.call("aws.getprofileuploadlink", file.type, file.size, (error, value) => {
      if(error) {
        console.log(error);
      }
      if(value) {
        console.log(value);
        const options = { headers: { "Content-Type": file.type, "x-amz-acl": "public-read" }};
        axios.put(value, file, options).then(() => {
          this.image.current.src = this.props.user.profilePicture + "?t=" + Number(Date.now());
        }).catch(function (error) {
          // handle error
          console.log(error);
        });
      }
    });
  }

  render() {
    console.log(Meteor.user());
    return (
      <div className="Settings bp3-dark">
        <input
          type="file"
          ref={this.fileInput}
          id="upload-button"
          style={{ display: "none" }}
          onChange={this.handleChange}
        />
        <div className="Settings-header">
          <div className="Settings-header-text">
            Settings
          </div>
        </div>
        <div className="Settings-container">
          <h1>Profile Picture</h1>
          <div className="Settings-profilepic" onClick={this.onFileUploadClick}>
            {this.props.user && this.props.user.profilePicture && <img src={this.props.user.profilePicture + "?t=" + Number(Date.now())} ref={this.image}/>}
            <Icon icon="upload" className="Settings-uploadpfp"/>
          </div>
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe("user.currentUserData");

  return {
    user: Meteor.user()
  };
})(Settings);

