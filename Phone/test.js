/**
 * Created by Administrator on 2016/9/30.
 */
/**
 * Created by Administrator on 2016/9/2.
 */
var express=require('express');
app=express(),
    http=require('http').Server(app),
    io=require('socket.io')(http),
    Router = express.Router(),
    router = require('./js/index.js'),
    s = require("./js/socket.js"),
    util = require('util'),
    formidable = require('formidable'),
    fs = require('fs');
app.use(express.static("./public"))
s.connect(io);
app.post("/tranFile",function(req,res){
    var form = new formidable.IncomingForm();
    form.uploadDir = 'public/upLoad';
    form.parse(req, function(err, fields, files) {
        console.log("files:"+util.inspect(files)+"---:fields:"+util.inspect(fields));
        fs.rename(files.file.path,'public/upLoad/'+files.file.name,function(){
            console.log("改名成功");
        });
        res.end('upLoad/'+files.file.name);
    });

    form.on('progress', function(bytesReceived, bytesExpected) {
        var percent = Math.floor(bytesReceived / bytesExpected * 100);
        console.log("百分比"+percent+"%");
        s.fileupload(percent);
    });
});
http.listen(3100,function(){
    console.log("短信平台启动成功");
});


