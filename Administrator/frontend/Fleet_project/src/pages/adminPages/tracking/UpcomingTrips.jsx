import { Link, useOutletContext } from 'react-router-dom'
import '/public/assets/css/adminLayout/trackingTrips.css'
import axios from 'axios'
import { useState, useEffect } from 'react'
const UpcomingTrips = ({ socket }) => {
    const { image, u_role, u_first_name, u_last_name, setIsLoading } = useOutletContext()
    const VITE_UPLOADING_SERVER = import.meta.env.VITE_UPLOADING_SERVER
    const hostServer = import.meta.env.VITE_SERVER_HOST;
    const [deliveries, setDeliveries] = useState([])
    const [filterData, setFilterData] = useState('')
    const [deliveriesStorage, setDeliveriesStorage] = useState([])
    const getDeliveries = async () => {
        try {
            setIsLoading(true)
            const data = await axios.get(`${hostServer}/get-pending-trips`)
            const result = data.data
            setDeliveries(result)
            setDeliveriesStorage(result)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
        }
    }
    const filterDeliveries = (e) => {
        if (e == "") {
            setDeliveries(deliveriesStorage)
            setFilterData(e)
        } else {
            setFilterData(e)
            const filteredDeliveries = deliveriesStorage.filter((d) => {
                const formattedDate = formatDateInput(d.t_start_date);
                if(formattedDate == e){
                    return d;
                }
            })
            setDeliveries(filteredDeliveries)
        }
        console.log(e)
    }

    const formatDate = (date) => {
        const newDate = new Date(date);
        const formattedDate = newDate.toLocaleString();
        return formattedDate;
    };
    const formatDateInput = (date) => {
        const formattedDate = new Date(date);
        formattedDate.setDate(formattedDate.getDate());
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
                        <h1>Upcoming Trips</h1>
                        <ul className="breadcrumb">
                            <li><a href="#">
                                Tracking
                            </a></li>
                            /
                            <li><a href="#" className="active">Upcoming Trips</a></li>
                        </ul>
                    </div>
                </div>
                <div className="filter">
                {/* <h3>Filter</h3> */}
                <div className="filter-container">
                    <p htmlFor=""> Start Date</p>
                    <div className="filter-input">
                        <input type="date" id='date-input' value={filterData} onChange={(e) => { filterDeliveries(e.currentTarget.value) }} />
                        <i className='bx bx-filter' ></i>
                    </div>

                </div>

            </div>
                <div className="trips-list">
                    {deliveries.length == 0 && <center><h1>No Upcoming Trips at the Moment</h1></center>}
                    {deliveries.map((e, i) => {

                        return (
                            <div className="trips-container" key={i}>
                                <div className="trips-header">
                                    <div className="time-container">
                                        <p>Order Date: {formatDate(e.t_created_date)}</p>
                                    </div>
                                    <div className="header-container">
                                        <div className="header1">
                                            <div className="row1">
                                                <div className="img">
                                                    <img src={`${VITE_UPLOADING_SERVER}${e.d_picture}`} alt="" />
                                                </div>
                                                <div className="name">
                                                    <h4>{`${e.d_first_name} ${e.d_last_name}`}</h4>
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
                                    <div className="trip-date">
                                        <div className="s-trip-date">
                                            <h4>Start Date:</h4>
                                            <p>{formatDate(e.t_start_date)}</p>
                                        </div>
                                        <div className="e-trip-date">
                                            <h4>End Date:</h4>
                                            <p>{formatDate(e.t_end_date)}</p>
                                        </div>

                                    </div>
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
                                    {/* <div className="trips-button">
                                    <a href={`/admin/tracking/live/${e.t_id}`}><button>View On Map</button></a>
                                </div> */}
                                </div>

                            </div>
                        )
                    })}
                </div>
            </div>

        </>
    )
}

export default UpcomingTrips