var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var d3 = require('d3'); // Not working?


var users = {}; // hold users connect to chat


// ----------- Routes ----------- //
app.get('/', function(req, res){
    res.sendFile(__dirname + '/chat.html');
});

app.get('/view', function(req, res) {
    res.sendFile(__dirname + '/chart.html');
});


// ----------- Events ----------- //
io.on('connection', function(socket){

    // Connect event
    socket.on('join', function(name) {
        users[socket.id] = name;
        console.log('connection');
        // TODO: get user name and send to chart.html
        socket.broadcast.emit('new connection', {
            name : users[socket.id],
            msg: users[socket.id] + ' connected'
        });
    });

    // Disconnect event
    socket.on('disconnect', function(){
        delete users[socket.id];
        socket.broadcast.emit('disconnection', 'a user disconnected');
    });

    // Chatting event
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        // TODO: send message with username to chart.html
        io.emit('chat message', {
            msg: msg,
            user: users[socket.id]
        });
    });
});


// ----------- Initialization ----------- //
http.listen(3000, function(){
    console.log('listening on *:3000');
});