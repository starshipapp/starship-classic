import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import {Classes, ButtonGroup, Button, Divider, Callout, Popover, Menu, MenuItem, MenuDivider} from "@blueprintjs/core";
import "./css/ForumComponent";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import ForumEditor from "./forum/ForumEditor";
import ForumThread from "./forum/ForumThread";
import ForumItemContainer from "./forum/ForumItemContainer";
import ForumPosts from "../../../api/components/forum/forumpost";
import Forum from "../../../api/components/forum/forum";
import { checkWritePermission } from "../../../util/checkPermissions";

class ForumComponent extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      creatingNewThread: false,
      postCount: 25,
      newTagTextbox: "",
      activeTag: null,
      activeSort: "recentlyUpdated"
    };

    this.startNewThread = this.startNewThread.bind(this);
    this.dismissThread = this.dismissThread.bind(this);
    this.goHome = this.goHome.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.updateTextbox = this.updateTextbox.bind(this);
    this.createTag = this.createTag.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.setActiveTag = this.setActiveTag.bind(this);
    this.setActiveSort = this.setActiveSort.bind(this);
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

  updateTextbox(e) {
    this.setState({
      newTagTextbox: e.target.value
    });
  }

  createTag() {
    Meteor.call("forums.createtag", this.props.id, this.state.newTagTextbox);
    this.setState({
      newTagTextbox: ""
    });
  }

  removeTag(tag) {
    Meteor.call("forums.removetag", this.props.id, tag);
  }

  setActiveTag(tag) {
    this.setState({
      activeTag: this.state.activeTag === tag ? null : tag
    });
  }

  setActiveSort(sort) {
    this.setState({
      activeSort: sort
    });
  }

  render() {
    let sortOptions = {
      newest: {
        friendlyName: "Newest",
        sort: { createdAt: -1 }
      },
      oldest: {
        friendlyName: "Oldest",
        sort: { createdAt: 1 }
      },
      recentlyUpdated: {
        friendlyName: "Recently Updated",
        sort: { updatedAt: -1 }
      },
      leastRecentlyUpdated: {
        friendlyName: "Last Updated",
        sort: { updatedAt: 1 }
      },
      mostReplies: {
        friendlyName: "Most Replied",
        sort: { replyCount: -1 }
      },
      fewestReplies: {
        friendlyName: "Least Replied",
        sort: { replyCount: 1 }
      }
    };

    return (
      <div className="bp3-dark ForumComponent">
        <div className="ForumComponent-flex">
          <table className={Classes.HTML_TABLE + " ForumComponent-container " + ((!this.props.subId && !this.state.creatingNewThread) && Classes.INTERACTIVE)}>
            <thead>
              <tr>
                <th className="ForumComponent-header">
                  {this.props.subId ? <ButtonGroup minimal={true} className="ForumComponent-buttons">
                    <Button icon="arrow-left" text="Back" onClick={this.goHome}/>
                  </ButtonGroup>: <ButtonGroup minimal={true} className="ForumComponent-buttons">
                    <Popover>
                      <Button icon="sort" text="Sort By"/>
                      <Menu>
                        {Object.entries(sortOptions).map((value) => (<MenuItem text={value[1].friendlyName} key={value[0]} icon={this.state.activeSort === value[0] ? "tick" : null} onClick={() => this.setActiveSort(value[0])}/>))}
                      </Menu>
                    </Popover>
                    {this.props.forum[0] && <Popover>
                      <Button icon="tag" text="Tags"/>
                      <Menu>
                        {this.props.forum[0].tags && this.props.forum[0].tags.map((value) => (<MenuItem key={value} icon={this.state.activeTag === value && "tick"} text={value} onClick={() => this.setActiveTag(value)}/>))}
                        {checkWritePermission(Meteor.userId(), this.props.planet) && this.props.forum[0].tags && this.props.forum[0].tags.length !== 0 && <MenuDivider/>}
                        {checkWritePermission(Meteor.userId(), this.props.planet) && <MenuItem icon="plus" text="Add New">
                          <div className="MainSidebar-menu-form">
                            <input className={Classes.INPUT + " MainSidebar-menu-input"} value={this.state.newTagTextbox} onChange={this.updateTextbox}/>
                            <Button text="Create" className="MainSidebar-menu-button" onClick={this.createTag}/>
                          </div>
                        </MenuItem>}
                        {checkWritePermission(Meteor.userId(), this.props.planet) && <MenuItem icon="cross" text="Delete">
                          {this.props.forum[0].tags && this.props.forum[0].tags.map((value) => (<MenuItem key={value} icon={this.state.activeTag === value && "tick"} text={value} onClick={() => this.removeTag(value)}/>))}
                        </MenuItem>}
                      </Menu>
                    </Popover>}
                    <Divider/>
                    {this.props.forum[0] && <Button icon="plus" text="New Thread" onClick={this.startNewThread}/>}
                  </ButtonGroup>}
                </th>
              </tr>
            </thead>
            {this.state.creatingNewThread || this.props.subId ? <tbody>
              <tr>
                <td>
                  {this.props.subId ? <ForumThread planet={this.props.planet} postId={this.props.subId}/> : <ForumEditor onClose={this.dismissThread} forum={this.props.forum[0]} forumId={this.props.id}/>}
                </td>
              </tr>
            </tbody> : <ForumItemContainer planet={this.props.planet} id={this.props.id} postCount={this.state.postCount} loadMore={this.loadMore} sort={sortOptions[this.state.activeSort].sort} tag={this.state.activeTag}/>}
          </table>
        </div>
      </div>
    );
  }
}

export default withTracker((props) => {
  Meteor.subscribe("forums.forum", props.id);

  return {
    forum: Forum.find({_id: props.id}).fetch(),
    postCount: ForumPosts.find({componentId: props.id}).count(),
    currentUser: Meteor.user()
  };
})(ForumComponent);