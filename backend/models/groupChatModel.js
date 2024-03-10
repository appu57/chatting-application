var mongoose = require('mongoose');
var schema = mongoose.Schema;

var groupchatSchema = new schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    groupId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'group',
    },
    message:{
        type:String,
        required:true,
    },
    isdelete:{
        type:Boolean,
        default:false
    }
},{timestamps:true}
);

module.exports = mongoose.model('groupchats',groupchatSchema);