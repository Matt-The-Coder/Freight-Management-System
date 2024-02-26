import { Link, useOutletContext } from 'react-router-dom'
import '/public/assets/css/adminLayout/trackingTrips.css'
import axios from 'axios'
import { useState, useEffect } from 'react'
const AdminHistory = ({socket}) => {
    const { image, u_role, u_first_name, u_last_name, setIsLoading } = useOutletContext()
    const VITE_UPLOADING_SERVER = import.meta.env.VITE_UPLOADING_SERVER
    const hostServer = import.meta.env.VITE_SERVER_HOST;
    const [deliveriesStorage, setDeliveriesStorage] = useState([])
    const [driverStorage, setDriverStorage] = useState([])
    const [deliveries, setDeliveries] = useState([])
    const [filter, setFilter] = useState('All Trips')
    const [deliveryDriver, setDeliveryDriver] = useState([])
    useEffect(() => {
        socket.on('deliveryUpdate', (data) => {
                alert("Delivery Status Updated")
                location.reload()        
        });
        return () => socket.off('deliveryUpdate');
    
      }, [socket]);
    const getDeliveries = async () => {
        try {
            setIsLoading(true)
            const data = await axios.get(`${hostServer}/get-trips-admin`)
            const result = data.data
            setDeliveries(result.tripData)
            setDeliveryDriver(result.driverData);
            setDeliveriesStorage(result.tripData)
            setDriverStorage(result.driverData);
            console.log(result.tripData)
            console.log(result.driverData)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getDeliveries()
    }, [])
    return (
        <>
            <div className="trips">
                <div className="adminHeader">
                    <div className="left">
                        <h1>History</h1>
                        <ul className="breadcrumb">
                            <li><a href="#">
                            History
                            </a></li>
                            /
                            <li><a href="#" className="active">Deliveries</a></li>
                        </ul>
                    </div>
                </div>
                <div className="filter">
                    {/* <h3>Filter</h3> */}
                    <i class='bx bx-filter' ></i>
                    <select id="filter" value={filter} onChange={async(el)=>{
                        if(el.currentTarget.value == "all"){
                            setIsLoading(true)
                            setDeliveries(deliveriesStorage)
                            setDeliveryDriver(driverStorage);
                            setFilter(el.currentTarget.value)
                            setIsLoading(false)
                        }
                        else{
                            setIsLoading(true)
                            setFilter(el.currentTarget.value)
                            const filteredDeliveries = deliveriesStorage.filter((e)=>{return e.t_trip_status == el.currentTarget.value})
                            let filteredDriver = []
                            filteredDeliveries.forEach((deliveries)=>{
                                filteredDriver = driverStorage.filter((dDriver)=>{return dDriver.u_username == deliveries.t_driver})
                            })
                            console.log(filteredDeliveries)
                            console.log(filteredDriver)
                            setDeliveries(filteredDeliveries)
                            setDeliveryDriver(filteredDriver)
                            setIsLoading(false)
                        }

                        }}>
                        <option value="all">All Trips</option>
                        <option value="Completed">Completed Trips</option>
                        <option value="Cancelled">Cancelled Trips</option>
                    </select>
                </div>
                <div className="trips-list">
                {deliveries.length == 0 && <center><h1>No Trips Have Been Made Yet</h1></center>}
                    {deliveries.map((e, i) => {
                        let statusColor = '';
                        if (e.t_trip_status == 'Completed') {
                            statusColor = "#388E3C";
                        } else if (e.t_trip_status == 'In Progress') {
                            statusColor = '#FBC02D';
                        } else if (e.t_trip_status == 'Cancelled') {
                            statusColor = '#D32F2F';
                        }
                        return (
                            <div className="trips-container" key={i}>
                                <div className="delivery-info">
                                <div className="h3-container" style={{backgroundColor:statusColor}}>
                                    <h3 >{e.t_trip_status}</h3>
                                </div>
                                </div>
                                <div className="trips-header">
                                    <div className="header-container">
                                        <div className="header1">
                                            <div className="row1">
                                                <div className="img">
                                                    <img src={`${VITE_UPLOADING_SERVER}${deliveryDriver[i].u_profile_picture}`} alt="" />
                                                </div>
                                                <div className="name">
                                                    <h4>{`${deliveryDriver[i].u_first_name} ${deliveryDriver[i].u_last_name}`}</h4>
                                                </div>


                                            </div>
                                            <div className="row2">
                                                <h4>Driver</h4>
                                            </div>
                                        </div>
                                        <div className="header2">
                                            <h2>{e.t_trackingcode}</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="trips-content">
                                    <div className="main-content">
                                        <div className="content-design">
                                            <h1>•</h1>
                                            <p></p>
                                            <h1>•</h1>
                                        </div>
                                        <div className="content-locations">
                                            <div className="location-from">
                                                <h4>From:</h4>
                                                <p>{e.t_trip_fromlocation}</p>
                                            </div>
                                            <div className="location-to">
                                                <h4>To:</h4>
                                                <p>{e.t_trip_tolocation}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )
                    })}
                </div>
            </div>

        </>
    )
}

export default AdminHistory