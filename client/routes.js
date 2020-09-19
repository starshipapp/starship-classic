import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import ReactDOM from "react-dom";
import React from "react";
import App from "/imports/ui/App";
import ContentSpace from "../imports/ui/content/ContentSpace";
import Home from "../imports/ui/content/Home";
import Invite from "../imports/ui/invites/Invite";
import Settings from "../imports/ui/settings/Settings";
import Terms from "../imports/ui/legal/Terms";
import Rules from "../imports/ui/legal/Rules";
import Privacy from "../imports/ui/legal/Privacy";
import GAdmin from "../imports/ui/admin/GAdmin";
import GAdminHome from "../imports/ui/admin/GAdminHome";

FlowRouter.route("/planet/:_id", {
  name: "Planets.home",
  action(params) {
    ReactDOM.render(<App component={<ContentSpace planetId={params._id} home={true}/>}/>, document.getElementById("react-target"));
  }
});

FlowRouter.route("/planet/admin/:_id", {
  name: "Planets.admin",
  action(params) {
    ReactDOM.render(<App component={<ContentSpace planetId={params._id} admin={true}/>}/>, document.getElementById("react-target"));
  }
});

FlowRouter.route("/planet/:_id/:_cid", {
  name: "Planets.component",
  action(params) {
    ReactDOM.render(<App component={<ContentSpace planetId={params._id} home={false} componentId={params._cid}/>}/>, document.getElementById("react-target"));
  }
});

FlowRouter.route("/planet/:_id/:_cid/:_sid", {
  name: "Planets.component.subid",
  action(params) {
    ReactDOM.render(<App component={<ContentSpace planetId={params._id} home={false} componentId={params._cid} subId={params._sid}/>}/>, document.getElementById("react-target"));
  }
});

FlowRouter.route("/invite/:_id", {
  name: "Invites.invite",
  action(params) {
    ReactDOM.render(<App component={<Invite inviteId={params._id}/>}/>, document.getElementById("react-target"));
  }
});

FlowRouter.route("/", {
  name: "Home",
  action() {
    ReactDOM.render(<App component={<Home/>}/>, document.getElementById("react-target"));
  }
});

FlowRouter.route("/settings", {
  name: "Settings",
  action() {
    ReactDOM.render(<App component={<Settings/>}/>, document.getElementById("react-target"));
  }
});

FlowRouter.route("/terms", {
  name: "Terms",
  action() {
    ReactDOM.render(<App component={<Terms/>}/>, document.getElementById("react-target"));
  }
});

FlowRouter.route("/rules", {
  name: "Rules",
  action() {
    ReactDOM.render(<App component={<Rules/>}/>, document.getElementById("react-target"));
  }
});

FlowRouter.route("/privacy", {
  name: "Privacy",
  action() {
    ReactDOM.render(<App component={<Privacy/>}/>, document.getElementById("react-target"));
  }
});

FlowRouter.route("/gadmin", {
  name: "GAdmin",
  action() {
    ReactDOM.render(<GAdmin component={<GAdminHome/>}/>, document.getElementById("react-target"));
  }
});