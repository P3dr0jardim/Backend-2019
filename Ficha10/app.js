// require and instantiate express
const express = require('express');
const uuid = require("uuid/v1")
const app = express();
const multer  = require('multer');
const path=require('path');
const fs=require('fs');
var today = new Date();

function writelog(data){
    console.log(data)
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    data+=" "+dateTime+"\n";
    fs.appendFile('logs/logs-'+date+'.txt', data, (err) => {
        if (err) throw err;
    });
}



app.set('view engine', 'ejs'); // set up ejs for templating

//middlewares
app.use(express.static('public'));

// express server
var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port);
});

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname));
    }
  });
   
  const upload = multer({ storage: storage,
     limits:{fileSize:100000},
     fileFilter:function(req,file,cb){
         checkFileType(file,cb)
     } }).single('myImage');

    function checkFileType(file,cb){
      const filetypes= /jpeg|jpg|png|gif/;
      
      const extname=filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype=filetypes.test(file.mimetype);

      if(mimetype && extname){
          return cb(null,true);
      }else{
          cb('Error: Images Only!');
      }
    }



// route
app.get('/', function (req, res) {
    res.render('index.ejs');
});

app.post('/upload',(req,res)=>{
    upload(req,res,(err) =>{
        if(err){
          res.render('index.ejs',{
              msg:err
          }) ; 
        }else{
           if(req.file == undefined){
               res.render('index.ejs',{
                   msg:'Error: No File Selected!'
               });
           }else{
               res.render('index.ejs',{
                   msg:'File Uploaded!',
                   file:`uploads/${req.file.filename}`               });
           }
        }
    });
});


var io = require('socket.io')(server);

// Registar o evento Connection

io.on("connection", (socket) => {
    socket.username = uuid();
    writelog("User "+socket.username+" Connected");
    socket.on("send_message", (data) => {
        io.sockets.emit('broadcast_message', {
            message: data.message,
            username: socket.username
        });
    });
    socket.on("user_connected", (data) => {
        io.sockets.emit('broadcast_user', {
            username: socket.username
        });
    });

    socket.on("update_name", (data) => {
        io.sockets.emit("broadcast_updated_name", {
            old_user: socket.username,
            username: data.name,
        })
    });
    socket.on('userList',(userList,socketname)=>{
        if($scope.socketname===null){
            $scope.socketname=socketname;
        }
        $scope.userList=userList
    });

    socket.on("disconnect", (data) => {
        writelog("User "+socket.username+" disconnected");
        io.sockets.emit('broadcast_user_disconnect', {
            username: data.username
        });
    })
});