import React from "react";
import "../settings/css/Settings.css";

class Rules extends React.Component {
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
            Rules
          </div>
        </div>
        <div className="Settings-container">
          <ul>
            <li>Don't harrass people.</li>
            <li>Don't upload content you don't have the rights to.</li>
            <li>Don't use derogatory language.</li>
            <li>Don't upload NSFW or disturbing content.</li>
            <li>Don't evade bans. This includes making alts to evade bans.</li>
            <li>Don't upload harmful content, including viruses and other malware.</li> 
          </ul>
        </div>
      </div>
    );
  }
}

export default Rules;