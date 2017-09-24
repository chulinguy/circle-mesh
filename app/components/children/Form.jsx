import React from "react";
// import helpers from "../utils/helpers";
import {Link, BrowserRouter} from 'react-router-dom';



class Form extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      meshName: "",
      meshDate: ""
    }
    this.meshDateChangeHandler = this.meshDateChangeHandler.bind(this);
    this.meshNameChangeHandler = this.meshNameChangeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  };

  meshNameChangeHandler(event){
    this.setState({meshName: event.target.value})
  }

  meshDateChangeHandler(event){
    this.setState({meshDate: event.target.value})
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
            <div className="row task">
              <div className="form-group col-sm-9">
                <label htmlFor="formGroupInput" className="meshInput">Mesh:</label>
                <input type="text" className="form-control" value={this.state.value}  onChange={this.meshNameChangeHandler} id="meshName" placeholder="Mesh Name Input"/>
              </div>
              <div className="form-group col-sm-3">
                <label htmlFor="formGroupInput" className="meshInput">Date:</label>
                <input className="form-control" type="date" value={this.state.value}  onChange={this.meshDateChangeHandler} id="meshDate"/>
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
