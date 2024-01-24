const express = require('express')
const authRoute = express.Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const db = require('../database/connection')
const axios = require('axios')
const authServices = require('../services/auth/auth')
const {getAccounts, getAccByUsername } = authServices()
const verifyToken = (req, res, next) => 
{
  // const token = req.session.token
  const token = req.cookies.token
  console.log(req.cookies.token)
  console.log(req.cookies.role)
    if(token){
        req.sessionToken = token
        // req.userToken = req.cookies.token
        next()
    }else {
      return res.json({message:'No token provided.'});
    }

}
authRoute.get('/alreadyauthenticated', (req, res) => 
{

  // if(req.session.token){   
  //     res.json({auth: true, role: req.session.role})  
  // }
    if(req.cookies.token){   
      res.json({auth: true, role: req.cookies.role})  
  }
  else{
    res.json({auth:false})
  }
})
authRoute.get('/homeAuthentication', verifyToken, (req, res) => {
    jwt.verify(req.sessionToken, "secretkey", (err, authData)=>{
        if(err){
          return res.json({message: "token is expired, not valid!"})
        }else {
          return res.json({authData})
        }
    })
})

authRoute.delete("/logout", (req, res) => 
{
  res.clearCookie("token")
  res.clearCookie("role")
  // req.session.destroy((err) => {
  //   if (err) {
  //     console.error('Error destroying session:', err);
  //     return res.status(500).json({ message: 'Failed to logout' });
  //   }
  //   return res.json({ message: 'Logout Successful!' });
  // });
})

authRoute.post('/login', async (req, res)=>
{
  try { 
    const {userName, password} = req.body
    const user = await getAccByUsername(userName)
    if(user == 0){
     return res.json({message: "User does not exist"})
    }
    else{
     const checkPassword =  await bcrypt.compare(password, user[0].u_password)
      if (!checkPassword) {
          return res.json({message: "Password is Incorrect!"})
      }
      else {

         jwt.sign({user: user}, "secretkey", {expiresIn: '1d'}, (err, token)=>{
          if(err){
            return res.json({message: "Cannot create token"})
          }
          res.cookie('token', token)
           res.cookie('role', user[0].u_role)
          // req.session.token = token
          // req.session.role = user[0].u_role
          return res.json({success:"Login Success!", user})
        })
      }
    }
 
  } catch (error) {
    console.log('You have an error', error)
  }
})



authRoute.get('/register', async (req, res)=>
{
  try {
    const email = 'manabatrm2@gmail.com'
    const username = 'Matt'
    const fname = 'Matthew'
    const lName = 'Manabat'
    const password = 'Ashlynky#17'
    const role = 'driver'
    const hashedPassword = await bcrypt.hash(password, 10)
    const sqlQuery = `INSERT INTO accounts ( u_username, u_first_name, u_last_name, u_password, u_email, u_role) 
    VALUES('${username}','${fname}', '${lName}',  '${hashedPassword}', '${email}','${role}' )`;
    await db(sqlQuery)

  } catch (error) {
    console.error(error)
  }

})

module.exports = authRoute
