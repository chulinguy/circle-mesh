import React from "react";
import axios from 'axios';
import {Link} from 'react-router-dom';
import history from '../../history.js';

class LoginOrStart extends React.Component {
  constructor(props){
    super(props);
    
  }

  componentDidMount(){
    var that = this; 
    axios.get('/api/loggedin').then((logincheck) =>{
      console.log('/api/loggedin returns')
      console.log('tempID is ', logincheck.data.tempID)
      that.props.updateLogin(logincheck)
      //check database
      axios.get(`/api/user/${logincheck.data.tempID}`).then((foundUserObj) => {
        console.log('/api/user returns')
        console.log('foundUserObj received', foundUserObj)
        if(foundUserObj.data.user) {
          console.log('react trying to update user')
          that.props.updateUser(foundUserObj.data.user)
        }
        if (foundUserObj.data.needToRedirect){
            axios.post(`/api/turnOffRedirect/${logincheck.data.tempID}`).then(()=>{
              console.log('TURNING OFF REDIRECT')
            })
            console.log('REDIRECTING')
            var redirectPath = foundUserObj.data.redirectAction; 
            console.log(this.props.history)
            history.replace({ pathname: `/${redirectPath}` })
        //history.push
        }
        else that.render();
      })
    })
  }

  render(props) {
    var welcomeUser ='';
    var that = this;  
    if (this.props.userLogged === false && this.props.serverResponded === true) {
      welcomeUser = `User ${this.props.tempID}`; 
      var content = (
        <div className="container card text-center login">
          <div className="card-block">
              <h1 className="card-title">Welcome to Circle-Mesh, {welcomeUser}</h1>
              <br />

              <div className='panel'>
                <div className='panel-heading'>
                  <h5>Existing Meshes</h5>
                </div>
                <div className='panel-body'>
                  {this.props.meshes.map(
                    function(mesh, i){
                      return(
                        <a key={i} href={`auth/linkedin/mesh/${that.props.tempID}/${mesh._id}`} className="btn btn-success">Join {mesh.meshName}</a>
                      )
                    })
                  }
                </div>
              </div>

              <h4 className="card-text">Log in with Linkedin</h4>
              <br/>
              <a href={`auth/linkedin/create/${this.props.tempID}`} className="btn btn-primary">Login(create mesh)</a>
          </div>
        </div>
      )
    } else if (this.props.userLogged === true && this.props.serverResponded === true){
      welcomeUser = `${this.props.username}`; 
      var content = (
        <div className="container card text-center login">
          <div className="card-block">
              <h1 className="card-title">Welcome to Circle-Mesh, {welcomeUser}</h1>
              <br />

              <div className='panel'>
                <div className='panel-heading'>
                  <h5>Existing Meshes</h5>
                </div>
                <div className='panel-body'>
                  {this.props.meshes.map(
                    function(mesh, i){
                      return(
                        <div key={i} onClick={that.props.joinCurrentMesh.bind(that,mesh._id, mesh.meshName, mesh.meshEndTimeMilliSec)}>
                          <p className="btn btn-success">Join {mesh.meshName}</p>
                        </div>
                      )
                    })
                  }
                </div>
              </div>

              <h4 className="card-text">Create or Join a mesh</h4>
              <br/>

              <Link to="/form" className="btn btn-success create_btn">Create a Mesh</Link>

          </div>
        </div>
      )
    } else {
      var content = (<h3>Waiting for server ...</h3>)
    }
  	return (
      <div>
        {content}
      </div>
  	)
  }
}

export default LoginOrStart;

//additional login page for redirecting / terms and condition checkbox;
//