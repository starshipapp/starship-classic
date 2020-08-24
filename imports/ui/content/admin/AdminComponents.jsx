import React from "react";
import { NonIdealState, Icon, Button } from "@blueprintjs/core";
import {ComponentDataTypes} from "../componentComponents/ComponentComponentsIndexer";
import {withTracker} from "meteor/react-meteor-data";
import "./css/AdminComponents.css";
import {checkWritePermission} from "../../../util/checkPermissions";

class AdminComponents extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showingSettings: ""
    };

    this.deleteComponent = this.deleteComponent.bind(this);
  }

  deleteComponent(component) {
    Meteor.call("planets.removecomponent", this.props.planet._id, component);
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState;
  }

  render() {
    return (
      <div className="Admin bp3-dark">
        {checkWritePermission(Meteor.userId(), this.props.planet) ? <div>
          <h2>Components</h2>
          <div className="AdminComponents-container">
            <table className="AdminComponents-table">
              <tbody>
                {this.props.planet.components.map((value) => (
                  <tr key={value.componentId}>
                    <td className="AdminComponents-table-name"><Icon className="AdminComponents-table-name-icon" icon={ComponentDataTypes[value.type].icon}/> {value.name}</td>
                    <td className="AdminComponents-table-action">
                      <Button intent="danger" className="AdminComponents-action-button" small={true} icon="trash" onClick={() => {this.deleteComponent(value.componentId);}}/>
                      {ComponentDataTypes[value.type].settingsComponent && <Button small={true} className="AdminComponents-action-button" icon="settings"/>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
})(AdminComponents);