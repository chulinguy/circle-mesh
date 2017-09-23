import React from 'react';
// import helpers from '../utils/helpers';
import {Link} from 'react-router-dom';
// import PropTypes from "prop-types";

class Dashboard extends React.Component {
  
  constructor(props){
    super(props);
  }
    
  // clickGoalHandler (goalTitle){
  //   var that = this; 
  //   helpers.completeGoal(goalTitle).then((response)=>{
  //     that.props.createGoal({},{tasks:[]})
  //   })
  // }

  render() {
    var that = this;

    
      return (
        <div> 
          <h1> You are at Mesh</h1>
            <Link to="/form">
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