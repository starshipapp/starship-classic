import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import { Classes ,ButtonGroup, Button, Divider} from "@blueprintjs/core";
import "./css/ForumComponent";
import ForumItem from "./forum/ForumItem";
import ForumEditor from "./forum/ForumEditor";

class ForumComponent extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      creatingNewThread: false
    };

    this.startNewThread = this.startNewThread.bind(this);
    this.dismissThread = this.dismissThread.bind(this);
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

  render() {
    return (
      <div className="bp3-dark ForumComponent">
        <div className="ForumComponent-flex">
          <table className={Classes.HTML_TABLE + " ForumComponent-container " + Classes.HTML_TABLE_STRIPED + " " + Classes.INTERACTIVE}>
            <thead>
              <tr>
                <th>
                  <div className="ForumComponent-header">welcome to william abuses the shit out of HTML tables</div>
                  <ButtonGroup minimal={true} className="ForumComponent-buttons">
                    <Button icon="sort" text="Sort By"/>
                    <Button icon="tag" text="Tags"/>
                    <Divider/>
                    <Button icon="plus" text="New Thread" onClick={this.startNewThread}/>
                  </ButtonGroup>
                </th>
              </tr>
            </thead>
            {this.state.creatingNewThread ? <tbody>
              <tr>
                <td>
                  <ForumEditor/>
                </td>
              </tr>
            </tbody> : <tbody>
              <ForumItem/>
              <ForumItem/>
              <ForumItem/>
            </tbody>}
          </table>
        </div>
      </div>
    );
  }
}

export default withTracker((props) => {
  return {
    currentUser: Meteor.user()
  };
})(ForumComponent);