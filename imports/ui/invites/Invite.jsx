import React from "react";
import { Button } from "@blueprintjs/core";
import "./css/Invite.css";

class Invite extends React.Component {
  render() {
    return (
      <div className="Invite">
        <div className="Invite-title">
          You've been invited to become a member of
        </div>
        <div className="Invite-name">
          Test
        </div>
        <div className="Invite-user">
          by william341
        </div>
        <Button className="Invite-button" text="Join"/>
      </div>
    );
  }
}

export default Invite;