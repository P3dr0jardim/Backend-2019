const express = require('express');
const app = express();
const port = 8000;
var http=require('http');
const fs = require('fs');
var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

var server = app.listen(port, function(){

    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s",host,port);
    fs.open('log.txt','a', function(err, fd){
        console.log("Ficheiro aberto");
    });
});

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'ficha7'
});

app.get('/persons',function(request,response){
    connection.query('SELECT * from persons', function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    response.send(results);
    });
})

app.post('/persons',function(request,response){
    var firstname = request.body.firstname;
    var lastname = request.body.lastname;
    var profession = request.body.profession;
    var age = request.body.age;
    connection.query("INSERT INTO `persons` (`firstname`, `lastname`, `profession`, `age`) VALUES (?,?,?,?);",[firstname,lastname,profession,age], function (error, results, fields) {
    if (error) throw error;
    });
    response.send('firstname -> '+firstname+'\nlastname -> '+lastname+'\nprofession -> '+profession+'\nAge -> '+age)
})

app.delete('/persons',function(request,response){
    var id = request.body.id;
    connection.query("Delete from persons where id = ?;",[id], function (error, results, fields) {
    if (error) throw error;
    response.send('deleted');
    });
});

app.get('/persons/:id',function(request,response){
    var id = request.params.id
    console.log(id);
    connection.query('SELECT * from persons where id = ?;',[id], function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    response.send(results);
    });
})


app.get('/persons/:age/:profession',function(request,response){
    var age = request.params.age;
    var profession = request.params.profession;
    connection.query('SELECT * from persons where age = ? or profession = ?;',[age,profession], function (error, results, fields) {
    if (error) throw error;
    response.send(results);
    });
})