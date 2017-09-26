import React from 'react';
import {Link} from 'react-router-dom';

class Mesh extends React.Component {
  
  constructor(props){
    super(props);
    this.state={
      timeLeftHours: 0,
      timeLeftMinutes: 0
    }
  }
    
  componentDidMount(){ 
    var that = this;  
    var updateTimer = setInterval(intervalFunc, 3000)
    intervalFunc();
    function intervalFunc(){
      var rightNow = new Date; 
      if (rightNow.getTime() > that.props.meshEndTimeMilliSec){
        alert("This Mesh Has Expired");
      } else { 
        // console.log('inside update timer')
        var timeDiffInMinutes = (that.props.currentMeshEndTimeMilliSec - rightNow.getTime()) / 60000; 
        var timeLeftHours = Math.floor(timeDiffInMinutes / 60);
        var timeLeftMinutes = Math.floor(timeDiffInMinutes - (timeLeftHours * 60));
        // console.log(timeLeftHours)
        // console.log(timeLeftMinutes)
        that.setState({
          timeLeftHours: timeLeftHours,
          timeLeftMinutes: timeLeftMinutes
        })
      }
    }
    


  }

  componentDidUpdate(){
    this.render();
  }

  render() {
    var that = this;

    
      return (
        <div className="container"> 
          <h1> You are at Mesh {this.props.currentMeshName}</h1>
          <h2> {
              function(){
                var convertedTimeLeftMinutes = that.state.timeLeftMinutes;
                if (that.state.timeLeftMinutes === 0) convertedTimeLeftMinutes = "less than 1"
                return `This Mesh has ${that.state.timeLeftHours} hours and ${convertedTimeLeftMinutes} minutes left`
              }()
          }</h2>
          <div className="row" id="yourself">
            <div className="col-xs-6">
              <img src={this.props.photo} className='avatar-pic'/>
            </div>
            <div className="col-xs-6">
              <h6>{this.props.username}</h6>
              <h6>{this.props.job}</h6> 
            </div>
          </div> 
          <br/><hr/><br/>
          <div id='others'>
          
          </div>
          <Link to="/">
            <button className="btn btn-success">Back to homepage</button>
          </Link>
        </div>

      )
    
  }
}

export default Mesh;

//why does it refresh on other users??