import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import { Tag, Icon, Divider} from "@blueprintjs/core";
import "./css/ForumItem";

class ForumItem extends React.Component {
  render() {
    return (
      <tr className="ForumItem">
        <td>
          <div className="ForumItem-name">
            <span className="ForumItem-name-text">Dummy post 3</span>
            <div className="ForumItem-name-flex">
              <div className="ForumItem-tags"><Tag className="ForumItem-tag">Large Project</Tag><Tag className="ForumItem-tag">Test</Tag></div>
            </div>
            <div className="ForumItem-rightside">
              <div className="ForumItem-right-container">
                <Icon icon="comment"/>
                <span className="ForumItem-replies">51</span>
                <Divider/>
                <span className="ForumItem-updated">June 28th, 2020</span>
              </div>
            </div>
          </div>
          <div className="ForumItem-info">
            <div>Posted by william341 on June 28th, 2020</div>
          </div>
        </td>
      </tr>
    );
  }
}

export default withTracker((props) => {
  return {
    currentUser: Meteor.user()
  };
})(ForumItem);