/*
*@autor: Rio 3D Studios
*@description:  java script file that works as master server of  Game
*@date: 05/10/2021
*/
var express = require('express'); //import express NodeJS framework module

var app = express(); // create an object of the express module

var http = require('http').Server(app); // create a http web server using the http library

var io = require('socket.io')(http); // import socketio communication module


app.use("/public/TemplateData",express.static(__dirname + "/public/TemplateData"));

app.use("/public/Build",express.static(__dirname + "/public/Build"));

app.use(express.static(__dirname+'/public'));


var sockets = {}; // to storage sockets


var clientLookup = {};


var clients			= [];  // to storage clients





//open a connection with the specific client
io.on('connection', function(socket){

 console.log('A user ready for connection!');//prints in the  nodeJS console


  var current_player;


/**
   * Gets fired when a user wants to create a new room.
   */
 socket.on('JOIN_ROOM', function(_data){

   var pack = JSON.parse(_data);
  // fills out with the information emitted by the player in the unity
  current_player = {

    name : pack.name,
          id: socket.id,
	};

  console.log("[INFO] player " + current_player.id + ": logged!");
   
  sockets[current_player.id] = socket;//add curent user socket
  
  clientLookup[current_player.id] = current_player;
  
  clients.push(current_player);//add current_player in clients
  
  console.log ("[INFO] Total players: " + Object.keys(clientLookup).length);
  

  socket.emit("JOIN_SUCCESS",current_player.id,current_player.name);
  

  
    //spawn all connected clients for currentUser client 
     clients.forEach( function(i) {
		    if(i.id!=current_player.id)
			{ 
			  
		      //send to the client.js script
		      socket.emit('SPAWN_PLAYER',i.id,i.name);
			  
		    }//END_IF
	   
	  });//end_forEach
  
     // spawn current_player client on clients in broadcast
     socket.broadcast.emit('SPAWN_PLAYER',current_player.id,current_player.name);
  
	

  });

 
socket.on("MOVE",function(_data){

var pack = JSON.parse(_data);



 var data = {
   id:current_player.id,
   position:pack.position
 };
 
 console.log("receive move: "+data.position);


 //broadcast emit
 socket.broadcast.emit('UPDATE_MOVE',data.id,data.position);

});//END_SOCKET.ON



socket.on('ANIMATION',function(_data){

 var pack = JSON.parse(_data);

 //broadcast emit
  socket.broadcast.emit('UPDATE_ANIMATOR',current_player.id,
                                            pack.movement);

});//END_SOCKET.ON

socket.on('disconnect', function ()
	{
        console.log("User  has disconnected");
	    
	      if(current_player)
		    {
		       current_player.isDead = true;
		       socket.broadcast.emit('USER_DISCONNECTED', current_player.id);
			   
			   for (var i = 0; i < clients.length; i++)
		       {
			     if (clients[i].id ==  current_player.id) 
			     {
			       clients[i].isDead = true;
				   clients.splice(i,1);
			     };
		       };

		       
		       delete sockets[current_player.id];
		       delete clientLookup[current_player.id];
			     
        }//END_IF
    });//END_SOCKET.ON

});//END_IO.ON


http.listen(process.env.PORT ||3000, function(){
	console.log('listening on *:3000');
});

console.log('------- NodeJS server is running -------');
