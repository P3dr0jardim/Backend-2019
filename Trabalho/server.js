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
const uuidv1 = require('uuid/v1');

var server = app.listen(port, function(){

    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s",host,port);
    fs.open('log.txt','a', function(err, fd){
        console.log("Ficheiro aberto");
    });
});

function readFile(fileName){
    var file = fs.readFileSync(fileName,'utf-8');
    return file;
}

function writeFile(fileName,text){
    fs.writeFileSync(fileName,text);
}
//Parte A Emaneul Abreu
//a
app.get('/parteA/a/',function(request,response){
    var file = readFile("photos.json");
    var json = JSON.parse(file);
    var resultado=[];
    for(x in json){
        resultado.push(json[x]);
    }
    response.send(resultado);
})
//b
app.post('/parteA/b/',function(request,response){
    var file = readFile("photos.json");
    var json = JSON.parse(file); 
    var id = uuidv1();
    var arraycomments = [];
    var arraytags = [];
    for(x in request.body.comments){
        arraycomments.push('"'+request.body.comments[x]+'"');
    }
    for(y in request.body.tags){
        arraytags.push('"'+request.body.tags[y]+'"');
    }
    var teste ='{"id":"'+id+'", "uploader":"'+request.body.uploader+'", "title" :"'+request.body.title+'", "description":"'+request.body.description+'", "size":'+request.body.size+', "url":"'+request.body.url+'", "likes":'+request.body.likes+', "dislikes":'+request.body.dislikes+', "comments":['+arraycomments+'], "tags":['+arraytags+']}';
    var testej = JSON.parse(teste);
    json[id]=testej;
    var jsonstr = JSON.stringify(json);
    writeFile("photos.json",jsonstr);
    response.send(json[id]);
})
//c
app.get('/parteA/c/:uploader',function(request,response){
    var up   = request.params.uploader;
    var file = readFile("photos.json");
    var json = JSON.parse(file);
    var resultado=[];
    for(x in json){
        if(up == json[x].uploader){
            resultado.push(json[x]);
        }
    }
    response.send(resultado);
})
//d
app.get('/parteA/d/:id',function(request,response){
    var id = request.params.id;
    var file = readFile("photos.json");
    var json = JSON.parse(file);
    json[id].likes += 1;
    var jsonstr = JSON.stringify(json);
    writeFile("photos.json",jsonstr);
    response.send(json[id]);
});
//e
app.post('/parteA/e/',function(request,response){
    var arraytags = request.body;
    var file = readFile("photos.json");
    var json = JSON.parse(file);
    var resultado = [];
    for(x in json){
        for(y in arraytags){
            if(json[x].tags.includes(arraytags[y])){
                resultado.push(json[x]);
                x++;
                break;
            }
        }
    }
    response.send(resultado);
});
//Parte B Pedro Jardim
//a
app.get('/parteB/a/:id',function(request,response){
    var id = request.params.id;
    var file = readFile("photos.json");
    var json = JSON.parse(file);
    response.send(json[id]);
});
//b
app.delete('/parteB/b/:id',function(request,response){
    var id = request.params.id;
    var file = readFile("photos.json");
    var json = JSON.parse(file);
    if(json[id]==null){
        response.send("Erro! Essa imagem não exise!");
    }else{
        delete json[id];
        var jsonstr = JSON.stringify(json);
        writeFile("photos.json",jsonstr);
        response.send("Deleted.");
    }
});
//c
app.get('/parteB/c/:id',function(request,response){
    var id = request.params.id;
    var file = readFile("photos.json");
    var json = JSON.parse(file);
    json[id].dislikes += 1;
    var jsonstr = JSON.stringify(json);
    writeFile("photos.json",jsonstr);
    response.send(json[id]);
});
//d
app.post('/parteB/d/:id',function(request,response){
    var id = request.params.id;
    var comment = request.body.comments;
    var file = readFile("photos.json");
    var json = JSON.parse(file);
    json[id].comments.push(comment);
    var jsonstr = JSON.stringify(json);
    writeFile("photos.json",jsonstr);
    response.send(json[id]);
})
//e
app.get('/parteB/e/',function(request,response){
    var file = readFile("photos.json");
    var json = JSON.parse(file);
    var resultado = [];
    for(x in json){
        resultado.push(json[x]);
    }
    var ordenado = resultado.sort(function(c1, c2){
        if(c1.likes>c2.likes){
            return 1;
        }else{
            return -1;
        }
    });
    response.send(ordenado);
})