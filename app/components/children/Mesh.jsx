import React from 'react';
import {Link} from 'react-router-dom';

class Mesh extends React.Component {
  
  constructor(props){
    super(props);
  }
    
  componentDidMount(){

  }

  componentDidUpdate(){
    this.render();
  }

  render() {
    var that = this;

    
      return (
        <div> 
          <h1> You are at Mesh {this.props.currentMeshName}</h1>
            <div id="yourself">

            </div> 
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