import { useEffect, useRef, useState } from 'react'
import '/public/assets/css/adminLayout/maintenance.css'
import axios from "axios"
import * as XLSX from 'xlsx';
import {Link, useNavigate, useOutletContext} from "react-router-dom"
const DeliveryReports = ({socket}) => {
    const nav = useNavigate()
    
    const {setIsLoading} = useOutletContext()
    const [isDelete, setIsDelete] = useState(false)
    const [DeliveryReports, setDeliveryReports] = useState([])
    const [deliveryReportsStorage, setDeliveryReportsStorage] = useState([])
    const hostServer = import.meta.env.VITE_SERVER_HOST
    const [maintenanceSearch, setMaintenanceSearch] = useState('')
    const [filter, setFilter] = useState('all')
    const deliveryTable = useRef(null)
    const getMaintenanceList = async () => {
        setIsLoading(true)
        const fetchMaintenance = await axios.get(`${hostServer}/get-trip-reports`)
        const  data = fetchMaintenance.data;
        setDeliveryReports(data)
        setDeliveryReportsStorage(data)
        setIsLoading(false)
    }
    const searchMaintenance = async() =>
    {
        setIsLoading(true)
        const fetchMaintenance = await axios.get(`${hostServer}/trip-search?search=${maintenanceSearch}`)
        const filteredData = fetchMaintenance.data
        setDeliveryReports(filteredData)
        setIsLoading(false)
    }
    useEffect(() => {
        socket.on('deliveryUpdate', (data) => {
                alert("Delivery Status Updated")
                location.reload()        
        });
        return () => socket.off('deliveryUpdate');
    
      }, [socket]);
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
                        <li><a href="#" className='active'>Deliveries Reports</a></li>
                    </ul>
                </div>
            </div>
            <div className="filter">
                    {/* <h3>Filter</h3> */}
                    <i class='bx bx-filter' ></i>
                    <select id="filter" value={filter} onChange={async(el)=>{
                        if(el.currentTarget.value == "all"){
                            setIsLoading(true)
                            setDeliveryReports(deliveryReportsStorage)
                            setFilter(el.currentTarget.value)
                            setIsLoading(false)
                        }
                        else{
                            setIsLoading(true)
                            setFilter(el.currentTarget.value)
                            const filterReports = deliveryReportsStorage.filter((e, i)=>{
                                return e.t_trip_status == el.currentTarget.value
                            })
                            // const filteredDeliveries = deliveriesStorage.filter((e)=>{return e.t_trip_status == el.currentTarget.value})
                            // let filteredDriver = []
                            // filteredDeliveries.forEach((deliveries)=>{
                            //    let filterDriver = driverStorage.find((dDriver)=>{return dDriver.u_username == deliveries.t_driver})
                            //    filteredDriver.push(filterDriver)
                            // })
                            setDeliveryReports(filterReports)
                            console.log(deliveryReportsStorage)

                            setIsLoading(false)
                        }

                        }}>
                        <option value="all">All Trips</option>
                        <option value="Completed">Completed Trips</option>
                        <option value="Cancelled">Cancelled Trips</option>
                        <option value="In Progress">In Progress Trips</option>
                        <option value="Pending">Pending Trips</option>
                    </select>
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
                                <th>Trip Report</th>
                                <th>Tracking Code</th>
                                <th>Created Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                DeliveryReports.map((e, i)=> 
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
                                        <td> {e?.t_remarks? e.t_remarks:"N/A"} </td>
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