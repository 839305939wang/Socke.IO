/**
 * Created by Administrator on 2016/9/2.
 */
var online=[];
var socketArr=[];
var util = require('util');
var progress = {finish: false};
var EventEmitter = require('events').EventEmitter;
var event = new EventEmitter();
var so=null;
var sio = null;
event.on('fileUpload', function(percent) {
    getSocket();
    console.log("上传百分比:"+percent);
    sio.sockets.emit("progress", percent);
});

exports.connect = function(io){
    sio=io;
    io.on('connection',function(socket){

        so=socket;
        exist(socket);
        transProgcess(socket);
        socket.on('getMsg',function(msg){
            console.log('服务器收到信息:'+msg);
            handelMsg(io,socket,msg);
        });
        socket.on("setName",function(data,callback){
            console.log("this.id:"+this.id)
            setClientName(data.name,this);
            console.log("设置用户名字:"+data.name);
            var msg = {
                name:data.name,
                socket_id:this.id
            }
            console.log("用户"+msg.name+"上线了");
            callback(this.id);
            socket.broadcast.emit("online",{name:msg.name,"socket_id":this.id});
            socket.emit("users_list",{users:online});
            online.forEach(function(obj,index){
                console.log("用户"+index+"["+obj.name+"]"+"--id:"+obj.socket);
            })
        })
        socket.on('disconnect',function(){
             deletUser(socket);
        });
    });
}


var getTime=function(){
    var date = new Date();
    return date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
}
/*
判断该用户是否已经登录
*/
 function exist(socket){
     var client = {
         name:"",
         socket:socket.id
     }
                socket.emit('open');  //通知客户端连接服务器成功
                socketArr.push(socket.id);
                online.push(client);
 }
/**
 * 删除在线用户
 */
function deletUser(socket){
    for(var i=0;i<online.length;i++){
        (function(i){
           var obj = online[i];
         if(obj.socket==socket.id){
                console.log("第"+i+"位用户["+obj.name+"]退出系统");
                  online.splice(i,1);
                  var msg = {
                      name:obj.name,
                      id:obj.socket.id
                  }
                  socket.broadcast.emit("exit",msg);
            }else{
                console.log("该用户不在在线人员列表");
            }
        })(i)
    }
}
/**
 * 设用户名字
 */

function setClientName(name,socket){
    online.forEach(function(obj,index){
        if(obj.socket==socket.id){
            obj.name=name;
        }
    })
}
/**
 * 收到信息处理信息
 */
function handelMsg(io,socket,msg){
    var msg={
        type:msg.type,
        name:msg.from,
        msg:msg.msg,
        time:getTime(),
        to:msg.to,
        toName:msg.toName,
        from:socket.id
    }
    if(socketArr.indexOf(socket.id)!=-1){
        sendMsg(io,msg,socket);
    }else{
        setClientName(msg.name,socket);
        sendMsg(io,msg,socket);
    }
}
/**发送信息*/
function sendMsg(io,msg,scoket){
    if(msg.type=="0"){
        console.log("发给:"+msg.to);
        io.sockets.connected[msg.to].emit("getMsg",msg);
    }else if(msg.type=="1"){
        io.sockets.connected[msg.to].emit("getMsg",msg);
    }else{
        io.sockets.emit("getMsg",msg);
    }
}
exports.setProgress = function(pro,finish){
    console.log("设置参数");
    progress.percent = pro;
    progress.finish=finish;
}
/**
 * 文件卡开始上传
 */
exports.fileupload = function(percent){
    event.emit("fileUpload",percent);
}

/**
 * h回传文件上传进度
 */
function　transProgcess(socket){

}

/**
 * 选择是哪个soccket
 */
function getSocket(name){
    //var socket=null;
    online.forEach(function(obj,index){
        if(obj.name==name){
            so = sio.sockets.adapter.rooms[obj.socket];
        }
    })
}
