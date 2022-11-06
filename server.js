var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var clients = 0;
var currentClient = "";

app.get('/', function(req, res){
    res.sendFile(__dirname + '/home.html');
});
users = {};
sockets = [];
io.on('connection', function(socket){
    clients++;

   

   // console.log(socket);
   console.log('A user connected');
   
   socket.on('setUsername', function(data){
      console.log(data); 
      currentClient = data;
      socket.username = data;
      sockets[socket.id] = socket;
      if(users[data]){
         socket.emit('userExists', data + ' username is taken! Try some other username.');
      } else {
         users[data] = socket.id;
         socket.emit('userSet', {username: data});
         io.sockets.emit('broadcast',{ description: 'A new user <b>' + data + '</b> connected!'});
      }
   });
   socket.on('msg', function(data){
      //Send message to everyone
      io.sockets.emit('newmsg', data);
   })
  // var userKey = getCurrentUser(socket.id);
   socket.on('disconnect', function () {
      clients--;
      var key = getCurrentUser(socket.id);
        if (key != null) {
            var disconnectedUser = key;
             delete users[key];
             io.sockets.emit('broadcast',{ description: '<b> '+ disconnectedUser + '</b>  disconnected!'});
        }
      
   });

});
function getCurrentUser(socketId) {
    var key = null;
    for (var k in users){
        if (users[k] === socketId){
            key = k;
            break;
        }
    }
    return key;
}

http.listen(3000, function(){
   console.log('listening on localhost:3000');
});