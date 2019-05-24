var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require("fs");

//include directory public
app.use(express.static(__dirname + '/public'));

//send index.html on request
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//read general data form JSON-Files
drives = ["Drive A", "Drive B", "Drive C", "Drive D", "Drive F", "Drive E"]; // Available drives
data = [];
for(var i = 0; i<drives.length; i++) {
    var rawdata = fs.readFileSync("public/"+drives[i]+".json");
    var obj = JSON.parse(rawdata);
    var data_obj = {
      meanV: (obj.meanV*3.6).toFixed(1),
      meanS: obj.meanS.toFixed(1),
      duration: obj.duration.toFixed(1)
    };
    data.push({drive: drives[i], values: data_obj});
}

// get data for specific drive 
function getDrive(drive) {
  for(var i=0; i<data.length; i++) {
    if(data[i].drive===drive) return data[i].values;
  }
  console.log("Drive not found.");
}

var clients = 0;
io.on('connection', function(socket){
  clients+=1;
  console.log(clients+' user connected');
  socket.on('message', function(msg) {
    console.log(msg)
  })
  // send drives on connect
  socket.emit('drives', drives);
  // send general data on request
  socket.on('getSignleValues', function(msg) {
    // Get all single-values form data
    var data = getDrive(msg);
    socket.emit('singleValues_'+msg, data);
  });
  
  socket.on('disconnect', function(){
    clients-=1;
    console.log(clients+' user connected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});