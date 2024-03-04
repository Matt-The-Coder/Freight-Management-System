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
    const [filter, setFilter] = useState('all')
    const [deliveryDriver, setDeliveryDriver] = useState([])
    const [sustain, setSustain] = useState([])
    const [sustainStorage, setSustainStorage] = useState([])
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
            setSustain(result.sustain)
            setSustainStorage(result.sustain)
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

    const openModal = (e) => {
        const num = e
        const modalInfo = document.querySelector("#modal" + e)
        const modalbg = document.querySelector("#modalbg" + e)
        const modalb = document.querySelector("#modalb" + e)
            modalInfo.style.display = "block"
            modalb.style.display = 'block' 
            modalbg.style.display = 'block'

            console.log(modalInfo)
            console.log(modalbg)
            console.log(modalb)
    }
    const closeModal = (e) => {
        const num = e
        const modalInfo = document.querySelector("#modal" + e)
        const modalbg = document.querySelector("#modalbg" + e)
        const modalb = document.querySelector("#modalb" + e)
            modalInfo.style.display = "none"
            modalb.style.display = 'none' 
            modalbg.style.display = 'none'
        
    }
    const formatDate = (date) => {
        const formattedDate = new Date(date);
        formattedDate.setDate(formattedDate.getDate() + 1);
        return formattedDate.toISOString().split("T")[0];
      };



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
                            let filteredSustain = []
                            filteredDeliveries.forEach((deliveries)=>{
                               let filterDriver = driverStorage.find((dDriver)=>{return dDriver.u_username == deliveries.t_driver})
                               filteredDriver.push(filterDriver)
                            })
                            filteredDeliveries.forEach((deliveries)=>{
                                let filterSustain = sustainStorage.find((sus)=>{return sus.sd_trip_id == deliveries.t_id})
                                filteredSustain.push(filterSustain)
                             })
                            setDeliveries(filteredDeliveries)
                            setDeliveryDriver(filteredDriver)
                            setSustain(filteredSustain)
                            setIsLoading(false)
                        }

                        }}>
                        <option value="all">All Trips</option>
                        <option value="Completed">Completed Trips</option>
                        <option value="Cancelled">Cancelled Trips</option>
                    </select>
                </div>
                <div className="trips-list">
                {deliveries.length == 0 && <center><h1>No Trips Found</h1></center>}
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
                                <div className="more-info">
                                    <button onClick={()=>{openModal(i)}}>More Info</button>
                                    <div className="more-info-modal" id={`modal${i}`}>
                                        <div className="more-info-background" id={`modalbg${i}`}></div>
                                        <div className="more-info-modal-box" id={`modalb${i}`}>
                                            <div className="exit">
                                            <i class='bx bx-window-close' onClick={()=>{closeModal(i)}}></i>
                                            </div>
                                            <h3>History Information</h3>
                                            <div className="info">
                                                <div className="info-1">
                                                    <p>Start: {formatDate(e.t_start_date)}</p>
                                                    <p>End: {formatDate(e.t_end_date)}</p>
                                                    <p>Duration: {e.t_totaldrivetime}</p>
                                                    <p>Distance: {e.t_totaldistance?.toFixed(2)} km</p>
                                                
                                              
                                                
                                                </div>
                                                <div className="info-2">
                                                <p>Vehicle: {e.t_vehicle}</p>
                                                    <p>Weather: {sustain[i]?.sd_current_weather}</p>
                                                    <p>Total Emission: {sustain[i]?.sd_carbon_emission}</p>
                                                    <p>Total Fuel Usage: {sustain[i]?.sd_fuelconsumption}</p>
                                                    <p>Total Weight: {e.t_totalweight}kg</p>
                                                   
                                                
                                                
                                                
                                                </div>
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