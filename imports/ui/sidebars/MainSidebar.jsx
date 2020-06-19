import React from 'react';
import ReactDOM from 'react-dom';
import { Menu, Button, Popover, MenuItem } from "@blueprintjs/core";
import { Meteor } from 'meteor/meteor';
import {ErrorToaster} from '../Toaster'
import {withTracker} from 'meteor/react-meteor-data';
import {FlowRouter} from 'meteor/ostrio:flow-router-extra';

import Planets from '../../api/planets'
import './css/MainSidebar.css'

class MainSidebar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isSigningUp: false
    }

    this.toggleSignUp = this.toggleSignUp.bind(this);
    this.signUp = this.signUp.bind(this);
    this.signIn = this.signIn.bind(this);
    this.logout = this.logout.bind(this);
    this.createPlanet = this.createPlanet.bind(this);
    this.goToPlanet = this.goToPlanet.bind(this);
  }

  toggleSignUp() {
    this.setState({
      isSigningUp: !this.state.isSigningUp
    })
  }

  signUp(e) {
    e.preventDefault();
    if(!this.state.isSigningUp) {
      this.toggleSignUp()
    } else {
      const usernameText = ReactDOM.findDOMNode(this.refs.usernameInput).value.trim();
      const passwordText = ReactDOM.findDOMNode(this.refs.passwordInput).value.trim();
      const confirmPasswordText = ReactDOM.findDOMNode(this.refs.confirmPasswordInput).value.trim();
      const emailText = ReactDOM.findDOMNode(this.refs.emailInput).value.trim();

      if(usernameText === "") {
        ErrorToaster.show({message: "Please enter a username."})
        return;
      }

      if(passwordText === "") {
        ErrorToaster.show({message: "Please enter a password."})
        return;
      }

      if(passwordText !== confirmPasswordText) {
        ErrorToaster.show({message: "Password text does not match!"})
        return;
      }


      if(emailText == "") {
        ErrorToaster.show({message: "Please enter an email address."})
        return;
      }

      Meteor.call('users.insert', {
        username: usernameText,
        password: passwordText,
        email: emailText,
        profile: {}
      })
      
      this.toggleSignUp();
    }
  }

  signIn(e) {
    e.preventDefault();
    if(this.state.isSigningUp) {
      this.toggleSignUp()
    } else {
      const usernameText = ReactDOM.findDOMNode(this.refs.usernameInput).value.trim();
      const passwordText = ReactDOM.findDOMNode(this.refs.passwordInput).value.trim();

      if(usernameText === "") {
        ErrorToaster.show({message: "Please enter a username."})
        return;
      }

      if(passwordText === "") {
        ErrorToaster.show({message: "Please enter a password."})
        return;
      }

      Meteor.loginWithPassword(usernameText, passwordText, function(e) {
        if(e) {
          console.log(e);
        }
      })
    }
  }

  logout() {
    Meteor.logout();
  }

  createPlanet(e) {
    e.preventDefault();
    const planetText = ReactDOM.findDOMNode(this.refs.planetNameInput).value.trim();

    if(planetText === "") {
      ErrorToaster.show({message: "Please enter a name."})
      return;
    }
    
    Meteor.call('planets.insert', planetText)
  }

  goToPlanet(id) {
    FlowRouter.go('Planets.home', {_id: id})
  }

  render() {
    return (
      <div className="MainSidebar">
        <Menu className="MainSidebar-menu">
          <div className="MainSidebar-menu-logo" onClick={() => {FlowRouter.go('Home', {})}}>starship<span className="MainSidebar-version">alpha</span></div>
          {Meteor.userId() && <div>
            <Menu.Divider title="MY PLANETS"/>
            {this.props.memberPlanets.map((value) => (<Menu.Item key={value._id} icon="control" onClick={() => this.goToPlanet(value._id)} text={value.name}/>))}
            <Popover position="right" className="MainSidebar-menu-popover">
              <Menu.Item icon="plus" onClick={this.addPlanet} text="New Planet"/>
              <form className="MainSidebar-menu-form" onSubmit={this.createPlanet}>
                <input
                  className="MainSidebar-menu-input bp3-input"
                  placeholder="Name"
                  ref="planetNameInput"
                />
                <Button className="MainSidebar-menu-button" onClick={this.createPlanet}>Create</Button>
              </form>
            </Popover>  
          </div>}
          {Meteor.userId() && this.props.followingPlanets.length !== 0 && <Menu.Divider title="FOLLOWING"/>}
          {Meteor.userId() && this.props.followingPlanets.map((value) => (<Menu.Item key={value._id} icon="control" onClick={() => this.goToPlanet(value._id)} text={value.name}/>))}
          <Menu.Divider/>
          {Meteor.userId() ? <div>
            {Meteor.user() && <MenuItem disabled={true} text={Meteor.user().username}/>}
            <Menu.Item text="Settings" icon="cog">
              <Menu.Item icon="tick" text="Save on edit" />
              <Menu.Item icon="blank" text="Compile on edit" />
            </Menu.Item>
            <Menu.Item icon="log-out" text="Logout" onClick={this.logout}/>
          </div> : <div>
            <Popover position="right" className="MainSidebar-menu-popover">
              <Menu.Item className="MainSidebar-menu-override" icon="log-in" text="Login"/>
              <form className="MainSidebar-menu-form" onSubmit={this.isSigningUp ? this.signUp : this.signIn}>
                <input
                  className="MainSidebar-menu-input bp3-input"
                  placeholder="Username"
                  ref="usernameInput"
                />
                <input
                  className="MainSidebar-menu-input bp3-input"
                  placeholder="Password"
                  type="password"
                  ref="passwordInput"
                />
                {this.state.isSigningUp && <div>
                  <input
                    className="MainSidebar-menu-input bp3-input"
                    placeholder="Confirm Password"
                    type="password"
                    ref="confirmPasswordInput"
                  />
                  <input
                    className="MainSidebar-menu-input bp3-input"
                    placeholder="Email"
                    ref="emailInput"
                  />
                </div>}
                <input type="submit" style={{display: "none"}}/>
                <Button className="MainSidebar-menu-button" onClick={this.signIn}>Sign In</Button>
                <Button className="MainSidebar-menu-button" onClick={this.signUp}>Sign Up</Button>
              </form>
            </Popover>
          </div>}
        </Menu>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe("planets.sidebar.memberOf");
  Meteor.subscribe("planets.sidebar.following");

  return {
    memberPlanets: Planets.find({owner: Meteor.userId()}, {sort: {createdAt: -1}}).fetch(),
    followingPlanets: Planets.find({followers: Meteor.userId()}, {sort: {createdAt: -1}}).fetch(),
    currentUser: Meteor.user()
  };
})(MainSidebar);