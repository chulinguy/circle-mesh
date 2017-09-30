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
console.log(mongoose.version)

db.on('error', function(error) {
  console.log('Mongoose Error: ', error);
});

db.once('open', function() {
  console.log('Mongoose connection successful.');
});

//SERVER LOGIC

//Linkedin passport
app.get('/auth/linkedin/create/:tempID', function(req, res, next){
  console.log('CHANGING NEED TO REDIRECT');
  var parsedTempID = parseInt(req.params.tempID);
  tempUsersArr[parsedTempID].needToRedirect = true;
  tempUsersArr[parsedTempID].action = "form";
  tempIDTracker = parsedTempID;
  // console.log("tempUserArr is")
  // console.log(tempUsersArr)
  next();
},  
  passport.authenticate('linkedin')    
);

app.get('/auth/linkedin/mesh/:tempID/:meshID/:meshName/:meshEndTimeMilliSec', function(req,res,next){
  console.log('CHANGING NEED TO REDIRECT');
  var parsedTempID = parseInt(req.params.tempID);
  tempUsersArr[parsedTempID].needToRedirect = true;
  tempUsersArr[parsedTempID].action = `mesh/${req.params.meshID}`;
  tempUsersArr[parsedTempID].meshName = req.params.meshName;
  tempUsersArr[parsedTempID].meshEndTimeMilliSec = req.params.meshEndTimeMilliSec;
  tempIDTracker = parsedTempID;
  next();
},
  passport.authenticate('linkedin')
)

app.get('/auth/linkedin/callback', function(req, res, next) {
  passport.authenticate('linkedin', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/auth/linkedin'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      // console.log('============req.session in the login callback')
      // console.log(req.session)
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
      userObj.needToRedirect = tempUsersArr[parsedTempID].needToRedirect;
      userObj.redirectAction = tempUsersArr[parsedTempID].action;
      userObj.meshName = tempUsersArr[parsedTempID].meshName;
      userObj.meshEndTimeMilliSec = tempUsersArr[parsedTempID].meshEndTimeMilliSec;
      // console.log("tempUserArr is")
      // console.log(tempUsersArr)
    }
    res.json(userObj);
  })

})

var tempUsersArr = [];  
for (var i = 1; i< 200; i++){
  tempUsersArr[i]={
    tempID: i,
    needToRedirect: false,
    action: '',
    passportID: '',
    meshName: '',
    meshEndTimeMilliSec: ''
  }
}

var tempCounter = 1;  
//route for server to respond if user is logged in
app.get("/api/loggedin", (req, res) => {
  console.log(`is User logged in?? ${isLoggedIn(req, res)}`)
  // console.log(req)
  
  // var redirectCheck = false;
  if (isLoggedIn(req, res)) {
    var tempUserArrFiltered = tempUsersArr.filter((v)=>(v.passportID===req.session.passport.user));
    if (tempUserArrFiltered.length > 0){
      var foundTempUserID = tempUserArrFiltered[0].tempID
      var sentTempID = foundTempUserID; 
    } else var sentTempID = 0; 
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
  // console.log("tempUserArr is")
  // console.log(tempUsersArr)
  res.end();
})

//user joining a mesh
app.post('/api/joinMesh/:meshID/', (req, res)=>{
  console.log(`user trying to join mesh ${req.params.meshID}`)
  Mesh.findByIdAndUpdate(req.params.meshID
    ,{
    $addToSet: {
      users: req.session.passport.user
    }
  },(err, mesh) => {
    if (err) throw err;
    // console.log(mesh)
    Mesh.findById(req.params.meshID).populate("users").lean().exec((err2, mesh2) => {
      console.log(mesh2.users)
      if (err2) throw err;
      res.json(mesh2)
    })

  })
})

app.get('/api/meshUsers/:meshID', (req, res)=>{
  console.log(`getting all otherusers in mesh ${req.params.meshID}`)
  Mesh.find({_id: req.params.meshID}).populate("users").exec( (err,mesh)=>{
    if (err) throw err;
    // console.log(mesh)
    if(mesh.length === 0){res.end()}
    else {var filteredMeshUsers = mesh[0].users.filter((v)=>(v._id !==req.session.passport.user))
    res.json(filteredMeshUsers)}
  })
})

//route for user to create a mesh
app.post('/api/mesh', (req, res) => {
  var today = new Date;
  console.log('REQ.BODY of mesh post', req.body);
  var convertedLocalDateArr = req.body.meshDate.split("-");
  convertedLocalDateArr [1] = parseInt(convertedLocalDateArr [1]) - 1 ; 
  if (req.body.meshTime.slice(-2) === 'AM'){
    if (req.body.meshTime.indexOf(' ') === 1){
      var localHour = parseInt(req.body.meshTime.slice(0, 1));
    } else var localHour = parseInt(req.body.meshTime.slice(0, 2));
  } else if (req.body.meshTime.slice(-2) === 'PM'){
    if (req.body.meshTime.indexOf(' ') === 1){
      var localHour = 12 + parseInt(req.body.meshTime.slice(0, 1));
    } else var localHour = 12 + parseInt(req.body.meshTime.slice(0, 2));
  }
  // console.log('localHour is', localHour);
  var duration = parseInt(req.body.meshDuration);
  var meshStartTimeLocal = new Date(...convertedLocalDateArr, localHour);
  var meshEndTimeLocal = new Date(...convertedLocalDateArr, localHour + duration);
  // console.log('meshStartTimeMilliSec is', meshStartTimeLocal.toString())
  // console.log('meshStartTimeMilliSec is', meshStartTimeLocal.getTime())
  // console.log('meshEndTimeMilliSec is', meshEndTimeLocal.getTime())
  Mesh.create({
    meshName: req.body.meshName,
    meshCreatedAtTime: today.toString(),
    meshStartTime: meshStartTimeLocal.toString(),
    meshStartTimeMilliSec: meshStartTimeLocal.getTime(),
    meshEndTime: meshEndTimeLocal.toString(),
    meshEndTimeMilliSec: meshEndTimeLocal.getTime(),
    meshCoordinate: req.body.meshCoordinate,
    meshCreatedCoordinate: req.body.meshCreatedCoordinate,
    meshTime: req.body.meshTime
  }, (err, data) => {
    if (err) throw err;
    console.log('new mesh created');
    res.end();
  })
})

//route to retrieve meshes
app.get('/api/meshes', (req, res) => {
  var rightNow = new Date; 
  var rightNowMilliSec = rightNow.getTime();
  console.log(`sending ongoing meshes for user ${req.session.passport.user}`)
  Mesh.find({
    meshStartTimeMilliSec:{$lt: rightNowMilliSec},
    meshEndTimeMilliSec:{$gt: rightNowMilliSec}
  }).exec((err, data)=> {
    if (err) throw err; 
    // console.log(data[0].users)
    // var massagedData = data;
    // massagedData.map((v1) => {
    //   return v1.users.map((v) => {
    //     return {
    //       firstName: v.firstName,
    //       photo: v.photo,
    //       linkedinURL: v.linkedinURL,
    //       job: v.job
    //     }
    //   })
    // })
    // console.log(massagedData[0].users)
    // res.json(massagedData)
    res.json(data)
  })
})

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