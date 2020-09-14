import React from "react";
import "../settings/css/Settings.css";

class Terms extends React.Component {
  render() {
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
            Privacy Policy
          </div>
        </div>
        <div className="Settings-container">
          <ul>
            <li>We store your email and IP address. We use it to identify you. We don't give it away.</li>
            <li>We won't give away your password, either.</li>
            <li>We use cookies (sorry).</li>
            <li>We don't sell your info.</li>
            <li>We may log some stuff, and that may contain information like your username and email.</li>
            <li>Don't use the site in the EU. If you do, and come to us with some GDPR request, too bad. We told you not to use it.</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Terms;