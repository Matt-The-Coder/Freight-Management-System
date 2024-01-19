const express = require('express')
const personalInfoRoute = express.Router()
const bcrypt = require('bcrypt')
const db = require('../database/connection')

personalInfoRoute.post('/updatePersonalInfo', async (req, res)=>{
    const {fName, lName, uName, email, u_id:id} = req.body
    try {
        const query = `UPDATE ACCOUNTS SET u_username = '${uName}', u_first_name = '${fName}', u_last_name = '${lName}', u_email = '${email}' WHERE u_id = ${id}`
        const data = await db(query)
        res.json(data)
    } catch (error) {
        res.json({errorMessage:"Username already exists!"})
    }

})
personalInfoRoute.post('/updateSecurityInfo', async (req, res)=>{
    const {nP:newPassword, u_id:id} = req.body
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    const query = `UPDATE ACCOUNTS SET u_password = '${hashedPassword}' WHERE u_id = ${id}`
    const result = await db(query)
   res.json({message:"Updated Successfully!"}) 
})
personalInfoRoute.get('/getaccountbyid/:id', async (req, res) => 
{
    try {
        const {id} = req.params
        const query = `Select * from accounts where u_id = ${id}`
        const result = await db(query)
        res.json(result)
    } catch (error) {
        res.json({message: "Wrong ID"})
    }

})
module.exports = personalInfoRoute