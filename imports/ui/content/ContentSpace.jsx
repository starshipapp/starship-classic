import React from 'react';
import ReactDOM from 'react-dom';
import { Navbar, Button, Alignment, NonIdealState, Popover, Menu, MenuItem } from "@blueprintjs/core";
import './css/ContentSpace.css'
import {withTracker} from 'meteor/react-meteor-data';
import Planets from '../../api/planets';
import {FlowRouter} from 'meteor/ostrio:flow-router-extra';
import {FindComponentComponent, ComponentDataTypes} from './componentComponents/ComponentComponentsIndexer'
import InfoStrip from './InfoStrip';

class ContentSpace extends React.Component {
  constructor(props) {
    super(props);

    this.createHome = this.createHome.bind(this);
    this.createComponent = this.createComponent.bind(this);
    this.goHome = this.goHome.bind(this);
    this.gotoComponent = this.gotoComponent.bind(this);
  }

  createHome() {
    Meteor.call("planets.createhome", this.props.planetId, "page")
  }

  createComponent(type) {
    const name = ReactDOM.findDOMNode(this.refs.pageNameInput).value.trim();
    Meteor.call("planets.addcomponent", name, this.props.planetId, type)
  }

  goHome() {
    FlowRouter.go('Planets.home', {_id: this.props.planetId})
  }

  gotoComponent(componentId) {
    FlowRouter.go('Planets.component', {_id: this.props.planetId, _cid: componentId})
  }

  render() {
    let currentComponent = <NonIdealState
      icon="error"
      title="404"
      description="We couldn't find that page in this planet."
    />

    if(this.props.componentId && this.props.planet[0] && this.props.planet[0].components) {
      let filteredComponents = this.props.planet[0].components.filter(value => value.componentId === this.props.componentId);
      if(filteredComponents.length === 1) {
        currentComponent = FindComponentComponent(this.props.componentId, filteredComponents[0].type, this.props.planet[0])
      }
    }

    if(this.props.home) {
      if(this.props.planet[0]) {
        if(this.props.planet[0].homeComponent) {
          currentComponent = FindComponentComponent(this.props.planet[0].homeComponent.componentId, this.props.planet[0].homeComponent.type, this.props.planet[0])
        } else {
          if(this.props.planet[0].createdAt) {
            currentComponent = <NonIdealState
              icon="error"
              title="No home component!"
              description="This planet is missing a home component, and so there is nothing to render. If you are the owner of this planet, clicking the below button should resolve this issue."
              action={<Button onClick={this.createHome}>Create new page</Button>}
            />
          }
        }
      }
    }

    console.log(this.props.planet[0])
    return (
      <div className="ContentSpace bp3-dark">
        <div className={"ContentSpace-header" + (this.props.planet[0] ? "" : " bp3-skeleton")}>
          {this.props.planet[0] && this.props.planet[0].name}
          {this.props.planet[0] && this.props.planet[0].createdAt ? <InfoStrip planet={this.props.planet[0]}/> : <div className="ContentSpace-infostrip-placeholder bp3-skeleton"/>}
        </div>
        <Navbar className="ContentSpace-navbar">
          <div className="ContentSpace-navbar-content">
            <Navbar.Group align={Alignment.LEFT}>
              <Button className="bp3-minimal" outlined={this.props.home} icon="home" text="Home" onClick={this.goHome}/>
              {this.props.planet[0] && this.props.planet[0].components && this.props.planet[0].components.map((value) => (<Button
                className="bp3-minimal"
                icon={ComponentDataTypes[value.type].icon}
                text={value.name}
                outlined={this.props.componentId && this.props.componentId == value.componentId}
                onClick = {() => {this.gotoComponent(value.componentId)}}
              />))}
              <Popover>
                <Button className="bp3-minimal" icon="document" icon="plus"/>
                <div className="ContentSpace-navbar-add-content">
                  <input ref="pageNameInput" className="bp3-input"/>
                  <Menu>
                    {Object.values(ComponentDataTypes).map((value) => (<MenuItem text={"Create new " + value.friendlyName} icon={value.icon} onClick={() => this.createComponent(value.name)}/>))}
                  </Menu>
                </div>
              </Popover>
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
              <input className="bp3-input" type="text" placeholder="Search..." />
            </Navbar.Group>
          </div>
        </Navbar>
        {!this.props.planet[0] && <div className="bp3-skeleton ContentSpace-contentcontainer" style={{height: "100%"}}/>}
        {this.props.planet[0] && !this.props.planet[0].createdAt && <div className="bp3-skeleton ContentSpace-contentcontainer" style={{height: "100%"}}/>}
        {this.props.planet[0] && this.props.planet[0].components && <div className="ContentSpace-contentcontainer">
          {currentComponent}
        </div>}
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
