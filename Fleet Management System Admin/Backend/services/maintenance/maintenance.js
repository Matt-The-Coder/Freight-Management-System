const db = require('../../database/connection')
module.exports = () => 
{
    const getMaintenanceList = async () => 
    {
        const query = "Select * from maintenance"
        try {
            const data = await db(query)
            return data
        } catch (error) {
            throw error
        }
    }
    const addMaintenance = async (vehicle, startDate, endDate, details, cost, vendor, mService, status) => 
    {
        const query = `Insert into maintenance 	(m_v_id, m_start_date, m_end_date,
        m_details, m_cost, m_vendor_name, m_service, m_status) 
        values('${vehicle}', '${startDate}', '${endDate}', '${details}', ${cost}, '${vendor}', 
            '${mService}', '${status}')`

        const data = await db(query)
        return data
    }
    const updateMaintenance = async (vehicle, startDate, endDate, details, cost, vendor, mService, status, id, modifiedDate) => 
    {
        const query = `UPDATE maintenance set
        m_v_id ='${vehicle}',
        m_start_date	= '${startDate}',
        m_end_date = '${endDate}',
        m_details	= '${details}',
        m_cost = ${cost},
        m_service = '${mService}',
        m_vendor_name = '${vendor}',
        m_status =  '${status}', v_modified_date = '${modifiedDate}' where m_id= ${id}`
        
        try {
            const data = await db(query)
            return data
        } catch (error) {
            throw error
        }
    }
    const maintenanceSearch = async (search) => {
        const query = `SELECT * FROM MAINTENANCE WHERE m_cost LIKE '%${search}%' OR m_status LIKE '%${search}%'`;
        const data = await db(query)
        return data

    }

    return {
        getMaintenanceList,
        addMaintenance,
        maintenanceSearch,
        updateMaintenance
    }
}