import React from "react";
import "./css/Home.css";
import { Callout, Intent, Text } from "@blueprintjs/core";
import {withTracker} from "meteor/react-meteor-data";
import Planets from "../../api/planets";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";

class Home extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState;
  }

  goToPlanet(id) {
    FlowRouter.go("Planets.home", {_id: id});
  }

  render() {
    console.log(this.props);
    return (
      <div className="Home bp3-dark">
        <div className="Home-container">
          <div className="Home-header">
            <div className="Home-header-branding">Welcome to Starship!</div>
            <Callout icon="warning-sign" intent={Intent.WARNING} title="Here be dragons!" className="Home-alpha-callout">
              Starship is in an early alpha stage. Expect bugs and unfinished features. (including this homepage, which will one day be more focused on your followed planets)<br/>
              If you find a bug, please report it <a href="https://starship.william341.me/planet/kCnATXqBCD4vEvzMB/pekuosDPGGxHKc6Qg">here</a>.
            </Callout>
          </div>
          <div className="Home-featured">
            <div className="Home-featured-header">Featured Planets</div>
            <div className="Home-featured-list">
              {this.props.planets.map((value) => (<div className="Home-featured-item" onClick={() => this.goToPlanet(value._id)} key={value._id}>
                <Text className="Home-featured-name">{value.name}</Text>
                <Text className="Home-featured-description">{value.featuredDescription && value.featuredDescription} </Text>
                <div className="Home-featured-followers">{value.followerCount} {value.followerCount === 1 ? "Follower" : "Followers"}</div>
              </div>))}
            </div>
          </div>
          <div className="Home-footer">
            <span className="Home-footer-copyright">© Starship 2019. All rights reserved.</span>
            <span className="Home-footer-links">
              <a className="Home-footer-link" href="#">Terms</a> 
              <a className="Home-footer-link" href="#">Privacy Policy</a> 
              <a className="Home-footer-link" href="#">DMCA</a>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe("planets.featured");

  return {
    planets: Planets.find({featured: true}).fetch()
  };
})(Home);
