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

// Insert or update all of the sustainability data
WFRoute.post('/sustainability', async (req, res) => {
  const {trip_id, carbonEmission, rainRate, cWeather, aQuality, wSpeed, wDirection, wAngle, temp, humid, vis, uIndex, sRad, press, slPress} = req.body
  try {
    const sustainData = await db(`Select * from sustainability_data where sd_trip_id = ${trip_id}`)
    if (sustainData.length !== 0) {
      return res.json(sustainData)
    }else{
       await db(`Insert into sustainability_data 
      (sd_trip_id,	sd_carbon_emission,	sd_rainfall_rate,	sd_current_weather,	sd_air_quality,	sd_wind_speed	sd_wind_direction	sd_wind_angle	sd_temperature	sd_humidity	sd_visibility	sd_uv_index	sd_solar_radiation	sd_pressure	sd_sealevel_pressure)
      values (${trip_id},${carbonEmission},${rainRate},'${cWeather}',${aQuality},${wSpeed},'${wDirection}',${wAngle},${temp},${humid},${vis},${uIndex},${sRad},${press},${slPress})`)
      res.json({message:'Successfully inserted new sustainability data'})
    }
  } catch (error) {
    console.log(error)
  }
})

module.exports = WFRoute