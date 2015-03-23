var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/draw.html')
})

app.get('/observe', function (req, res) {
    res.sendFile(__dirname + '/observer.html')
})

// A user connects to the server (opens a socket)
io.sockets.on('connection', function (socket) {

    socket.on('drawCircle', function(data, session) {
        socket.broadcast.emit('drawCircle', data);
    })

});



// ----------- Initialization ----------- //
http.listen(3000, function(){
    console.log('listening on port:3000');
});