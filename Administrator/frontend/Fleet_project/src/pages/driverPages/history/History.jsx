import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import '/public/assets/css/adminLayout/deliveries.css'
import '/public/assets/css/adminLayout/trackingTrips.css'
import axios from 'axios'
const DriverHistory = () => {
    const hostServer = import.meta.env.VITE_SERVER_HOST;
    const { d_username: username, setIsLoading, d_id: id } = useOutletContext()
    const [filter, setFilter] = useState("all")
    const [deliveriesStorage, setDeliveriesStorage] = useState([])
    const [deliveries, setDeliveries] = useState([])
    const [sustain, setSustain] = useState([])
    const [sustainStorage, setSustainStorage] = useState([])
    const getDeliveries = async () => {
        try {
            setIsLoading(true)
            const data = await axios.get(`${hostServer}/get-completed-trip?username=${id}`)
            const result = data.data.reverse()
            setIsLoading(false)
            setDeliveriesStorage(result)
            setDeliveries(result)

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

      function convertKm(mile) {
        const kilometers = 1.60934 * mile;
        return kilometers.toFixed(2);
      }

    return (
        <div className="DriverHistory">
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
                    <i className='bx bx-filter' ></i>
                    <select id="filter" value={filter} onChange={async(el)=>{
                        if(el.currentTarget.value == "all"){
                            setIsLoading(true)
                            setDeliveries(deliveriesStorage)
                            setFilter(el.currentTarget.value)
                            setIsLoading(false)
                        }
                        else{
                            setIsLoading(true)
                            setFilter(el.currentTarget.value)
                            const filteredDeliveries = deliveriesStorage.filter((e)=>{return e.t_trip_status == el.currentTarget.value})
                            console.log(filteredDeliveries)
                            setDeliveries(filteredDeliveries)
                            setIsLoading(false)
                        }

                        }}>
                        <option value="all">All Trips</option>
                        <option value="Completed">Completed Trips</option>
                        <option value="Cancelled">Cancelled Trips</option>
                    </select>
                </div>
            <div className="deliveries-list">
                {deliveries.length == 0 && <center><h1>No Trips Found!</h1></center>}
                {deliveries?.map((e, i) => {
                        let statusColor = '';
                        if (e.t_trip_status == 'Completed') {
                            statusColor = "#388E3C";
                        } else if (e.t_trip_status == 'In Progress') {
                            statusColor = '#FBC02D';
                        } else if (e.t_trip_status == 'Cancelled') {
                            statusColor = '#D32F2F';
                        }
                                
                    return (
                        <div className="deliveries-container" key={i}>
                            <div className="delivery-info">
                                <div className="first-container"></div>
                                <div className="second-container">
                                <div className="h3-container" style={{backgroundColor:statusColor}}>
                                    <h3 >{e.t_trip_status}</h3>
                                </div>
                                </div>
                                <div className="time-container">
                                    <p>{formatDate(e.t_modified_date)}</p>
                                </div>

                            </div>
                            <div className="deliveries-header">
                                <div className="header1">
                                    <h4>Estimated Travel Time: {e.t_totaldrivetime}</h4>
                                    <h4>Estimated Total Distance: {convertKm(e.t_totaldistance)} km</h4>
                                </div>
                            </div>
                            <div className="deliveries-content">
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
                                            <i className='bx bx-window-close' onClick={()=>{closeModal(i)}}></i>
                                            </div>
                                            <h3>History Information</h3>
                                            <div className="info">
                                                <div className="info-1">
                                                    <p>Start: {formatDate(e.t_start_date)}</p>
                                                    <p>End: {formatDate(e.t_end_date)}</p>

                                                
                                              
                                                
                                                </div>
                                                <div className="info-2">
                                                <p>Vehicle: {e.t_vehicle}</p>
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
    )
}

export default DriverHistory