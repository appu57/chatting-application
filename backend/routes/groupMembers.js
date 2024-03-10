var express = require('express');
var router = express();
var body_parser = require('body-parser');
var GroupMember = require('../models/groupMembers');
var user = require('../models/userRegisterModel');
const mongoose = require('mongoose');

router.use(body_parser.json());
router.use(body_parser.urlencoded({ extended: false }));

router.use(express.static('public'));

router.post('/mapGroupIdsWithUser', async (req, res, next) => {
    var users = await user.aggregate([  //used to add columns in the existing model just like joins creating a new table joing two diff table
        {
            $lookup: {
                from: "groupmembers", //from which table do we need to take data from
                localField: "_id",  // field using which we are joining and the column localfield is from User 
                foreignField: "userId",//the name of the column in the table from where we are taking data
                pipeline:[// add new column whose value matches with the below regex
                    {
                        $match:{
                            $expr:{
                              $and:[
                                  {
                                      $eq : ["$groupId",new mongoose.Types.ObjectId(req.body.group_id)]
                                  }
                              ]
                            }
                        }
                    }
                ],
                as: "member" //name of new column being added to table user
            }
        },
        {
            $match: { 

                "_id": {
                    $nin: [new mongoose.Types.ObjectId(req.body.user_id)]  //should not return the one who created group
                }

            }
        }
    ]);

    res.statusCode=200;
    res.send({user:users});
});


module.exports = router;