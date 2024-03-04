const express = require('express')
const WFRoute = express.Router()
const axios = require('axios')
const db = require('../database/connection')
// Calculate Emissions and Consumptions
WFRoute.get('/calculateFuelConsumptionWithPrice', (req, res)=>
{
  const {miles, weightInKG} = req.query
  // Fuel Consumption
    const runMiles = miles
    const milesPerLiter = 21.58
    const fuelConsumptionPerLiter = runMiles / milesPerLiter
    const dieselFuelPricePerLiter = 66.52
    const totalCostForAllDieselUsed = fuelConsumptionPerLiter * dieselFuelPricePerLiter
  // Carbon Emissions
    const truckEmissionFactorInGramsPerTonMiles = 161.8
    const cargoWeightInTons = weightInKG / 1000
    const totalAmountOfTonMiles = runMiles * cargoWeightInTons;
    const carbonEmissionsInGrams = totalAmountOfTonMiles * truckEmissionFactorInGramsPerTonMiles
    res.json({fuelConsumption: fuelConsumptionPerLiter, fuelCost:totalCostForAllDieselUsed, 
      carbonEmission: carbonEmissionsInGrams})
})

WFRoute.get('/weatherdata', async (req, res)=> 
{   
  let latitude = req.query.lat;
  let longitude = req.query.lon
    const API = process.env.WEATHER_API
    const weatherData = await axios.get(`https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${API}`)
    const weatherAlert = await axios.get(`https://api.weatherbit.io/v2.0/alerts?lat=${latitude}&lon=${longitude}&key=${API}`);
    res.json({weatherData:weatherData.data.data[0], weatherAlert:weatherAlert.data})
})

WFRoute.get('/get-vehicle-stats/:id', async (req, res)=> 
{   
    const {id} = req.params
    try {
      const result = await db(`Select * from fms_g11_sustainability_data where sd_trip_id = ${id}`)
      res.json(result)
    } catch (error) {
      console.log(error)
    }

})
module.exports = WFRoute