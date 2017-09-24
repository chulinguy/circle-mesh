import React from 'react';
import {Link} from 'react-router-dom';

class Dashboard extends React.Component {
  
  constructor(props){
    super(props);
  }
    
  componentDidMount(){

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
              <button className="btn btn-success">Create New Goal</button>
            </Link>
        </div>

      )
    
  }
}


// Dashboard.contextTypes = {
//   router: PropTypes.object
// }
export default Dashboard;