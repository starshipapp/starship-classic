import React from 'react';
import { NonIdealState, Menu, Icon, Button } from "@blueprintjs/core";
import {ComponentDataTypes} from '../componentComponents/ComponentComponentsIndexer'
import {withTracker} from 'meteor/react-meteor-data';
import './css/AdminComponents.css'

class AdminComponents extends React.Component {
  render() {
    return (
      <div className="Admin bp3-dark">
        {Meteor.userId() === this.props.planet.owner ? <div>
          <h2>Components</h2>
          <div className="AdminComponents-container">
          <table className="AdminComponents-table">
            <tbody>
              {this.props.planet.components.map((value) => (
                <tr>
                  <td className="AdminComponents-table-name"><Icon className="AdminComponents-table-name-icon" icon={ComponentDataTypes[value.type].icon}/> {value.name}</td>
                  <td className="AdminComponents-table-action"><Button intent="danger" small={true} icon="trash"/></td>
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

export default withTracker((props) => {
  return {
    currentUser: Meteor.user()
  };
})(AdminComponents);