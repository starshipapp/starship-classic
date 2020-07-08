import React from "react";
import { NonIdealState, Label, Classes, Button, Intent } from "@blueprintjs/core";
import {withTracker} from "meteor/react-meteor-data";
import "./css/AdminGeneral.css";
import {checkWritePermission} from "../../../util/checkPermissions";
import { INTENT_DANGER } from "@blueprintjs/core/lib/esm/common/classes";

class AdminGeneral extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nameTextboxContents: this.props.planet.name
    };

    this.save = this.save.bind(this);
    this.updateNameTextbox = this.updateNameTextbox.bind(this);
    this.setPrivate = this.setPrivate.bind(this);
  }

  updateNameTextbox(e) {
    this.setState({
      nameTextboxContents: e.target.value
    });
  }

  save() {
    if(this.state.nameTextboxContents !== this.props.planet.name) {
      Meteor.call("planets.updatename", this.props.planet._id, this.state.nameTextboxContents);
    }
  }

  setPrivate() {
    Meteor.call("planets.toggleprivate", this.props.planet._id)
  }

  render() {
    return (
      <div className="Admin bp3-dark">
        {checkWritePermission(Meteor.userId(), this.props.planet) ? <div>
          <h2>General</h2>
          <div className="AdminGeneral-container">
            <Label>
              Name
              <input className={Classes.INPUT} value={this.state.nameTextboxContents} onChange={this.updateNameTextbox} placeholder="Placeholder text" />
            </Label>
            <Button text={this.props.planet.private ? "Make this planet public" : "Make this planet private"} onClick={this.setPrivate} intent={Intent.DANGER} className="AdminGeneral-margin-button"/>
            <Button text="Save" onClick={this.save}/>
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
})(AdminGeneral);