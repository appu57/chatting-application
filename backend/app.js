require('dotenv').config();

let mongoose = require('mongoose');
var session = require('express-session');
const User = require('./models/userRegisterModel');


const {session_secretkey} = process.env;

const url = 'mongodb://localhost:27017/chat-application';
const connect = mongoose.connect(url);

connect.then((connected)=>{
    console.log('Server connected to MongoDB database');
});

const app= require('express')();
const http = require('http');

const server=http.Server(app);

app.use(session({
    secret:session_secretkey,
    saveUninitialized:false,
    resave:false,
}));


const userRoute = require('./routes/userroutes');
app.use('/user',userRoute);

server.listen('3000',()=>{
    console.log('Server is running on port 3000');
});


const socket = require('socket.io')(server);

socket.on('connection',(socket)=>{
    console.log('Connection established with socket');
    console.log(socket.handshake.auth.token);//sending user id to set online/offline status the data sent from UI is stored in handshake property of socket
    var id=socket.handshake.auth.token;
    await User.findByIdAndUpdate({_id:id},{$set:{status:'1'}});
    
    socket.on('disconnect',(disconnected)=>{
     await User.findByIdAndUpdate({_id:id},{$set:{status:'0'}});
     console.log('Connection with Socket was disconnected');
    })
})