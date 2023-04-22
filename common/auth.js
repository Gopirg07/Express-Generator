const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')

const saltRounds = 10; 

const hashPassword = async (password) => {
    let salt=await bcrypt.genSalt(saltRounds)
    let hashedPassword=await bcrypt.hash(password,salt)
    return hashedPassword
};
const hashCompare = async (password,hashPassword) => {
    return await bcrypt.compare(password,hashPassword)
};

const createToken=async(payload)=>{
    let token = await jwt.sign(payload,process.env.secretKey,{expiresIn:'2m'})
    console.log(token)
    return token
}

const validate =async(req,res,next)=>{
    if(req.headers.authorization){
        
        let token=req.headers.authorization.split(" ") [1];
        let data = await jwt.decode(token)  

        console.log(data.exp)
        console.log(Math.floor((+new Date())/1000))
        if(Math.floor((+new Date())/1000)<data.exp)   {
            next()
        }else{
            res.status(402).send({message:"Token Expired"})
        }
    }
    else{
        res.status(402).send({message:"Invalid token"})
    }
}


const roleAdminGuard=async(req,res,next)=>{
    if(req.headers.authorization){
        
        let token=req.headers.authorization.split(" ") [1];
        let data = await jwt.decode(token)  

        console.log(data.role) 
        if(data.role === "admin")    {
            next()
        }else{
            res.status(402).send({message:"Only Admin Can Get Datas"})
        }
    }
    else{
        res.status(402).send({message:"Invalid token"})
    }
}

module.exports={hashPassword,hashCompare,createToken,validate,roleAdminGuard}