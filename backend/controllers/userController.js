const groupChats = require('../models/groupChatModel');

const saveGroupChat = async (req,res,next)=>{
    try{
    const newMessage =new groupChats({
        senderId:req.body.senderId,
        groupId:req.body.groupId,
        message:req.body.message
    });
    var object =await newMessage.save();
    res.statusCode=200;
    res.json(object);
   }
   catch(error){
       console.log(error);
   }
}

const getSavedMessage = async (req,res,next)=>{
    var savedMessage = groupChats.find({groupId:req.body.groupId});
    res.statusCode=200;
    res.json(savedMessage);
    
}

module.exports={
    saveGroupChat,
    getSavedMessage
}