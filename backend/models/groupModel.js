var mongoose = require('mongoose');
var schema = mongoose.Schema;

var groupSchema = new schema({
    adminId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    name:{
        type:String,
        required:true
    },
    limit:{
        type:Number,
        default:50
    },
    image:{
        type:String
    }
},{timestamps:true}
);

module.exports = mongoose.model('group',groupSchema);