const isLogin = async(req,res,next)=>{
    try{
        if(req.session.user){
            return true
            // res.redirect('/dashboard'); //UI page
        }
        next();
    }
    catch(error)
    {
        console.log(error.message);
    }
}


const isLogout = async(req,res,next)=>{
    try{
        if(req.session.user){
            return true;
            // res.redirect('/'); //UI page
        }
        next();
    }
    catch(error)
    {
        console.log(error.message);
    }
}