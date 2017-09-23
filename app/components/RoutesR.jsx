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
      currentMeshName: '',
      action: '',
      needToRedirect: false,
      tempUser: null
    }
    this.updateLogin = this.updateLogin.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.createMesh = this.createMesh.bind(this);
  }

  // componentDidUpdate(prevProps, prevState){
  //   if (prevState.userLogged !== this.state.userLogged && prevState.serverResponded == this.state.serverResponded){
  //     console.log('YES THANK GOD')
  //   }
  // }

  updateLogin(logincheck){
    var that = this;
    that.setState({
      serverResponded: true,
      userLogged: logincheck.data.logged,
      tempUser: logincheck.data.tempUser
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

  updateNeedToRedirect(bool){
    this.setState({needToRedirect: bool});
    console.log('needToRedirect updated')
  }

  createMesh(){

  }


  render(){
    var that = this;  
    return (
      <div>
        <Switch>
          <Route exact path="/"  render={(props) => (
            <LoginOrStart {... props}
              updateLogin={this.updateLogin}
              updateUser={this.updateUser}
              userLogged = {this.state.userLogged}
              serverResponded = {this.state.serverResponded}
              meshes={this.state.meshes}
              action={this.state.action}
              history={this.props.history}
              tempUser={this.state.tempUser}
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
              mesh={this.state.meshes.filter((v) => (v.meshname === that.currentMeshName))[0]}
            />
          )}/>

        </Switch>
      </div>
    )
  }

}


export default Routes;
