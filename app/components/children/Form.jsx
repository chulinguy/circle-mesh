import React from "react";
// import helpers from "../utils/helpers";
import {Link, BrowserRouter} from 'react-router-dom';



class Form extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  };



  render () {
    return (
      <div className="container form">
        <form >
          <div className="row align-items">
            <div className="row task">
              <div className="form-group col-sm-9">
                <label htmlFor="formGroupInput" className="meshInput">Mesh:</label>
                <input type="text" className="form-control" value={0}  onChange={} id="meshName" placeholder="Mesh Name Input"/>
              </div>
              <div className="form-group col-sm-3">
                <label htmlFor="formGroupInput" className="meshInput">Date:</label>
                <input className="form-control" type="date" value={1}  onChange={} id="meshDate"/>
              </div>
            </div>
          </div>
          <hr/>

          
            <br/>

            <div className="form-group row">
              <div className="col-sm-10 col-sm-offset-1">
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

// Form.contextTypes = {
//   router: PropTypes.object
// }
export default Form;
