var phoneNum = null;//new Date().getTime();//名字
var to=null;//发送信息的目标
var id=null;//socket.id
$(function(){
	//$("#showMsg").hide();
	var f= "wang";
	console.log($("li[user_name='"+f+"']").length+"-------------")
	             init();
		 	//	$(".page1").hide();
		 		var send = $("#send").on("click",function(){
		 			var msg = $("#msg").val();
					var msg_body=$("#"+name);
					$("#msg").val("");
		 			if(msg==""){
		 				console.log("null")
		 				return;
		 			}else{
		 				var item = "<div class='msg'><img class='msg-head img-circle' src='user1-128x128.jpg'><div class='msg-text'>"+msg+"</div></div>";
		 				//msg_body
		 				msg_body.append(item);
						sendMsg(msg,"0");
		 				//msg_body.append(item1);
		 			}
		 			
		 		});

});
var name=null;
function init(){
	$(".page").hide();
	$(".page0").show();
	$(".back_main").on("click",function(){
		showPage("page0")
	})
	addLiClock();
	initLogin();
	transFile();
}
/**
 * 文件传输
 */
var transType=null;
var flag=null;
var loginFlag=false;
function transFile(){
	$("input[type='file']").on("change",function(){
		console.log("选中文件");
		console.log("发送的目标:"+name);
		var files = document.getElementById("file").files
		console.log("文件:"+files.length);
		for(var i = 0;i<files.length;i++){
			console.log("file name:"+files[i].name+"--file:"+files[i]);
			if(files[i].name.toLowerCase().indexOf(".jpg")!=-1||files[i].name.toLowerCase().indexOf(".png")!=-1){
				transType="pic";
			}else{
				transType = "file";
			}
			var fr = new FileReader();
			fr.readAsDataURL(files[i]);
			fr.onload = function(e) {
				flag= new Date().getTime();
				console.log("--------------file show:"+name+"--:"+$("#"+name)+"id:"+$("#"+name).attr("id"));
				var  item1 = "<div class='msg' style='height:90px;width: 81px'><img class='msg-text "+flag+"' height='80px' width='80px'>"+
					  "<div class='progress' style='height:5px;width: 75px'><div class='progress-bar  progress-success' id='"+flag+"' style='width: 20%;'></div></div>"+
					  "<img class='msg-head img-circle' src='user3-128x128.jpg'></div>";
				$("#"+name).append(item1);
				$("."+flag).attr("src",e.target.result);
			};
		}
		$("#fileForm").ajaxSubmit({
			type:'post',
			url:'/tranFile',
			data:{tran:name},
			success:function(data){
				console.log(data);
				sendMsg(data,1);
				/*if(transType=="pic"){
					var
				}*/
			},
			error:function(XmlHttpRequest,textStatus,errorThrown){
				console.log(XmlHttpRequest);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
		$("#showMsg").show();
		$(".showMore").hide();
	})
}
function initLogin(){
	$("#login_form").submit(function(){
		if($("#username").val()==""){
			alert("用户不能为空");
			return false;
		}else{
			initSocket();//连接socket.io
			phoneNum=$("#username").val();
			socket.emit("setName",{name:phoneNum},function(data){
				id=data;
				console.log("用户的socket.id:"+id);
				showPage("page2");
				loginFlag=true;
			});

			return false;
		}
	})
}

function addLiClock(){
	$("#msg_list>li").on("click",function(){
		console.log("点击事件")
		to = $(this).attr("socket_id");
		name = $(this).attr("user_name");
		console.log(name);
		showPage("page1");
		$(this).find("span").remove();
		$("#user").html(name);
		var msgList=localStorage.getItem($(this).attr("user_name"))
		var li = $(this);
		if(msgList=="undefined"||msgList==null||msgList==""){

		}else{
			msgList = msgList.split(",");
				msgList.forEach(function(obj,index){
					var item1 = "<div class='msg'><div class='msg-text msgO'>"+obj+"</div><img class='msg-head img-circle' src='user3-128x128.jpg'></div>";
					$("#"+name).append(item1);
					console.log("添加历史信息:"+$("#"+name).length);
				});
			localStorage.removeItem($(this).attr("user_name"))
		}
	})
}
function showPage(page){
	$(".page").not("."+page+"").hide();
	if(page=="page1"){
		console.log("创建消息页:"+($("#"+name).length)+"--name:"+name+"--"+($("#"+name)=="undefined"))
		if($("#"+name).length==0){
			var item = " <div class='panel-body message-body' id='"+name+"'></div>"
			$(".message-body-list").append(item);
		}
		$(".message-body").hide().filter("#"+name).show();
	}
	console.log(page+"--"+(page=="page_login"))
	if(page=="page_login"){
		console.log("-----------------"+loginFlag)
		if(loginFlag){
			$(".page2").show();
			return;
		}
	}
	$("."+page).fadeIn();
}
var socket=null;
function initSocket(){
	var myName=false;
	socket= io.connect('http://localhost:3100');
	socket.on("users_list",function(data){
		console.log("收到在线人员列表:"+data.users.length);
		for(var i=0;i<data.users.length;i++){
			console.log(i+":"+data.users[i].socket+"--用户id:"+id)
			if(data.users[i].socket!=id){
				console.log("人员"+i+"name:["+data.users[i].name+"]");
				var li = "<li socket_id="+data.users[i].socket+" user_name="+data.users[i].name+"  class='list-group-item'><img src='user1-128x128.jpg' class='msg_t_p img-circle'>"+data.users[i].name+"</li>";
				$("#msg_list").append(li);

			}
		}
		addLiClock();
	});
	socket.on('open',function(){
		$('.net').html("网络连接成功");

	});
	socket.on("getMsg",function(data){
		if(data.type==0){
			var item1 = "<div class='msg'><div class='msg-text msgO'>"+data.msg+"</div>"+
				"<img class='msg-head img-circle' src='user3-128x128.jpg'></div>";
		}else if(data.type==1){
			var  item1 = "<div class='msg' style='height:90px;width: 81px'><img class='msg-text msgO' src='"+data.msg+"' height='80px' width='80px'>"+
				         "<img class='msg-head img-circle' src='user3-128x128.jpg'></div>";
		}

		//console.log("消息提醒:"+($("#"+data.name).length==0)+"name:"+data.toName);
		if($("#"+data.name).length==0){
			var num=1;
			var user = data.name;
			if(window.localStorage){
				var ml = localStorage.getItem(user);
				//console.log("msgs:"+ml+"--typeof:"+(typeof ml)+"--:"+(ml==null&&ml==""));
				if(ml==null||ml==""||ml=='undefined'){
					console.log("第一次");
					localStorage.setItem(user,[data.msg]);
				}else{
					var list = localStorage.getItem(user).split(",");
					localStorage.setItem(user,list.push(data.msg));
					console.log("添加到本 地存储["+user+"]中:"+data.msg);
				}
				//var list = localStorage.getItem(user);
				//console.log("list:"+list);
				num = localStorage.getItem(user).split(",").length;
			}
			var span = "<span class='badge pull-right' style='background:greenyellow;position: relative;top:10px;right:15px;'>"+num+"</span>"
			$("li[user_name="+data.name+"]").append(span);
			console.log("username_color:"+$("li[user_name='"+data.name+"']").length+"obj:"+"li[user_name='"+data.name+"']")
		}
		$("#"+name.replace("\/","")).append(item1);
		console.log("收到信息:"+data);

	});
	socket.on("exit",function(data){
		console.log(data+"离开")
		$("[user_name="+data.name+"]").remove();
	})
   socket.on("online",function(data){
	   console.log(data.name+"上线了");
	   var li = "<li socket_id="+data.socket_id+" user_name="+data.name+"><img src='user1-128x128.jpg' class='msg_t_p img-circle'>"+data.name+"</li>";
	   $("#msg_list").append(li);
	   addLiClock();
   });
	socket.on("progress",function(data){
		console.log("文件上传进度:"+data);
		$("#"+flag).css({width:data+"%"});
		console.log(flag+"进度条:"+$("#"+flag)+"--:"+$("#"+flag).length);
	});
}
/**
 * 发送消息
 **/
function sendMsg(msg,type){
		var json = {to:to,msg:msg,type:type,from:phoneNum,toName:name};
		socket.emit("getMsg",json);
}

/**
 * 发送文件
 */
function sendMore(){

}
/**
 *显示附加菜单
 */
function　showMore(){
   $("#showMsg").hide();
	$(".showMore").show();
}
