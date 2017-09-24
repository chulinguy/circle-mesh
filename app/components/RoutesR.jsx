import React from 'react';
import axios from 'axios';
import history from '../history.js';

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
      tempID: 0,
      username: '',
      meshes:[],
      currentMeshID: '',
      currentMeshName: ''
    }
    this.updateLogin = this.updateLogin.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.createMesh = this.createMesh.bind(this);
    this.joinCurrentMesh = this.joinCurrentMesh.bind(this);
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
      tempID: logincheck.data.tempID
    })
    console.log('updated routesR\'s login states')
  }

  updateUser(foundUser){
    var that = this;
    that.setState({
      username: foundUser.username,
    })
    console.log('updated routesR\'s user & mesh states');
    console.log('foundUser', foundUser.username)
  }


  createMesh(meshObj){
    var that = this;  
    axios.post('/api/mesh', meshObj).then((data)=>{
      console.log('created a new mesh')
      that.getAllMeshes();
    })
  }

  joinCurrentMesh(meshID, meshName){
    this.setState({
      currentMeshID:meshID,
      currentMeshName: meshName
    });
    //TODO: add this user to mesh via Mongoose
    history.push({ pathname: `/mesh/${meshID}` })
  }


  getAllMeshes(){
    var that = this;  
    axios.get('/api/meshes').then((meshesObj)=>{
      if (Object.keys(meshesObj.data).length){
        // console.log('meshesObj.data is')
        // console.log(meshesObj.data)
        that.setState({meshes: meshesObj.data})
      }
    })
  }
  componentDidMount(){
    var that = this; 
    setInterval(that.getAllMeshes,10000)
  }

  componentDidUpdate(prevProps, prevState){
    if (prevState.meshes.length !== this.state.meshes.length || this.state.meshes.length ===0 ){
      console.log(this.state.meshes)
      this.getAllMeshes()
    }
    
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
              tempID={this.state.tempID}
              username={this.state.username}
              currentMesh={this.state.currentMesh}
              joinCurrentMesh={this.joinCurrentMesh}
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
              currentMeshID={this.state.currentMeshID}
              currentMeshNme={this.state.currentMeshName}
            />
          )}/>

        </Switch>
      </div>
    )
  }

}


export default Routes;
