import React from "react";
import {ErrorToaster} from "../../../Toaster";
import {withTracker} from "meteor/react-meteor-data";
import "./css/ForumThread";
import { ForumPosts, ForumReplies } from "../../../../api/collectionsStandalone";
import ForumThreadItem from "./ForumThreadItem";
import { Button, Intent } from "@blueprintjs/core";
import SimpleMDE from "react-simplemde-editor";
import ForumThreadItemContainer from "./ForumThreadItemContainer";
import ReactPaginate from "react-paginate";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import { checkWritePermission} from "../../../../util/checkPermissions";
import editorOptions from "../../../../util/editorOptions";

class ForumThread extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editingContent: "",
      editorDemandsValueChange: false
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.postThread = this.postThread.bind(this);
    this.addQuote = this.addQuote.bind(this);
    this.changePage = this.changePage.bind(this);
    this.getInstance = this.getInstance.bind(this);
    this.instance = null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState;
  }

  componentDidUpdate() {
    if(this.state.editorDemandsValueChange) {
      this.instance.value(this.state.editingContent);
      this.setState({
        editorDemandsValueChange: false
      });
    }
  }

  handleChange(value) {
    this.setState({
      editingContent: value
    });
  }

  getInstance(instance) {
    this.instance = instance;
  }

  postThread() {
    if(this.state.editingContent === "") {
      ErrorToaster.show({message: "Cannot create a thread with no content.", icon:"error", intent:Intent.DANGER});
    }
    let workaround = this.state.editingContent;
    this.setState({
      editingContent: "",
      editorDemandsValueChange: true
    });
    Meteor.call("forumreplies.insert", this.props.postId, workaround);
  }


  addQuote(post) {
    let quote = post.content.split("\n");
    quote = quote.join("\n> ");
    quote = "> " + quote;

    this.setState({
      editingContent: this.state.editingContent + quote + "\n \n",
      editorDemandsValueChange: true
    });
  }

  changePage(page) {
    console.log(page.selected);
    FlowRouter.go("Planets.component.subid.page", {_id: this.props.planet._id, _cid: this.props.componentId, _sid: this.props.postId, _page: page.selected + 1});
  }

  render() {
    console.log(this.props.page);
    console.log(Number(this.props.page));
    return (
      <div className="ForumThread">
        <div className="ForumThread-name">{this.props.post && this.props.post.name}</div>
        <div className="ForumThread-container">
          {this.props.post && (this.props.page ? Number(this.props.page) : 1) === 1 && <ForumThreadItem post={this.props.post} planet={this.props.planet} isParent={true} addQuote={this.addQuote}/>}
          <ForumThreadItemContainer page={this.props.page ? Number(this.props.page) : 1} addQuote={this.addQuote} planet={this.props.planet} postId={this.props.postId}/>
        </div>
        {this.props.postCount > 25 && <ReactPaginate
          previousLabel="<"
          nextLabel=">"
          breakLabel="..."
          breakClassName="bp3-button bp3-disabled pagination-button"
          pageCount={Math.ceil(this.props.postCount / 25)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={this.changePage}
          initialPage={Number(this.props.page) - 1}
          disableInitialCallback={true}
          containerClassName="pagination bp3-button-group"
          activeClassName="active"
          pageClassName="bp3-button pagination-button"
          previousClassName="bp3-button pagination-button"
          nextClassName="bp3-button pagination-button"
          pageLinkClassName="pagination-link"
          nextLinkClassName="pagination-link"
          previousLinkClassName="pagination-link"
          breakLinkClassName="pagination-link"
        />}
        {this.props.post && Meteor.userId() && (!this.props.post.locked || checkWritePermission(Meteor.userId(), this.props.planet)) && <div className="ForumThread-reply-editor">
          <div className="ForumThread-reply">Reply</div>
          <SimpleMDE
            onChange={this.handleChange} 
            getMdeInstance={this.getInstance} 
            value={this.state.editingContent} 
            options={editorOptions}/>
          <Button text="Post" className="ForumEditor-button" onClick={this.postThread}/>
        </div>}
      </div>
    );
  }
}

export default withTracker((props) => {
  Meteor.subscribe("forumposts.post", props.postId);
  Meteor.subscribe("forumreplies.replies", props.postId);

  return {
    post: ForumPosts.findOne(props.postId),
    postCount: ForumReplies.find({postId: props.postId}).count(),
    currentUser: Meteor.user()
  };
})(ForumThread);