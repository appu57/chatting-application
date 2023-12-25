var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userRegisterSchema = new schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    status:{
        type:String,
        default:'0',
    },
    image:{
        type:String,
        required:true,
    },
},{timestamps:true}
);

module.exports = mongoose.model('User',userRegisterSchema);