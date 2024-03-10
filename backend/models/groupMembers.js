var mongoose = require('mongoose');
var schema = mongoose.Schema;

var groupMember = new schema({
    groupId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'group',
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
},{timestamps:true}
);

module.exports = mongoose.model('GroupMember',groupMember);