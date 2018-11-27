const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const fs = require('fs');

var port = normalizePort(process.env.PORT || '3000');

function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }

http.listen(port, function(){
    console.log("listen on port :: " + port);

    http.on('close', function(){
        console.log('server close');
    });
    
    http.on('error',function(){
        console.log('server error');
    });
});

app.get('/',(req,res,next)=>{
    res.sendFile(__dirname + '/index.html'),
    function (err,data){
        if(err){
            res.writeHead(500);
            return res.end("Error Loading index.html");
        }

        res.writeHead(200);
        res.end(data);
    }
})




//  on > 받을 때
//  emit > 보낼 때
const ioActive = (socket)=>{
    console.log('connnection!');
    
    socket.on('client_id',(id)=>{
        io.emit("Login_id", id);
        console.log("client_id : " + id);
    });

    socket.on('otherEvent',function(data){
        console.log(data);
    });

    socket.on('reconnect',function(){
        console.log("reconnection!");
    });

    socket.on('disconnect',function(){
        console.log("disconnection!");
    });
}

console.log("start"); 
io.on('connection', function(socket){
    ioActive(socket);

    socket.on('chat msg',(msg)=>{
        console.log('message : ' + msg);
        io.emit('chat msg', msg);
    });

});