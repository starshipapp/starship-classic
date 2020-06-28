import React from 'react';
import {Button} from "@blueprintjs/core";
import {withTracker} from 'meteor/react-meteor-data';
import './css/PageComponent';
import "easymde/dist/easymde.min.css";
import {WikiPages, Wikis} from "../../../api/collectionsStandalone";

class WikiComponent extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="bp3-dark WikiComponent">
        Empty
      </div>
    );
  }
}

export default withTracker((props) => {
  Meteor.subscribe("wikipages.findpages", props.id);
  Meteor.subscribe("wikis.wiki", props.id);

  return {
    wikiPages: WikiPages.find({wikiId: props.id}).fetch(),
    wiki: Wikis.find({_id: props.id}).fetch(),
    currentUser: Meteor.user()
  };
})(WikiComponent);