const express = require('express')
const db = require('../database/connection')
const maintenanceRouter = express.Router()
const maintenanceServices = require('../services/maintenance/maintenance')
const {addMaintenance, getMaintenanceList, maintenanceSearch, updateMaintenance} = maintenanceServices()
maintenanceRouter.get("/maintenance-list", async (req, res) => 
{
    const data = await getMaintenanceList()
    res.json(data)
})

maintenanceRouter.post("/add-maintenance", async (req, res) => 
{
    const {vehicle, startDate, endDate, details, cost, vendor, mService, status} = req.body
    const data = await addMaintenance(vehicle, startDate, endDate, details, cost, 
        vendor, mService, status)
    res.json(data)
    console.log(req.body)
})

maintenanceRouter.get("/maintenance-search", async (req, res) => {
    const {search} = req.query
    const maintenanceData = await maintenanceSearch(search)
    res.json(maintenanceData)
})
// get maintenance by id
maintenanceRouter.get("/maintenancebyid/:id", async (req, res) => {
    const {id} = req.params
    const maintenanceData = await db(`Select * from fms_g11_maintenance where m_id = ${id}`)
    res.json(maintenanceData)
})
// Update
maintenanceRouter.put("/maintenance-update", async (req, res) => {
    const {vehicle, startDate, endDate, details, cost, vendor, mService, status, id} = req.body
    const d = new Date()
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const day = d.getDate()
    const created_date = `${year}-${month}-${day}`
    const result = await updateMaintenance(vehicle, startDate, endDate, details, cost, vendor, mService, status, id, created_date)
    res.json(result).status(200)
})
maintenanceRouter.delete('/maintenance-delete/:id', async (req, res) => {
    const {id} = req.params;
    const query = `Delete from maintenance where m_id = ${id}`
    try {
        await db(query)
        res.json({message:"Deleted Successfully!"})
    } catch (error) {
        console.log(error)
    }
})
module.exports = maintenanceRouter