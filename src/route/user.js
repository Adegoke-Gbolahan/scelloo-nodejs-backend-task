const express = require('express')
const Router = express.Router()
const jwt = require('jsonwebtoken')
const user = require('../controller/user.controller')
const db = require("../model");
const User = db.user;
const { Op } = require("sequelize");

Router.post('/api/v1.0/user/create',user.create);
Router.post('/api/v1.0/user/login', async (req, res) =>{
    const {email,password} = req.body
    const user = User.findAll({
            where: {
            [Op.and]: [{ email: email }, { password: password }]
        }})
    .then(data => {
        if(data.length < 1){
            return res.status(401).send({success:false,msg:'Invalid Credentials'})  
        }
        const token = jwt.sign({ email: email },'interviewtask') //will change it to .env variable for production
        User.update({ token }, {
            where: {
                email
            }
          });
        // delete user[0]['password']
        // delete user[0]['token']
        res.send({token,user:data[0]});          
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User."
        });
    });
})

module.exports = Router