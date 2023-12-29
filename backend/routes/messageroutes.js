var express = require('express');
var router = express();
var body_parser = require('body-parser');
var socketMessage = require('../models/chatModel');


router.use(body_parser.json());
router.use(body_parser.urlencoded({extended:false}));

router.set('views','./views');
router.set('view engine','ejs');

router.post('/sendMessage',async (req,res,next)=>{
    try{
      const message = new socketMessage({
          senderId:req.body.senderId,
          reciever_id:req.body.reciever_id,
          message:req.body.message
      });
      await message.save();
      res.statusCode=200;
      res.status(200).send({sucess:true,message:'Message sent'});
    }
    catch(e)
    {
        res.statusCode=400;
        res.status(400).send({sucess:false,message:'Message was not sent'});
    }
});

router.delete('/getMessages',async(req,res,next)=>{
    try{
    await socketMessage.deleteMany();
    res.statusCode=200;
    res.status(200).send({sucess:true,message:'Message was deleted'});
 
    }
    catch(e)
    {
        res.statusCode=400;
        res.status(400).send({sucess:false,message:'Message was not deleted'});

    }
});


router.get('/getMessages',async(req,res,next)=>{
    try{
        var messages = await socketMessage.find({});
       res.statusCode=200;
       res.json(messages);
    }
    catch(e)
    {
        res.statusCode=400;
        res.status(400).send({sucess:false,message:'Message was not deleted'});

    }
});


router.delete('/delete/:id',async(req,res,next)=>{
    try{
       var deletemessages = await socketMessage.deleteOne({_id:req.params.id});
       res.statusCode=200;
       res.json(deletemessages);
    }
    catch(e)
    {
        res.statusCode=400;
        res.status(400).send({sucess:false,message:'Message was not deleted'});

    }
});


















module.exports = router;
