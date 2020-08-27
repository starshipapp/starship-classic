import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import {Classes, ButtonGroup, Button, Divider, Callout} from "@blueprintjs/core";
import "./css/ForumComponent";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import ForumEditor from "./forum/ForumEditor";
import ForumThread from "./forum/ForumThread";
import ForumItemContainer from "./forum/ForumItemContainer";
import ForumPosts from "../../../api/components/forum/forumpost";

class ForumComponent extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      creatingNewThread: false,
      postCount: 25
    };

    this.startNewThread = this.startNewThread.bind(this);
    this.dismissThread = this.dismissThread.bind(this);
    this.goHome = this.goHome.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  startNewThread() {
    this.setState({
      creatingNewThread: true
    });
  }

  dismissThread() {
    this.setState({
      creatingNewThread: false
    });
  }

  goHome() {
    FlowRouter.go("Planets.component", {_id: this.props.planet._id, _cid: this.props.id});
  }

  loadMore() {
    this.setState({
      postCount: this.state.postCount + 25
    });
  }

  render() {
    return (
      <div className="bp3-dark ForumComponent">
        <div className="ForumComponent-flex">
          <table className={Classes.HTML_TABLE + " ForumComponent-container " + ((!this.props.subId && !this.state.creatingNewThread) && Classes.INTERACTIVE)}>
            <thead>
              <tr>
                <th className="ForumComponent-header">
                  <Callout intent="warning" title="Work In Progress">
                    The Forum component is not finished, and is missing many important features that will be added in future updates.<br/>
                    These include reactions, polls, post tags, and a better text editor.
                  </Callout>
                  <Divider/>
                  {this.props.subId ? <ButtonGroup minimal={true} className="ForumComponent-buttons">
                    <Button icon="arrow-left" text="Back" onClick={this.goHome}/>
                  </ButtonGroup>: <ButtonGroup minimal={true} className="ForumComponent-buttons">
                    {/*<Button icon="sort" text="Sort By"/>
                      <Button icon="tag" text="Tags"/>
                    <Divider/>*/}
                    <Button icon="plus" text="New Thread" onClick={this.startNewThread}/>
                  </ButtonGroup>}
                </th>
              </tr>
            </thead>
            {this.state.creatingNewThread || this.props.subId ? <tbody>
              <tr>
                <td>
                  {this.props.subId ? <ForumThread planet={this.props.planet} postId={this.props.subId}/> : <ForumEditor onClose={this.dismissThread} forumId={this.props.id}/>}
                </td>
              </tr>
            </tbody> : <ForumItemContainer planet={this.props.planet} id={this.props.id} postCount={this.state.postCount} loadMore={this.loadMore}/>}
          </table>
        </div>
      </div>
    );
  }
}

export default withTracker((props) => {
  return {
    postCount: ForumPosts.find({componentId: props.id}).count(),
    currentUser: Meteor.user()
  };
})(ForumComponent);