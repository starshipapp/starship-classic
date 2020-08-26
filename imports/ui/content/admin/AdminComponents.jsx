import React from "react";
import { NonIdealState, Icon, Button, Classes, Popover } from "@blueprintjs/core";
import {ComponentDataTypes} from "../componentComponents/ComponentComponentsIndexer";
import {withTracker} from "meteor/react-meteor-data";
import "./css/AdminComponents.css";
import {checkWritePermission} from "../../../util/checkPermissions";

class AdminComponents extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      renameId: "",
      renameTextbox: "",
      showingSettings: ""
    };

    this.deleteComponent = this.deleteComponent.bind(this);
    this.updateTextbox = this.updateTextbox.bind(this);
    this.renameComponent = this.renameComponent.bind(this);
    this.startRename = this.startRename.bind(this);
    this.dismissPopover = this.dismissPopover.bind(this);
  }

  deleteComponent(component, type) {
    if(type === "files") {
      Meteor.call("aws.deletefilecomponent", component);
    }
    Meteor.call("planets.removecomponent", this.props.planet._id, component);
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState;
  }

  startRename(name, id) {
    this.setState({
      renameTextbox: name,
      renameId: id
    });
  }

  updateTextbox(e) {
    this.setState({
      renameTextbox: e.target.value
    });
  }

  renameComponent(id) {
    Meteor.call("planets.renamecomponent", this.props.planet._id, id, this.state.renameTextbox);
    this.dismissPopover();
  }

  dismissPopover() {
    this.setState({
      renameId: ""
    });
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
                    <td className="AdminComponents-table-name"><Icon className="AdminComponents-table-name-icon" icon={ComponentDataTypes[value.type].icon}/> {value.name} <Popover isOpen={this.state.renameId === value.componentId} onClose={this.dismissPopover}>
                      <Icon className="AdminComponents-table-name-icon" icon="edit" onClick={() => this.startRename(value.name, value.componentId)}/>
                      <div className="MainSidebar-menu-form">
                        <input className={Classes.INPUT + " MainSidebar-menu-input"} value={this.state.renameTextbox} onChange={this.updateTextbox}/>
                        <Button text="Create" className="MainSidebar-menu-button" onClick={() => this.renameComponent(value.componentId)}/>
                      </div>
                    </Popover></td>
                    <td className="AdminComponents-table-action">
                      <Button intent="danger" className="AdminComponents-action-button" small={true} icon="trash" onClick={() => {this.deleteComponent(value.componentId, value.type);}}/>
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