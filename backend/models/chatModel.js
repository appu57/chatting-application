var mongoose = require('mongoose');
var schema = mongoose.Schema;

var chatSchema = new schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    reciever_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    message:{
        type:String,
        required:true,
    }
},{timestamps:true}
);

module.exports = mongoose.model('chats',chatSchema);