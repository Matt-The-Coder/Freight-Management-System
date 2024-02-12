const db = require('../../database/connection')
module.exports = () => {

    const getFuelList = async () => 
    {
        const query = "Select * from fuel"
        try {
            const data = await db(query)
            return data
        } catch (error) {
            throw error
        }
    }
    const addFuel =  async (vehicle, driver, date, quantity, odometerReading, amount, remarks, created_date) => 
    {
        const query = `INSERT INTO fuel (v_id, v_fuel_quantity, v_odometerreading,	
            v_fuelprice, v_fuelfilldate, v_fueladdedby,	v_fuelcomments,	v_created_date)
            values ('${vehicle}', ${quantity}, ${odometerReading}, ${amount}, 
                '${date}', '${driver}', '${remarks}', '${created_date}')`
        try {
            const data = await db(query)
            return data
        } catch (error) {
            throw error
        }
    }
    const updateFuel =  async (vehicle, driver, date, quantity, odometerReading, amount, remarks, f_id) => 
    {
        const query = `UPDATE fuel set
        v_id ='${vehicle}',
        v_fuel_quantity	= ${quantity},
        v_odometerreading = ${odometerReading},
        v_fuelprice	= ${amount},
        v_fuelfilldate = '${date}',
        v_fueladdedby = '${driver}',
        v_fuelcomments = '${remarks}' where v_fuel_id= ${f_id}`
        
        try {
            const data = await db(query)
            return data
        } catch (error) {
            throw error
        }
    }
    const fuelSearch = async (search) => {
        const query = `SELECT * FROM fuel WHERE v_fueladdedby LIKE '%${search}%' OR v_fuelprice LIKE '%${search}%'`;
        const data = await db(query)
        return data

    }
    return{
        getFuelList,
        addFuel,
        fuelSearch,
        updateFuel
    }
}