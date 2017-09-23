var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');
var path = require('path');
var mongoose = require('mongoose');
var logger = require("morgan");
mongoose.Promise = Promise;

var router = express.Router();

//express server
var app = express();
var port = process.env.PORT || 3000;

//server middle-wares
app.use(express.static("public"));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

//passport logic
require('./config/passport.js')(passport);

app.use(cookieParser('S3CR37'))
app.use(cookieSession({
  secret: 'S3CR37',
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}))
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Database configuration with mongoose and model requires
var User = require('./models/User.js');
var Mesh = require('./models/Mesh.js');
//database logic
if (process.env.MONGODB_URI || process.env.NODE_ENV === 'production') mongoose.connect(process.env.MONGODB_URI);
else mongoose.connect("mongodb://localhost/meshDB");
var db = mongoose.connection;

db.on('error', function(error) {
  console.log('Mongoose Error: ', error);
});

db.once('open', function() {
  console.log('Mongoose connection successful.');
});

//SERVER LOGIC
var needToRedirect = false;  
var action ='';
//Linkedin passport
app.get('/auth/linkedin/create/:tempID', function(req, res, next){
  console.log('CHANGING NEED TO REDIRECT');
  tempUsersArr[tempID].needToRedirect = true;
  tempUsersArr[tempID].action = "create";
  next();
},
  passport.authenticate('linkedin')
);

app.get('/auth/linkedin', passport.authenticate('linkedin'));

app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {

  successRedirect: '/',
  failureRedirect: '/auth/linkedin' 
}));

//for this user, get whole user obj
app.get('/api/user',(req, res) => {
  var userToFind = '';  
  console.log('req session is')
  console.log(req.session)
  if (req.session.passport) userToFind =  req.session.passport.user;
  User.findById(userToFind, (err, foundUser) => {
    // console.log('foundUser', foundUser);
    // if (!foundUser) foundUser = {};
    res.json(foundUser)
  })

})

//route for user to create a mesh
app.post('/api/mesh/:meshname', (req, res) => {
  //TODO: check with front end to make sure req.body data format is correct
  console.log('REQ.BODY of mesh post', req.body);
  Mesh.create({meshname: req.params.meshname}, (err, data) => {
    if (err) throw err;
    console.log('new mesh created');
    res.send('mesh created');
  })
})


//route for user to check off a task
// app.put('/api/:taskTitle', (req, res) => {
//   //query MongoDB to update that task of goal of user
//   console.log(`trying to update ${req.params.taskTitle}`)
//   console.log(`of user ${req.session.passport.user}`)
//   User.findOneAndUpdate({
//     _id: req.session.passport.user,
    
//     'tasks.taskTitle': req.params.taskTitle
//   },{
//     $set: {
//       "tasks.$.taskComplete": true

//     }
//   }, (err, foundUser) => {
//     if (err) throw err;
//     console.log('foundUser for task update is')
//     console.log(foundUser)
//     var newGoalObj = {
//       goalTitle: '', 
//       goalDue: '', 
//     };
//     var taskLeftBeforeUpdate = 0; 
//     for (var i = 0; i<foundUser.tasks.length; i++) {
//       if (foundUser.tasks[i].taskTitle && !foundUser.tasks[i].taskComplete) taskLeftBeforeUpdate ++;
//     }
//     //if there is only one task left before update
//     if (taskLeftBeforeUpdate === 1) {
//       //set user goal to blank obj / delete the goal
//       User.findOneAndUpdate({_id: req.session.passport.user},{
//         $set: {
//           "goal": {},
//           "tasks":[],
//           "gearLevel":  1
//         }
//       }, (err, doc) => {
//         console.log('whole goal completed')
//         res.json({
//           goalComplete: true
//         })
//       })
//     } else {
//       console.log('task checked off')
//       res.send('task checked off ')
//     }
//   })
// })
var tempUsersArr = [];  
for (var i = 1; i< 101; i++){
  tempUsersArr[i]={
    tempID: i,
    needToRedirect: false,
    action: ''
  }
}

var tempCounter = 1;  
//route for server to respond if user is logged in
app.get("/api/loggedin", (req, res) => {
  console.log('is user logged in?')
  console.log(`--------logged in answer is ${isLoggedIn(req, res)}--------`)
  var tempUserObj = {};  
  if (!isLoggedIn(req, res)) {
    tempUserObj = tempUsersArr[tempCounter]  ;
  } else tempUserObj = null;
  tempCounter ++;  
  res.json({
    logged: isLoggedIn(req,res),
    tempUser: tempUserObj
  })
})

// app.get("/api/clientId", (req, res)=> {
//   // res.json(process.env.GOOGLE_CLIENT_ID);
//   if (process.env.PORT){
//     res.send(process.env.GOOGLE_CLIENT_ID)
//   } else {
//     var configAuth = require('./config/auth.js')
//     res.send(configAuth.googleAuth.clientID);
//   }
// })

//every other page goes to our index page
app.get('*', function (request, response){
  console.log('showing index page!');
  response.redirect('/');
})

//================================


app.listen(port, function() {
  console.log(`Server is running on port ${port}`);
});

//helper function to check if user is logged in
function isLoggedIn(req, res) {
    if (req.isAuthenticated()){
      return true;
    } else {
      return false
    }
}