import {FlowRouter} from 'meteor/ostrio:flow-router-extra';
import ReactDOM from 'react-dom'
import React from 'react';
import App from '/imports/ui/App';
import ContentSpace from '../imports/ui/content/ContentSpace';
import Home from '../imports/ui/content/Home';

FlowRouter.route('/planet/:_id', {
  name: 'Planets.home',
  action(params, queryParams) {
    ReactDOM.render(<App component={<ContentSpace planetId={params._id} home={true}/>}/>, document.getElementById("react-target"))
  }
})

FlowRouter.route('/planet/:_id/:_cid', {
  name: 'Planets.component',
  action(params, queryParams) {
    ReactDOM.render(<App component={<ContentSpace planetId={params._id} home={false} componentId={params._cid}/>}/>, document.getElementById("react-target"))
  }
})

FlowRouter.route('/', {
  name: 'Home',
  action(params, queryParams) {
    ReactDOM.render(<App component={<Home/>}/>, document.getElementById("react-target"))
  }
})