import React from 'react';
import { Navbar, Button, Alignment } from "@blueprintjs/core";
import './css/Home.css'

class Home extends React.Component {
  render() {
    return (
      <div className="Home bp3-dark">
        <div className="Home-header">
          <div className="Home-header-branding">starship<div className="Home-header-version">alpha</div></div>
        </div>
        <div className="Home-featured">
          <div className="Home-featured-header">Featured Planets</div>
          <div className="Home-featured-list">
            
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
