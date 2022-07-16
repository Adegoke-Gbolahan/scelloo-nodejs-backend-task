const jwt = require('jsonwebtoken')
const db = require("../model");
const User = db.user;
const { Op } = require("sequelize");

const auth = async  (req, res, next) =>{  
    try {
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token, 'interviewtask')
        console.log(decoded);
        const user = User.findAll({
            where: {
            [Op.and]: [{ email: decoded.email }, { token: token}]
        }})
        .then(data => {
            if(data.length < 1){
                return res.status(401).send({success:false,msg:'Invalid Credentials'})  
            }
            req.token = token;
            req.user = user[0];
            next();          
        })
        .catch(err => {
            return res.status(401).send({error:'Please Autheticate'}) 
        });
    } catch (e) {
        console.log(e)
        return res.status(401).send({error:'Please Autheticate'}) 
    }

}

module.exports = auth