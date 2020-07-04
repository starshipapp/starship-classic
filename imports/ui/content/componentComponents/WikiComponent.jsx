import React from 'react';
import ReactDOM from 'react-dom';
import {Button, Menu, NonIdealState, Popover} from "@blueprintjs/core";
import {withTracker} from 'meteor/react-meteor-data';
import './css/WikiComponent';
import "easymde/dist/easymde.min.css";
import {WikiPages, Wikis} from "../../../api/collectionsStandalone";
import {FlowRouter} from 'meteor/ostrio:flow-router-extra';
import WikiPageComponent from './WikiPageComponent';

class WikiComponent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      pageId: null
    }

    this.createNewFirstPage = this.createNewFirstPage.bind(this);
    this.createNewPage = this.createNewPage.bind(this);
  }

  createNewFirstPage(e) {
    if((e.keyCode && e.keyCode === 13) || !e.keyCode) {
      e.preventDefault();

      const nameText = ReactDOM.findDOMNode(this.refs.noPageTextbox).value.trim();
      Meteor.call("wikipages.insert", this.props.id, "This is a Page. Click the Edit icon in the top right corner to get started.", nameText)
    }
  }

  createNewPage(e) {
    if((e.keyCode && e.keyCode === 13) || !e.keyCode) {
      e.preventDefault();

      const nameText = ReactDOM.findDOMNode(this.refs.pageTextbox).value.trim();
      Meteor.call("wikipages.insert", this.props.id, "This is a Page. Click the Edit icon in the top right corner to get started.", nameText)
    }
  }

  gotoSubComponent(componentId) {
    FlowRouter.go('Planets.component.subid', {_id: this.props.planet._id, _cid: this.props.id, _sid: componentId})
  }

  render() {
    return (
      <div className="bp3-dark WikiComponent">
        <h1>{this.props.name}</h1>
        {this.props.wikiPages.length === 0 && this.props.wiki && <div>
          <NonIdealState
            icon="error"
            title="No pages!"
            description={"This page group contains no pages!" + (this.props.planet.owner === Meteor.userId() && "Create a page to get started.")}
            action={this.props.planet.owner === Meteor.userId() && <Popover>
              <Button>Create new page</Button>
              <div className="MainSidebar-menu-form">
                <input className="MainSidebar-menu-input bp3-input" ref="noPageTextbox" placeholder="Page Name" onKeyDown={this.createNewFirstPage}/>
                <Button className="MainSidebar-menu-button" onClick={this.createNewFirstPage}>Create Page</Button>
              </div>
            </Popover>}
          />
        </div>}
        {this.props.wikiPages.length !== 0 && <div className="WikiComponent-container">
          <div className="WikiComponent-sidebar">
            <Menu>
              {this.props.wikiPages.map((value) => (<Menu.Item icon="document" text={value.name} onClick={() => {this.gotoSubComponent(value._id)}}/>))}
              {this.props.planet.owner === Meteor.userId() && <Popover>
                <Menu.Item icon="plus" text="New Page" onClick={this.createNewPage}/>
                <div className="MainSidebar-menu-form">
                  <input className="MainSidebar-menu-input bp3-input" ref="pageTextbox" placeholder="Page Name" onKeyDown={this.createNewPage}/>
                  <Button className="MainSidebar-menu-button" onClick={this.createNewPage}>Create Page</Button>
                </div>
              </Popover>}
            </Menu>
          </div>
          <div className="WikiComponent-main">
            {!this.props.subId && <NonIdealState
              icon="applications"
              title="No page selected"
              description="Select a page from the right to view it."
            />}
            {this.props.subId && <WikiPageComponent id={this.props.subId} planet={this.props.planet}/>}
          </div>
        </div>}
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