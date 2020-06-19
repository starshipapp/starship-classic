import React from 'react';
import { Navbar, Button, Alignment, NonIdealState } from "@blueprintjs/core";
import './css/ContentSpace.css'
import {withTracker} from 'meteor/react-meteor-data';
import Planets from '../../api/planets';
import {FindComponentComponent} from './componentComponents/ComponentComponentsIndexer'

class ContentSpace extends React.Component {
  constructor(props) {
    super(props);

    this.createHome = this.createHome.bind(this);
  }

  createHome() {
    Meteor.call("planets.createhome", this.props.planetId, "page")
  }

  render() {
    return (
      <div className="ContentSpace bp3-dark">
        <div className={"ContentSpace-header" + (this.props.planet[0] ? "" : " bp3-skeleton")}>{this.props.planet[0] && this.props.planet[0].name}</div>
        <Navbar className="ContentSpace-navbar">
          <div className="ContentSpace-navbar-content">
            <Navbar.Group align={Alignment.LEFT}>
              <Button className="bp3-minimal" outlined="true" icon="home" text="Home"/>
              <Button className="bp3-minimal" icon="document" text="Files" />
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
              <input className="bp3-input" type="text" placeholder="Search..." />
            </Navbar.Group>
          </div>
        </Navbar>
        {this.props.planet[0] && !this.props.planet[0].homeComponent ? <NonIdealState
          icon="error"
          title="No home component!"
          description="This planet is missing a home component, and so there is nothing to render. If you are the owner of this planet, clicking the below button should resolve this issue."
          action={<Button onClick={this.createHome}>Create new page</Button>}
        />: <div className="ContentSpace-contentcontainer">
          {this.props.planet[0] && FindComponentComponent(this.props.planet[0].homeComponent.componentId, this.props.planet[0].homeComponent.type, this.props.planet[0])}
        </div>}
        {!this.props.planet[0] && <div className="bp3-skeleton ContentSpace-contentcontainer" style={{height: "100%"}}/>}
        {this.props.planet[0] && !this.props.planet[0].createdAt && <div className="bp3-skeleton ContentSpace-contentcontainer" style={{height: "100%"}}/>}
      </div>
    );
  }
}

export default withTracker((props) => {
  Meteor.subscribe("planets.planet", props.planetId);

  return {
    planet: Planets.find({_id: props.planetId}).fetch(),
    currentUser: Meteor.user()
  };
})(ContentSpace);
