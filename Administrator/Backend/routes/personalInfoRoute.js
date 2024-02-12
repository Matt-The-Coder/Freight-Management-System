const express = require('express')
const personalInfoRoute = express.Router()
const bcrypt = require('bcrypt')
const multer = require('multer')
const path = require('path')
const db = require('../database/connection')
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
  async function handleUpload(file) {
    const res = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return res;
  }

  const storage = new multer.memoryStorage();
  const upload = multer({
    storage,
  });
  
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
personalInfoRoute.get("/getAccess/:id", async (req, res) => 
{
    const {id} = req.params
    const query = `Select * from accounts_access where a_u_id = ${id}`
    const result = await db(query)
    res.json({data: result}) 
})

personalInfoRoute.post("/upload/:id", upload.single("my_file"), async (req, res) => {
    try {

            const {id} = req.params
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI);
      const path = cldRes.url.split('/').pop()
    const query = `Update accounts set u_profile_picture = '${path}' where u_id = ${id}`
      const result = await db(query)
      res.json(cldRes);
      console.log(result)
      console.log(path)
      

    } catch (error) {
      console.log("The error", error);
      res.send({
        message: error.message,
      });
    }
  });

// For localhost
// Change profile picture
// personalInfoRoute.post('/changeProfile/:id', upload.single('image'), async (req, res) => 
// {
//     const {id} = req.params
//     try {
//         const query = `Update accounts set u_profile_picture = '${req.file.filename}' where u_id = ${id}`
//         await db(query)
//         res.json({status: 'Success'})
//     } catch (error) {
//         res.json({status: 'Failed'})
//     }
// })
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './images')
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
//     }
// })

// const upload = multer({
//     storage:storage
// })
personalInfoRoute.get('/getProfilePicture/:id', async (req, res) => 
{   
    const {id} = req.params
    try {
        const query = `Select u_profile_picture from accounts where u_id = ${id} `
        const result = await db(query)
        res.json({image: result})
    } catch (error) {
        console.log("Cannot get profile picture")
        res.json({status: "Failed to get profile picture"})
    }
})
module.exports = personalInfoRoute