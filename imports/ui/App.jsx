import React from 'react';
import { Menu } from "@blueprintjs/core";
import MainSidebar from './sidebars/MainSidebar'
import ContentSpace from './content/ContentSpace'
import './css/App.css'

class App extends React.Component {
  render() {
    return (
      <div className="App bp3-dark">
        <div className="App-container">
          <MainSidebar/>
          {this.props.component}
        </div>
      </div>
    );
  }
}

export default App;
