# Socke.IO
this is a project about Scoket.io 
介绍：
   这是一个关于socket.io 是联系demo，模拟手机短信
功能：
   1.目前实现了一对一聊天,文字，图片传输
   2. 未读消息提示
 缺陷：
   1.界面 简单
   2.未读消息多条消息时，有问题，没来得及 修改，希望 有兴趣的coding可以改一下
   
   
   ---
   var fs=require('fs');
var file="./map.json";
var newfilepath = './newMap1.json';
var result=JSON.parse(fs.readFileSync(file));
var org = result.features;
    for(item in org){
      //console.log('length:',item)
      var coor = org[item].geometry.coordinates
       //console.log(coor.length);
      /* if(coor.length>1){
         coor.splice(1,(coor.length-1));
       }*/
      for(index in coor){
          //console.log(index,':',coor[index]);
          var obj = coor[index];
        //  console.log(obj)
          for(key in obj[0]){

               if(key%2==0){
                 console.log('key:',key)
                  obj[0].splice(key,1);
               }
          }
      };
    };

    for(item in org){
      //console.log('length:',item)
      var coor = org[item].geometry.coordinates
      // console.log()
    }

    fs.writeFileSync(newfilepath, JSON.stringify(result));
    console.log('重写完成！')

   ---
