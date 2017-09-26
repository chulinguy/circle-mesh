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
      job: '',
      photo: '',
      meshes:[],
      currentMeshID: '',
      currentMeshName: '',
      currentCoordinate: {lng: 0, lat: 0},
      currentMeshEndTimeMilliSec: 0
    }
    this.updateLogin = this.updateLogin.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.createMesh = this.createMesh.bind(this);
    this.joinCurrentMesh = this.joinCurrentMesh.bind(this);
    this.getAllMeshes = this.getAllMeshes.bind(this);
  }

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
      username: foundUser.firstName,
      photo: foundUser.photo,
      job: foundUser.job
    })
    console.log('updated routesR\'s user & mesh states');
    console.log('foundUser', foundUser.firstName)
  }


  createMesh(meshObj){
    var that = this;  
    axios.post('/api/mesh', meshObj).then((data)=>{
      console.log('created a new mesh')
      that.getAllMeshes();
    })
  }

  joinCurrentMesh(meshID, meshName, meshEndTimeMilliSec){
    this.setState({
      currentMeshID:meshID,
      currentMeshName: meshName, 
      currentMeshEndTimeMilliSec: meshEndTimeMilliSec
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
    setInterval(that.getAllMeshes,60000)
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
              currentCoordinate={this.state.currentCoordinate}
            />
          )}/>      

          <Route path="/mesh" render={(props) => (
            <Mesh
              username={this.state.username}
              job={this.state.job}
              photo={this.state.photo}
              currentMeshID={this.state.currentMeshID}
              currentMeshName={this.state.currentMeshName}
              currentMeshEndTimeMilliSec={this.state.currentMeshEndTimeMilliSec}
            />
          )}/>

        </Switch>
      </div>
    )
  }

}


export default Routes;
