import { useEffect, useRef, useState } from 'react'
import '/public/assets/css/adminLayout/maintenance.css'
import axios from "axios"
import * as XLSX from 'xlsx';
import { Link, useNavigate, useOutletContext } from "react-router-dom"
const SustainabilityReports = ({ socket }) => {
    const nav = useNavigate()

    const { setIsLoading } = useOutletContext()
    const [maintenanceData, setMaintenanceData] = useState([])
    const [sustainData, setSustainData] = useState([])
    const [sustainFilter, setSustainFilter] = useState([])
    const hostServer = import.meta.env.VITE_SERVER_HOST
    const [maintenanceSearch, setMaintenanceSearch] = useState('')
    const deliveryTable = useRef(null)
    const getMaintenanceList = async () => {
        setIsLoading(true)
        const fetchMaintenance = await axios.get(`${hostServer}/getSustainableReports`)
        const data = fetchMaintenance.data;
        setMaintenanceData(data)
        setSustainData(data)
        setIsLoading(false)
    }
    const searchMaintenance = async () => {
        setIsLoading(true)
        const fetchMaintenance = await axios.get(`${hostServer}/sustain-search?search=${maintenanceSearch}`)
        const filteredData = fetchMaintenance.data
        setMaintenanceData(filteredData)
        setIsLoading(false)
    }
    const filterData = (e) => {
        setSustainFilter(e);
        const filteredData = sustainData.filter((sus) => {
          const dateOnly = sus.sd_modified_date.substring(0, 10);
          return dateOnly === e;
        });
        console.log(filteredData);
        setMaintenanceData(filteredData);
      };
    useEffect(() => {
        socket.on('deliveryUpdate', (data) => {
            alert("Delivery Status Updated")
            location.reload()
        });
        return () => socket.off('deliveryUpdate');

    }, [socket]);
    useEffect(() => {
        getMaintenanceList()
    }, [])
    const formatDate = (date) => {
        const formattedDate = new Date(date);
        formattedDate.setDate(formattedDate.getDate() + 1);
        return formattedDate.toISOString().split("T")[0];
    };

    function formatDateTime(datetimeStr) {
        // Create a new Date object from the datetime string
        var datetime = new Date(datetimeStr);

        // Define options for formatting the date and time
        var options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        };

        // Format the date and time using options
        var formattedDateTime = datetime.toLocaleString('en-US', options);

        return formattedDateTime;
    }

    const exportData = (type) => {
        const fileName = `delivery-report-sheet.${type}`
        const wb = XLSX.utils.table_to_book(deliveryTable.current)
        XLSX.writeFile(wb, fileName)
    }

    return (
        <div className="Maintenance">
            <div className="adminHeader">
                <div className="left">
                    <h1>Environmental <span>Reports</span></h1>
                    <ul className="breadcrumb" >
                        <li><Link to="/admin/dashboard">Reports</Link></li>
                        /
                        <li><a href="#" className='active'>Environmental Reports</a></li>
                    </ul>
                </div>
            </div>
            <div className="filter">
                    {/* <h3>Filter</h3> */}
                    <input type="date" id='date-input' value={sustainFilter} onChange={(e)=>{filterData(e.currentTarget.value)}}/>
                    <i className='bx bx-filter' ></i>
                </div>
            <div className="maintenance-details">
                <div className="report-export">
                    <p>Export as:</p>
                    <button onClick={() => { exportData("Xlsx") }}>Xlsx</button>
                    <button onClick={() => { exportData("Xls") }}>Xls</button>
                    <button onClick={() => { exportData("CSV") }}>CSV</button>

                </div>
                <div className="maintenance-search">
                    <input type="text" id='search' onChange={(e) => { setMaintenanceSearch(e.target.value) }} />
                    <button onClick={searchMaintenance}>Search</button>

                </div>
                <div className="maintenance-list">
                    <table className='maintenance-table' ref={deliveryTable}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Trip ID</th>
                                <th>Fuel Cost</th>
                                <th>Fuel Consumption</th>
                                <th>Carbon Emission</th>
                                <th>Rainfall Rate</th>
                                <th>Current Weather</th>
                                <th>Air Quality</th>
                                <th>Wind Speed</th>
                                <th>Wind Direction</th>
                                <th>Wind Angle</th>
                                <th>Temperature</th>
                                <th>Humidity</th>
                                <th>Visibility</th>
                                <th>UV Index</th>
                                <th>Solar Radiation</th>
                                <th>Air Pressure</th>
                                <th>Sea Level Pressure</th>
                                <th>Alerts</th>
                                <th>Last Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                maintenanceData?.map((e, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>{e?.sd_id}</td>
                                            <td>{e?.sd_trip_id}</td>
                                            <td>{e?.sd_fuelcost} </td>
                                            <td>{e?.sd_fuelconsumption}</td>
                                            <td>{e?.sd_carbon_emission}</td>
                                            <td>{e?.sd_rainfall_rate}</td>
                                            <td>{e?.sd_current_weather}</td>
                                            <td>{e?.sd_air_quality}</td>
                                            <td>{e?.sd_wind_speed}</td>
                                            <td>{e?.sd_wind_direction}</td>
                                            <td>{e?.sd_wind_angle}</td>
                                            <td>{e?.sd_temperature}</td>
                                            <td>{e?.sd_humidity}</td>
                                            <td>{e?.sd_visibility}</td>
                                            <td>{e?.sd_uv_index}</td>
                                            <td>{e?.sd_solar_radiation}</td>
                                            <td>{e?.sd_pressure}</td>
                                            <td>{e?.sd_sealevel_pressure}</td>
                                            <td>{e?.alerts}</td>
                                            <td>{formatDateTime(e?.sd_modified_date)}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>

                    </table>
                </div>
            </div>

        </div>
    )
}

export default SustainabilityReports;