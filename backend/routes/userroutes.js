var express = require('express');
var router = express();
var body_parser = require('body-parser');
var bcrypt = require('bcrypt');
var User = require('../models/userRegisterModel');



router.use(body_parser.json());
router.use(body_parser.urlencoded({extended:false}));

router.set('view engine','ejs');
router.set('views','./views');   //setting view engine

router.use(express.static('public')) ; //setting static folder to store images
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination:function(req,file,cb){
      cb(null,path.join(__dirname,'../public/images'));            //callback response setting err as null and save images mentioned in dirname
    },
    filename : function(req,file,cb){
       const name = Date.now() + '_' + file.originalname;
       cb(null,name);
    }
});

const upload=multer({storage:storage});

const userController = require('../controllers/userController');

router.route('/register')
    .post(upload.single('image'),async function(req,res,next){
        console.log(req.body);
        let hashpassword=req.body.password;
        bcrypt.genSalt(10,(err,salt) => {
            bcrypt.hash(`${hashpassword}`, salt , (err, hash) =>{
             if(err) throw (err);
             console.log(hash);
          
        const newUser = new User({
            name:req.body.name,
            password:hash,
            email:req.body.email,
            image:'images/'+req.file.filename,
        });
        newUser.save().then((savedUser)=>{
            res.statusCode=200,
            res.json(savedUser);
        });
        })
    });  
    });

    router.post('/login',async (req,res,next)=>{
        const email = req.body.email;
        const password = req.body.password;
        const registeredUser = await User.findOne({email:email});  //instead of .then
        if(registeredUser)
        {
           const passwordMatch =await bcrypt.compare(password,registeredUser.password);
           if(passwordMatch)
           {
               res.statusCode=200;
               res.json(registeredUser);
           }
           else{
            res.statusCode=401;
            res.json({message:'Login was not allowed for user'});
           }
        }
        else{
            res.statusCode=401;
            res.json({message:'Login was not allowed for user'});
        }
    });


router.route('/getUsers')
        .get((req,res,next)=>{
          User.find({}).then((users)=>{
              res.statusCode=200;
              res.json(users);
          });
        })

        .delete((req,res,next)=>{
            User.deleteMany().then((empty)=>{
                res.statusCode=200;
                res.statusMessage = 'Deleted Successfully'
            })
        });




module.exports = router;
