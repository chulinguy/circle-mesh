import React from "react";
// import helpers from "../utils/helpers";
import {Link, BrowserRouter} from 'react-router-dom';



class Form extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      meshName: "",
      meshDate: "",
      meshTime: '',
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
    this.setState({meshName: event.target.value})
  }

  meshDateChangeHandler(event){
    this.setState({meshDate: event.target.value})
  }

  meshTimeChangeHandler(event){
    this.setState({meshTime: event.target.value})
  }

  meshDurationChangeHandler(event){
    this.setState({meshDuration: event.target.value})
  }

  submitHandler(event){
    event.preventDefault();
    var meshObj = {};
    meshObj.meshName = this.state.meshName;
    meshObj.meshDate = this.state.meshDate;
    this.props.createMesh(meshObj);
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
                <label htmlFor="formGroupInput" className="meshInput">Start Date:</label>
                <input className="form-control" type="date" value={this.state.meshDate}  onChange={this.meshDateChangeHandler} id="meshDate"/>
              </div>
              <div className="form-group col-sm-6 col-xs-6">
                <label htmlFor="formGroupInput" className="meshInput">Start Time:</label>
                <select value={this.state.meshTime} onChange={this.meshTimeChangeHandler}>
                  <option value="9AM">9AM</option>
                  <option value="10AM">10AM</option>
                  <option value="11AM">11AM</option>
                  <option value="12PM">12PM</option>
                  <option value="1PM">1PM</option>
                  <option value="2PM">2PM</option>
                  <option value="3PM">3PM</option>
                  <option value="4PM">4PM</option>
                  <option value="5PM">5PM</option>
                  <option value="6PM">6PM</option>
                  <option value="7PM">7PM</option>
                  <option value="8PM">8PM</option>
                  <option value="9PM">9PM</option>
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
