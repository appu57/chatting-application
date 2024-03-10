require('dotenv').config();

let mongoose = require('mongoose');
var session = require('express-session');
const User = require('./models/userRegisterModel');
var cors = require('cors');
const message = require('./models/chatModel');
const GroupMembers = require('./models/groupMembers');
const GroupChat = require('./models/groupChatModel');



const {session_secretkey} = process.env;

const url = 'mongodb://localhost:27017/chat-application';
const connect = mongoose.connect(url);

connect.then((connected)=>{
    console.log('Server connected to MongoDB database');
});

const app= require('express')();
const http = require('http');

const server=http.Server(app);

app.use(cors())
app.use(session({
    secret:session_secretkey,
    saveUninitialized:false,
    resave:false,
}));


const userRoute = require('./routes/userroutes');
const messageRoute = require('./routes/messageroutes');
const groupRoute =require('./routes/grouproutes');
const groupMemberRoute =require('./routes/groupMembers');
app.use('/user',userRoute);
app.use('/messages',messageRoute);
app.use('/groups',groupRoute);
app.use('/groupMembers',groupMemberRoute);

server.listen('3000',()=>{
    console.log('Server is running on port 3000');
});


const socket = require('socket.io')(server);

socket.on('connection',async (socket)=>{
    console.log('Connection established with socket');
    console.log(socket.handshake); //sending user id to set online/offline status the data sent from UI is stored in handshake property of socket
    var id=socket.handshake.auth.token;
    await User.findByIdAndUpdate({_id:id},{$set:{status:'1'}});

    socket.broadcast.emit('onlineUsers',{user_id:id});

    socket.on('disconnect',async(disconnected)=>{
     await User.findByIdAndUpdate({_id:id},{$set:{status:'0'}});
     console.log('Connection with Socket was disconnected');
     socket.broadcast.emit('offlineUsers',{user_id:id});

    });


    socket.on('new message',async  function(data){
        console.log('data',data);
        socket.broadcast.emit('loadMessages',data);
    });

    socket.on('existing message',async function(data)
    {
      var loadMessages = await message.find({$or:[
            {senderId:data.senderId,reciever_id:data.reciever_id},
            {senderId:data.reciever_id,reciever_id:data.senderId}

        ]});
        socket.emit('loadChat',{loadMessages:loadMessages});
    });

    socket.on('message deleted',async function(data){
        var updateddeleteflag = await message.findByIdAndUpdate({_id:data.id},{$set :{isdelete:true}});
        socket.broadcast.emit('deleted message',{id:data.id});
    });

    socket.on('Join',async function(data){
            var groupMember = new GroupMembers({
               groupId:req.body.groupId,
               userId:req.body.userId
            });
           var member = await groupMember.save();

           socket.broadcast.emit('notify Group',{data:member});
            
    });

    socket.on('new Group Message',async function(data){
        socket.broadcast.emit('load new sent message',{data:data});
    });

    socket.on('delete Message from group',async function(data){
        var updateddeleteflag = await GroupChat.findByIdAndUpdate({_id:data._id},{$set :{isdelete:true}});
        socket.broadcast.emit('deleted message',{id:data._id});
    });

    socket.on('edit Message',async function(data){
        console.log(data);
        await message.findByIdAndUpdate({_id:data._id},{$set :{message:data.message}});
        const newMessage = await message.findById({_id:data._id});
        socket.broadcast.emit('edited message',{newmessage:newMessage});
    });
})