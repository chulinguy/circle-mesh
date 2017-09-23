import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";

import Header from "./Header.jsx";
import RoutesR from "./RoutesR.jsx";

class Main extends React.Component {
  constructor(props){
    super(props);
  }

  render (){
    return(
        <div>
          <Header />
          <RoutesR history={this.props.history}/>
        </div>
        
    )};
}

export default Main;