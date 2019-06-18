var express = require('express');
var app = express();
var uuidv1 = require('uuid/v1');

app.set('view engine', 'ejs');
app.use(express.static('public'));

var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port);
});

app.get('/', function (req, res) {
    res.render('index.ejs');
});

var io = require('socket.io')(server);
io.on('connection', (socket) => {
    var myid= uuidv1();
    console.log("New username Connected");
    socket.on('new_message', (data) => {
        io.sockets.emit('new_message', { message: data.message, usernamename: socket.usernamename });
    })
    socket.on("nickname", (data) => {
        socket.usernamename = data.usernamename
        socket.broadcast.emit("user_connected", "user with id " + myid + "connected");
        
    })

    
});

