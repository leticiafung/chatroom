/**
 * Created by leticia on 2018/2/28.
 */
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    allusername = [];
    comgo = 1;

app.use('/',express.static(__dirname + '/chatroom'));//路径server在chatroom外
server.listen(8888);

io.on('connect',function(socket){
    console.log('connect succeed!');
    socket.on('login',function (username) {
        if(allusername.indexOf(username) > -1)
        {

            socket.emit('nameused');

        }
        else{
            allusername.push(username);
            socket.emit('logsuccess');
            socket.name = username;
            socket.basenum = allusername.length - 1;
            comgo = 1;
            io.sockets.emit('online',username,allusername,comgo);//来是1离开是0

        }

    })

    socket.on('disconnect',function(){
            allusername.splice(socket.basenum, 1);
            comgo = 0;
            //通知除了自己以外的人!!!!
            socket.broadcast.emit('online',socket.name,allusername,comgo);

    })
    socket.on('sendM',function(content){//接收到发来的消息
        socket.broadcast.emit('recM',socket.name,content);

    })



})



