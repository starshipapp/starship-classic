import React from "react";
import { NonIdealState } from "@blueprintjs/core";
import {withTracker} from "meteor/react-meteor-data";
import "./css/ForumAdmin.css";
import {checkWritePermission} from "../../../../util/checkPermissions";

class ForumAdmin extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Admin bp3-dark">
        {checkWritePermission(Meteor.userId(), this.props.planet) ? <div>
          <h2>General</h2>
          <div className="AdminGeneral-container">
            <h3>Tags</h3>
          </div>
        </div> : <div>
          <NonIdealState
            icon="error"
            title="403"
            description="You aren't the admin of this planet."
          />
        </div>}
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    currentUser: Meteor.user()
  };
})(ForumAdmin);