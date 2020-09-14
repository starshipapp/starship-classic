import React from "react";
import { Menu, Button, Popover, MenuItem, Intent, Dialog, Classes, AnchorButton } from "@blueprintjs/core";
import { Meteor } from "meteor/meteor";
import {ErrorToaster} from "../Toaster";
import {withTracker} from "meteor/react-meteor-data";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import Profile from "../profile/Profile";
import Recaptcha from "react-google-recaptcha";

import Planets from "../../api/planets";
import "./css/MainSidebar.css";

class MainSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSigningUp: false,
      usernameText: "",
      passwordText: "",
      passwordConfirmText: "",
      emailText: "",
      planetText: "",
      showProfile: false
    };

    this.recaptchaRef = React.createRef();

    this.toggleSignUp = this.toggleSignUp.bind(this);
    this.signUp = this.signUp.bind(this);
    this.signIn = this.signIn.bind(this);
    this.logout = this.logout.bind(this);
    this.createPlanet = this.createPlanet.bind(this);
    this.goToPlanet = this.goToPlanet.bind(this);
    this.showProfile = this.showProfile.bind(this);
    this.closeProfile = this.closeProfile.bind(this);
    this.setUsernameText = this.setUsernameText.bind(this);
    this.setPasswordText = this.setPasswordText.bind(this);
    this.setPasswordConfirmText = this.setPasswordConfirmText.bind(this);
    this.setEmailText = this.setEmailText.bind(this);
    this.setPlanetText = this.setPlanetText.bind(this);
    this.onClose = this.onClose.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
  }

  toggleSignUp() {
    this.setState({
      isSigningUp: !this.state.isSigningUp
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState;
  }

  signUp(e) {
    e.preventDefault();
    const recaptchaValue = this.recaptchaRef.current.getValue();

    if(recaptchaValue === "") { 
      ErrorToaster.show({message: "CAPTCHA failed.", icon:"error", intent:Intent.DANGER});
      return;
    }

    if(this.state.usernameText === "") {
      ErrorToaster.show({message: "Please enter a username.", icon:"error", intent:Intent.DANGER});
      return;
    }

    if(this.state.passwordText === "") {
      ErrorToaster.show({message: "Please enter a password.", icon:"error", intent:Intent.DANGER});
      return;
    }

    if(this.state.passwordText !== this.state.passwordConfirmText) {
      ErrorToaster.show({message: "Password text does not match!", icon:"error", intent:Intent.DANGER});
      return;
    }


    if(this.state.emailText === "") {
      ErrorToaster.show({message: "Please enter an email address.", icon:"error", intent:Intent.DANGER});
      return;
    }

    Meteor.call("users.insert", {
      username: this.state.usernameText,
      password: this.state.passwordText,
      email: this.state.emailText,
      profile: {},
      recaptcha: recaptchaValue
    }, (e) => {
      if(e) {
        ErrorToaster.show({message: e.message.substr(1).slice(0, -1) + ".", icon:"error", intent:Intent.DANGER});
      } else {
        ErrorToaster.show({message: "Account created! Check your email for a verification email. If you don't see it in 5 minutes, check your spam.", icon:"tick", intent:Intent.SUCCESS});
        this.setState({
          usernameText: "",
          passwordText: "",
          passwordConfirmText: "",
          emailText: "",
          isSigningUp: false
        });
      }
    });
  }

  sendEmail() {
    Meteor.call("users.resendemail", this.state.usernameText);
    ErrorToaster.show({message: "Email sent. If you don't see it in 5 minutes, check your spam.", icon:"tick", intent:Intent.SUCCESS});
  }

  signIn(e) {
    e.preventDefault();
    if(this.state.isSigningUp) {
      this.toggleSignUp();
    } else {
      if(this.state.usernameText === "") {
        ErrorToaster.show({message: "Please enter a username.", icon:"error", intent:Intent.DANGER});
        return;
      }

      if(this.state.passwordText === "") {
        ErrorToaster.show({message: "Please enter a password.", icon:"error", intent:Intent.DANGER});
        return;
      }

      Meteor.loginWithPassword(this.state.usernameText, this.state.passwordText, function(e) {
        if(e) {
          ErrorToaster.show({message: e.message.split(" [")[0] + ".", icon:"error", intent:Intent.DANGER, action:(e.error === "email-not-verified" ? {text: "Resend Email", onClick: this.sendEmail} : null)});
        } else {
          this.setState({
            usernameText: "",
            passwordText: ""
          });
        }
      }.bind(this));
    }
  }

  logout() {
    Meteor.logout();
  }

  createPlanet(e) {
    e.preventDefault();
    if(this.state.planetText === "") {
      ErrorToaster.show({message: "Please enter a name.", icon:"error", intent:Intent.DANGER});
      return;
    }
    
    Meteor.call("planets.insert", this.state.planetText, (error, value) => {
      if(error) {
        //we should do something with this eventually
      }

      if(value) {
        Meteor.call("planets.createhome", value, "page");
        FlowRouter.go("Planets.home", {_id: value});
      }
    });
    this.setState({
      planetText: ""
    });
  }

  goToPlanet(id) {
    FlowRouter.go("Planets.home", {_id: id});
  }

  setUsernameText(e) {
    this.setState({
      usernameText: e.target.value
    });
  }

  setPasswordText(e) {
    this.setState({
      passwordText: e.target.value
    });
  }

  setPasswordConfirmText(e) {
    this.setState({
      passwordConfirmText: e.target.value
    });
  }

  setEmailText(e) {
    this.setState({
      emailText: e.target.value
    });
  }

  setPlanetText(e) {
    this.setState({
      planetText: e.target.value
    });
  }
  
  showProfile() {
    this.setState({
      showProfile: true
    });
  }

  closeProfile() {
    this.setState({
      showProfile: false
    });
  }

  goToSettings() {
    FlowRouter.go("Settings");
  }

  onClose() {
    this.setState({
      isSigningUp: false
    });
  }

  render() {
    return (
      <div className="MainSidebar">
        <Dialog className="bp3-dark" title="Sign Up" onClose={this.onClose} isOpen={this.state.isSigningUp}>
          <div className={Classes.DIALOG_BODY}>
            <form className="MainSidebar-signup" onSubmit={this.isSigningUp ? this.signUp : this.signIn}>
              <input
                className="MainSidebar-signup-input bp3-input bp3-large"
                placeholder="Username"
                onChange={this.setUsernameText}
                value={this.state.usernameText}
              />
              <input
                className="MainSidebar-signup-input bp3-input bp3-large"
                placeholder="Password"
                type="password"
                onChange={this.setPasswordText}
                value={this.state.passwordText}
              />
              <input
                className="MainSidebar-signup-input bp3-input bp3-large"
                placeholder="Confirm Password"
                type="password"
                onChange={this.setPasswordConfirmText}
                value={this.state.passwordConfirmText}
              />
              <input
                className="MainSidebar-signup-input bp3-input bp3-large"
                placeholder="Email"
                onChange={this.setEmailText}
                value={this.state.emailText}
              />
              <Recaptcha
                ref={this.recaptchaRef}
                sitekey={Meteor.settings.public.recaptchaSite}
                theme="dark"
              />
              <input type="submit" style={{display: "none"}}/>
            </form>
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <AnchorButton text="Sign Up" onClick={this.signUp}/>
            </div>
          </div>
        </Dialog>
        <Profile isOpen={this.state.showProfile} userId={Meteor.userId()} onClose={this.closeProfile}/>
        <Menu className="MainSidebar-menu">
          <div className="MainSidebar-menu-logo" onClick={() => {FlowRouter.go("Home", {});}}>starship<span className="MainSidebar-version">alpha</span></div>
          {Meteor.userId() && <div>
            <Menu.Divider title="MY PLANETS"/>
            {this.props.memberPlanets.map((value) => (<Menu.Item key={value._id} icon="control" onClick={() => this.goToPlanet(value._id)} text={value.name}/>))}
            <Popover position="right" className="MainSidebar-menu-popover">
              <Menu.Item icon="plus" onClick={this.addPlanet} text="New Planet"/>
              <form className="MainSidebar-menu-form" onSubmit={this.createPlanet}>
                <input
                  className="MainSidebar-menu-input bp3-input"
                  placeholder="Name"
                  onChange={this.setPlanetText}
                  value={this.state.planetText}
                />
                <Button className="MainSidebar-menu-button" onClick={this.createPlanet}>Create</Button>
              </form>
            </Popover>  
          </div>}
          {Meteor.userId() && this.props.followingPlanets && this.props.followingPlanets.length !== 0 && <Menu.Divider title="FOLLOWING"/>}
          {Meteor.userId() && this.props.followingPlanets && this.props.followingPlanets.map((value) => (<Menu.Item key={value._id} icon="control" onClick={() => this.goToPlanet(value._id)} text={value.name}/>))}
          <Menu.Divider/>
          {Meteor.userId() ? <div>
            {Meteor.user() && <MenuItem text={Meteor.user().username} onClick={this.showProfile} icon="person"/>}
            {Meteor.user() && <MenuItem text="Settings" onClick={this.goToSettings} icon="settings"/>}
            <Menu.Item icon="log-out" text="Logout" onClick={this.logout}/>
          </div> : <div>
            <Popover position="right" className="MainSidebar-menu-popover">
              <Menu.Item className="MainSidebar-menu-override" icon="log-in" text="Login"/>
              <form className="MainSidebar-menu-form" onSubmit={this.isSigningUp ? this.signUp : this.signIn}>
                <input
                  className="MainSidebar-menu-input bp3-input"
                  placeholder="Username"
                  onChange={this.setUsernameText}
                  value={this.state.usernameText}
                />
                <input
                  className="MainSidebar-menu-input bp3-input"
                  placeholder="Password"
                  type="password"
                  onChange={this.setPasswordText}
                  value={this.state.passwordText}
                />
                <input type="submit" style={{display: "none"}}/>
                <Button className="MainSidebar-menu-button" onClick={this.signIn}>Sign In</Button>
                <Button className="MainSidebar-menu-button" onClick={this.toggleSignUp}>Sign Up</Button>
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
  Meteor.subscribe("user.currentUserData");

  let tracked = {
    memberPlanets: Planets.find({$or: [
      {members: Meteor.userId()},
      {owner: Meteor.userId()}
    ]}, {sort: {name: 1}}).fetch(),
    currentUser: Meteor.user()
  };

  if(Meteor.user() && Meteor.user().following) {
    tracked.followingPlanets = Planets.find({_id: {$in: Meteor.user().following}}, {sort: {name: 1}}).fetch();
  }

  return tracked;
})(MainSidebar);