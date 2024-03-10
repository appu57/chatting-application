var express = require('express');
var router = express();
var body_parser= require('body-parser');
var multer = require('multer');
var Group = require('../models/groupModel');
var GroupMember =  require('../models/groupMembers');
const mongoose = require('mongoose');
const groupChats = require('../models/groupChatModel');
const controller =require('../controllers/userController');



router.use(body_parser.json());
router.use(body_parser.urlencoded({extended:false}));

router.use(express.static('public'));
const path = require('path');

const storage = multer.diskStorage({
    destination: (req,res,cb)=>{
      cb(null,path.join(__dirname,'../public/images'));
    },
    filename :(req,file,cb)=>{
        const name = Date.now() + '_' + file.originalname;
        cb(null,name);
    }
});

const upload = multer({storage:storage});

router.post('/createGroup',upload.single('groupImage'),async (req,res,next)=>{
    const group = new Group({
      adminId : req.body.adminId,
      name: req.body.name,
      image:'images/'+req.file.filename,
    });
    const savedGroup = await group.save();
    const newgroupMember =  req.body.members;
    const membersTobeAdded = JSON.parse(newgroupMember);
    let length = membersTobeAdded.length;
    const members =[];
    for(let i =0 ; i <length;i++)
    {
       members.push({
            groupId:savedGroup._id,
            userId:membersTobeAdded[i]
       });//each time we add member call another method which adds a message "User added to GroupChatModel"
    }
    const memberadded=await GroupMember.insertMany(members);
    res.statusCode=200;
    res.send({success:true,message:"New Group Created successfully",group:savedGroup,member:memberadded});
});



router.get('/getGroup',async (req,res,next)=>{

    var groups =await Group.find({});
    res.statusCode=200;
    res.json(groups);
});

router.post('/invite-link',async(req,res,next)=>{
    var group = await Group.findOne({_id:req.body.groupId});

        console.log("group",group);
        var members = await GroupMember.find({groupId:req.body.groupId}).count();

        var admin= group.adminId == req.body.userId ? true:false;
        var alreadyJoined = await GroupMember.find({groupId:req.body.groupId,userId:req.body.userId}).count();
        let value = alreadyJoined > 0 ?true:false;

        res.statusCode=200;
        res.json({alreadyJoined:value});
})

router.post('/userAddedGroups',async (req,res,next)=>{
    var groups = await Group.find({adminId:req.body.userId});
    var joinedGroup = await GroupMember.find({userId:req.body.userId}).populate('groupId').select('groupId'); //find if any userid is present in groupMember based on response take the groupId present in member table , map its groupId with its primary key and returning entire anygroup associated with that groupId and using select we can only return groups associated instead of populating/adding the group to membe table
    // var totalGroup = [...groups , ...joinedGroup];
    console.log(groups);
    res.statusCode=200;
    res.json({joinedGroups:joinedGroup,groups:groups});
});


router.delete('/delete',async(req,res,next)=>{
    await Group.deleteMany();
    await GroupMember.deleteMany();
    res.statusCode=200;
    res.send({message:"Deleted Successfully"});
});

router.post('/newGroupChat',async (req,res,next)=>{
    const newMessage =new groupChats({
        senderId:req.body.senderId,
        groupId:req.body.groupId,
        message:req.body.message
    });
    var object =await newMessage.save();
    res.statusCode=200;
    res.json(object);
});

router.post('/getGroupChats',async (req,res,next)=>{
    var savedMessage = await groupChats.find({groupId:req.body.groupId});
    res.statusCode=200;
    res.json(savedMessage);
    
});




module.exports = router;