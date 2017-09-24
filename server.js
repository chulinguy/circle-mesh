var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');
var path = require('path');
var mongoose = require('mongoose');
var logger = require("morgan");
var favicon = require('serve-favicon');
mongoose.Promise = Promise;

var router = express.Router();

//express server
var app = express();
var port = process.env.PORT || 3000;

//server middle-wares
app.use(express.static("public"));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(favicon(path.join(__dirname, 'public', 'assets','images','favicon.png')))
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
  var parsedTempID = parseInt(req.params.tempID);
  // console.log('I am a number?', parsedTempID)
  tempUsersArr[parsedTempID].needToRedirect = true;
  tempUsersArr[parsedTempID].action = "form";
  tempIDTracker = parsedTempID;
  console.log("tempUserArr is")
  console.log(tempUsersArr)
  next();
},  
  passport.authenticate('linkedin')    
);

app.get('/auth/linkedin/callback', function(req, res, next) {
  passport.authenticate('linkedin', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/auth/linkedin'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      console.log('============req.session in the login callback')
      console.log(req.session)
      tempUsersArr[tempIDTracker].passportID = req.session.passport.user
      return res.redirect('/');
    });
  })(req, res, next);
});

app.get('/auth/linkedin', passport.authenticate('linkedin'));

//for this user, get whole user obj
app.get('/api/user/:tempID',(req, res) => {
  var userToFind = '';  
  console.log('req session is')
  console.log(req.session)
  if (req.session.passport) userToFind = req.session.passport.user;
  User.findById(userToFind, (err, foundUser) => {
    // console.log('foundUser', foundUser);
    var userObj = {};
    userObj.user = foundUser;
    // console.log('userObj is (after assigning key user)')
    // console.log(userObj)
    var parsedTempID = parseInt(req.params.tempID);
    if (parsedTempID > 0){
      console.log('parsedtempID is', parsedTempID)
      var tempUserRedirectStatus = tempUsersArr[parsedTempID].needToRedirect;
      var tempUserRedirectAction = tempUsersArr[parsedTempID].action;
      // console.log("tempUserRedirect Status is ")
      // console.log(tempUserRedirectStatus)
      userObj.needToRedirect = tempUserRedirectStatus;
      userObj.redirectAction = tempUserRedirectAction;
      console.log("tempUserArr is")
      console.log(tempUsersArr)
    }
    res.json(userObj);
  })

})

var tempUsersArr = [];  
for (var i = 1; i< 5; i++){
  tempUsersArr[i]={
    tempID: i,
    needToRedirect: false,
    action: '',
    passportID: ''
  }
}

var tempCounter = 1;  
//route for server to respond if user is logged in
app.get("/api/loggedin", (req, res) => {
  console.log(`is User logged in?? ${isLoggedIn(req, res)}`)
  
  // var redirectCheck = false;
  if (isLoggedIn(req, res)) {
    var foundTempUserID = tempUsersArr.filter((v)=>(v.passportID===req.session.passport.user))[0].tempID;
    var sentTempID = foundTempUserID; 
  } else {
    tempCounter ++;
    var sentTempID = tempCounter;
  }  
  res.json({
    logged: isLoggedIn(req,res),
    tempID: sentTempID
  })
})

app.post('/api/turnOffRedirect/:tempID', (req, res) => {
  console.log('trying to turn off redirect')
  var found = tempUsersArr.filter((v)=>(v.passportID===req.session.passport.user))[0];
  found.needToRedirect = false; 
  console.log("tempUserArr is")
  console.log(tempUsersArr)
  res.end();
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