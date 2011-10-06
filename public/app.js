var express = require('express');

var app = module.exports = express.createServer();

var io = require('socket.io').listen(app);

app.configure( function(){
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({dumpExceptions:true, showStack:true}));
});

//start listening on the port given to me by Cloud9IDE
app.listen( process.env.C9_PORT );
console.log("Express server is listening on port %d in %s mode",
    app.address().port, app.settings.env);
    
// =================== SOCKETS ======================

var clients = [];
io.sockets.on('connection', function(socket) {
    
    clients.push(socket);
    
    socket.emit('message', {
        time: new Date().toLocaleTimeString(),
        person: 'Chat server',
        message: 'Welcome to chat server'});
        
    // install our handlers
    socket.on('message', function ( data ){
        
        data.time = new Date().toLocaleTimeString();
        for (var i = 0; i < clients.length; i++){
            clients[i].emit('message', data);
        }
    });

    socket.on('typing', function ( data ){
        for (var i = 0; i < clients.length; i++){
            clients[i].emit('typing', data);
        }
    });

    
    
});