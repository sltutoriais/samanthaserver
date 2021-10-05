var socket = io() || {};
socket.isReady = false;

window.addEventListener('load', function() {

	var execInUnity = function(method) {
		if (!socket.isReady) return;
		
		var args = Array.prototype.slice.call(arguments, 1);
		if(unityInstance!=null)
		{
		  unityInstance.SendMessage("NetworkManager", method, args.join(':'));
		}
		
	};
	socket.on('JOIN_SUCCESS', function(id,name) {
				      		
	  var currentUserAtr = id+':'+name;
	  if(unityInstance!=null)
		{
		 unityInstance.SendMessage ('NetworkManager', 'OnJoinGame', currentUserAtr);
		}
	  
	});

	
	socket.on('SPAWN_PLAYER', function(id,name) {
				      		
	  var currentUserAtr = id+':'+name;
      if(unityInstance!=null)
		{
		 unityInstance.SendMessage ('NetworkManager', 'OnSpawnPlayer', currentUserAtr);
		}
	 
	});
	
	socket.on('UPDATE_MOVE', function(id,position) {
				      		
	  var currentUserAtr = id+':'+position;
	   if(unityInstance!=null)
		{
		unityInstance.SendMessage ('NetworkManager', 'OnUpdateMove', currentUserAtr);
		}
	 
	});
	
	
 socket.on('UPDATE_ANIMATOR', function(id,movement) {
				      		
	  var currentUserAtr = id+':'+movement;
	if(unityInstance!=null)
		{
		  unityInstance.SendMessage ('NetworkManager', 'OnUpdateAnim', currentUserAtr);
		}
	 
	});	

 socket.on('USER_DISCONNECTED', function(id) {
				      		
	  var currentUserAtr = id;
	  if(unityInstance!=null)
		{
		 unityInstance.SendMessage ('NetworkManager', 'OnUserDisconnected', currentUserAtr);
		}
	 
	});		


});//END_WINDOW.ADDEVENTLISTENER

