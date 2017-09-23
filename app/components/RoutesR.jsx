import React from 'react';

import { Route, BrowserRouter, Switch } from "react-router-dom";
// import helpers from './utils/helpers';
import LoginOrStart from './children/LoginOrStart.jsx';
import Form from './children/Form.jsx';
import Mesh from './children/Mesh.jsx';


class Routes extends React.Component {
  constructor(props){
    super(props)
    this.state= {
      userLogged: false,
      serverResponded: false,
      username: 'George',
      meshes:[],
      currentMeshIndex: 0
    }
    this.updateLogin = this.updateLogin.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.createMesh = this.createMesh.bind(this);
  }

  updateLogin(logincheck){
    var that = this;
    that.setState({
      serverResponded: true,
      userLogged: logincheck.data.logged,
    })
    console.log('updated routesR\'s login states')
  }

  updateUser(foundUser){
    var that = this;
    that.setState({
      username: foundUser.username,
      meshCreated: foundUser.meshCreated,
      meshJoined: foundUser.meshJoined
    })
    console.log('updated routesR\'s user & mesh states');
    console.log('foundUser', foundUser.username)
  }

  createMesh(){

  }


  render(){
    return (
      <div>
        <Switch>
          <Route exact path="/"  render={(props) => (
            <LoginOrStart 
              updateLogin={this.updateLogin}
              updateUser={this.updateUser}
              userLogged = {this.state.userLogged}
              serverResponded = {this.state.serverResponded}
              meshes={this.state.meshes}
            />
          )}/>

          <Route path="/form" render={(props) => (
            <Form 
              createMesh={this.createMesh}
            />
          )}/>      

          <Route path="/mesh" render={(props) => (
            <Mesh
              username={this.state.username}
              mesh={this.state.meshes[this.state.currentMeshIndex]}
            />
          )}/>

        </Switch>
      </div>
    )
  }

}


export default Routes;
