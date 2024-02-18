import { useEffect, useRef, useState } from 'react'
import '/public/assets/css/adminLayout/maintenance.css'
import axios from "axios"
import * as XLSX from 'xlsx';
import {Link, useNavigate, useOutletContext} from "react-router-dom"
const DeliveryReports = () => {
    const nav = useNavigate()
    
    const {setIsLoading} = useOutletContext()
    const [isDelete, setIsDelete] = useState(false)
    const [maintenanceData, setMaintenanceData] = useState([])
    const hostServer = import.meta.env.VITE_SERVER_HOST
    const [maintenanceSearch, setMaintenanceSearch] = useState('')
    const deliveryTable = useRef(null)
    const getMaintenanceList = async () => {
        setIsLoading(true)
        const fetchMaintenance = await axios.get(`${hostServer}/get-trip-reports`)
        const  data = fetchMaintenance.data;
        setMaintenanceData(data)
        setIsLoading(false)
    }
    const searchMaintenance = async() =>
    {
        setIsLoading(true)
        const fetchMaintenance = await axios.get(`${hostServer}/trip-search?search=${maintenanceSearch}`)
        const filteredData = fetchMaintenance.data
        setMaintenanceData(filteredData)
        setIsLoading(false)
    }
    useEffect(()=>{
        getMaintenanceList()
    },[isDelete])
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
                    <h1>Delivery Reports</h1>
                    <ul className="breadcrumb" >
                        <li><Link to="/admin/dashboard">Reports</Link></li>
                        /
                        <li><a href="#" className='active'>Delivery Reports</a></li>
                    </ul>
                </div>
            </div>
            <div className="maintenance-details">
                <div className="report-export">
                <p>Export as:</p>
                <button onClick={()=>{exportData("Xlsx")}}>Xlsx</button>
                <button onClick={()=>{exportData("Xls")}}>Xls</button>
                <button onClick={()=>{exportData("CSV")}}>CSV</button>

                </div>
                <div className="maintenance-search">
                <input type="text" id='search' onChange={(e)=>{setMaintenanceSearch(e.target.value)}}/>
                    <button onClick={searchMaintenance}>Search</button>

                </div>
                <div className="maintenance-list">
                    <table className='maintenance-table' ref={deliveryTable}>
                        <thead>
                            <tr>
                                <th>Trip ID</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Origin</th>
                                <th>Destination</th>
                                <th>Driver</th>
                                <th>Vehicle</th>
                                <th>Status</th>
                                <th>Tracking Code</th>
                                <th>Created Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                maintenanceData.map((e, i)=> 
                                {
                                    return(
                                    <tr key={i}>
                                        <td>{e?.t_id}</td>
                                        <td>{formatDate(e?.t_start_date)} </td>
                                        <td> {formatDate(e?.t_end_date)}</td>
                                        <td> {e.t_trip_fromlocation}</td>
                                        <td>{e.t_trip_tolocation} </td>
                                        <td> {e?.t_driver}</td>
                                        <td> {e?.t_vehicle}</td>
                                        <td> {e?.t_trip_status}</td>
                                        <td> {e?.t_trackingcode}</td>
                                        <td> {formatDateTime(e.t_created_date)}</td>
                                    </tr>
                                )})
                            }
                        </tbody>

                    </table>
                </div>
            </div>

        </div>
    )
}

export default DeliveryReports;