/**
 * Created by leticia on 2018/2/28.
 */
window.onload = function () {
    var chat = new Chatroom();
    chat.init();

};
var ctllog = console.log.bind(console);

function Chatroom(){
    this.socket = null;
};

    Chatroom.prototype.init = function () {//在原型对象中初始化方法，当不同实例调用的时候，this指向该实例！
    this.socket = io.connect();
    var socket = this.socket,
        log = document.getElementById("logname"),
        name = document.getElementById("myname"),
        that = this,

        tips = document.getElementById("tip");

    socket.on('connect',function(){

        // var log = document.getElementById("logname"),
        //     name = document.getElementById("myname"),
        //     tips = document.getElementById("tip").innerHTML;
        tips.innerHTML = "请输入你的昵称";
        log .style.display = 'block';
        log .focus();

        document.getElementById("nameup").addEventListener('click',function(){
            var username = name.value.trim();
            if(username.length != 0) {
                //发起一个事件到server
                socket.emit('login', username);
            }//no space headandtail
            else{
                name.value = '';
                tips.style.color = 'red';
                tips.innerHTML="昵称不可为空，请输入正确的昵称!"; //如何提示？？？
                //ctllog(document.getElementById('tip'));
                name.focus();}



        },false);


    });
    socket.on('nameused',function(){
        tips.style.color ='red';
        tips.innerHTML = "昵称已经被占用，请更换昵称！";
        name.focus();
    });
    socket.on('logsuccess',function () {
        tips.innerHTML = '登录成功！';
        document.getElementById('logpage').style.display = 'none';
        document.getElementById('enter').focus();
        document.title = name.value + '\'s chat'; //使用innerhtml不行？？  要使用TagName[0]...

        
    });
        //后台消息
    socket.on('online',function(username,allusername,inout){
        var state = (inout > 0 ? '进来了': '离开了'),
           // his = document.getElementById('history'),
            totalnums = document.getElementById('totalnum');
            // sysmsg = document.createElement('p');
        // sysmsg.style.color = 'blue';
        // sysmsg.innerHTML = username + state + '.';
        // his.appendChild(sysmsg);
        that.showmsg(username,state,1);
        totalnums.innerHTML = '在线好友：'+ allusername.length + '人';
        console.log(all)



    });
        // socket.on('disconnect',function(){
        //     socket.emit('')
        // })
        //不监听disconnect事件，因为该socket 不连接后，就关闭了页面了。

        var sendbtn = document.getElementById('sendbt'),
            sendcontent = document.getElementById('enter'),
            content;
        sendbtn.addEventListener('click',function(){
            if (sendcontent.value.trim().length <= 0) {
                sendcontent.placeholder = '输入不能为空';//其他的调用了send会不会都变成不为空？？
                sendcontent.focus();
            } else {
                content = sendcontent.value;
                sendcontent.value = '';
                that.showmsg(name.value,content,2);
                socket.emit('sendM',content);


            }

        },false);

        socket.on('recM',function(hisname,msg) {
            that.showmsg(hisname,msg,0);//必须用其他变量为什么？that


        });//收到其他用户的消息



    };

    Chatroom.prototype.showmsg = function(names,msg,role){
        var words = document.createElement('p'),
            sentmsg = document.getElementById('history'),
            date = new Date();
        words.innerHTML = names + '['+ date.toDateString()+ ' '+ date.toLocaleTimeString()+ ']' + ':'+'<br>'+ msg;
        words.style.fontSize = '15px';
        switch(role){
            case 0://其他用户消息
                words.style.color = 'green';
                words.style.textAlign = 'left';
                break;
            case 1://后台消息
                words.style.color = 'grey';
                words.style.textAlign = 'center';
                words.style.fontSize = '10px';
                words.innerHTML = '['+ date.toDateString()+  ' '+ date.toLocaleTimeString()+ ']' + names + msg+'.';
                break;
            case 2://本人消息
                words.style.color = 'black';
                words.style.textAlign = 'right';
                break;
        }
        sentmsg.appendChild(words);



    };
    //atroom.prototype.showdetail=







