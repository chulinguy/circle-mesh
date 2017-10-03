import React from "react";
// import helpers from "../utils/helpers";
import {Link} from 'react-router-dom';
import Moment from 'react-moment';
import 'moment-timezone';

class Form extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      meshName: "",
      meshDate: "",
      meshTime: '9 AM',
      meshDuration: 0,
      meshAddress: ''
    }
    this.meshDateChangeHandler = this.meshDateChangeHandler.bind(this);
    this.meshNameChangeHandler = this.meshNameChangeHandler.bind(this);
    this.meshTimeChangeHandler = this.meshTimeChangeHandler.bind(this);
    this.meshDurationChangeHandler = this.meshDurationChangeHandler.bind(this);
    this.meshAddressChangeHandler = this.meshAddressChangeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  };

  meshNameChangeHandler(event){
    this.setState({meshName: event.target.value});
  }

  meshDateChangeHandler(event){
    var convertedDate = event.target.value;
    if (event.target.value.includes("/")){
      var beforeConvert = event.target.value
      var month = beforeConvert.slice(0,2);
      var day = beforeConvert.slice(3,5);
      var year = beforeConvert.slice(7);
      convertedDate = `${year}-${month}-${day}`;
    }
  
    this.setState({meshDate: convertedDate});
  }

  meshTimeChangeHandler(event){
    this.setState({meshTime: event.target.value});
  }

  meshDurationChangeHandler(event){
    this.setState({meshDuration: event.target.value});
  }

  meshAddressChangeHandler(event){
    this.setState({meshAddress: event.target.value});
  }

  submitHandler(event){
    var that = this; 
    event.preventDefault();
    var geocoder = new google.maps.Geocoder();
    console.log("trying to geocoder mesh location")
    geocoder.geocode({ 'address': this.state.meshAddress}, function(results, status){
      if (status == google.maps.GeocoderStatus.OK){
        console.log(results[0]);
        var lat = results[0].geometry.location.lat();
        var lng = results[0].geometry.location.lng();
        var meshObj = {};
        meshObj.meshName = that.state.meshName;
        meshObj.meshDate = that.state.meshDate;
        meshObj.meshDuration = that.state.meshDuration;
        meshObj.meshCoordinate = {
          lat:lat,
          lng: lng
        };
        
        meshObj.meshCreatedCoordinate = that.props.currentCoordinate;
        meshObj.meshTime = that.state.meshTime;
        that.props.createMesh(meshObj);

      } else {
        alert("geocoder error")
      }
    })
  }

  componentDidMount(){
    var newAutocomplete = new google.maps.places.Autocomplete((document.getElementById('meshAddress')),
      {types: ['geocode']});
      console.log("newAutocomplete is")
      console.log(newAutocomplete)
    this.props.setAutocomplete(newAutocomplete);
  }

  render () {
    return (
      <div className="container form">
        <form >
          <div className="row align-items">
            <div className="row ">
              <div className="form-group col-sm-8 col-xs-8">
                <label htmlFor="formGroupInput" className="meshInput">Mesh Name:</label>
                <input type="text" className="form-control" value={this.state.meshName}  onChange={this.meshNameChangeHandler} id="meshName" placeholder="Mesh Name Input"/>
              </div>
              <div className="form-group col-sm-4 col-xs-4">
                <label htmlFor="formGroupInput" className="meshInput">Duration (hours):</label>
                <input type="text" pattern="[0-9]*" onInput={this.meshDurationChangeHandler} value={this.state.meshDuration} id="meshDuration"/>
              </div>
            </div>
            <div className="row">  
              <div className="form-group col-sm-6 col-xs-6">
                <label htmlFor="formGroupInput" className="meshInput">Start Date (mm/dd/yyyy):</label>
                <input className="form-control" type="date" value={this.state.meshDate}  onChange={this.meshDateChangeHandler} id="meshDate"/>
              </div>
              <div className="form-group col-sm-6 col-xs-6">
                <label htmlFor="formGroupInput" className="meshInput">Start Time:</label>
                <select value={this.state.meshTime} onChange={this.meshTimeChangeHandler}>
                  <option value="9 AM">9 AM</option>
                  <option value="10 AM">10 AM</option>
                  <option value="11 AM">11 AM</option>
                  <option value="12 PM">12 PM</option>
                  <option value="1 PM">1 PM</option>
                  <option value="2 PM">2 PM</option>
                  <option value="3 PM">3 PM</option>
                  <option value="4 PM">4 PM</option>
                  <option value="5 PM">5 PM</option>
                  <option value="6 PM">6 PM</option>
                  <option value="7 PM">7 PM</option>
                  <option value="8 PM">8 PM</option>
                  <option value="9 PM">9 PM</option>
                </select>
              </div>
            </div>
            <div className="row mesh"> 
              <div className="form-group col-sm-8 col-xs-12">
                <label htmlFor="formGroupInput" className="meshInput">Mesh Address:</label>
                <input type="text" className="form-control" value={this.state.meshAddress}  onChange={this.meshAddressChangeHandler} id="meshAddress" placeholder="Mesh Address Input"/>
              </div>
            </div>

          </div>
          <hr/>
          
          <br/>

          <div className="form-group row">
            <div className="col-sm-10 col-sm-offset-1" onClick={this.submitHandler}>
              <Link href='/' to='/' className="formButton btn btn-danger"  >
                Submit
              </Link>
            </div>
          </div>

        </form>

      </div>
    )
  }
}

export default Form;
