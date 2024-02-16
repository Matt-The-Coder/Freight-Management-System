import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import '/public/assets/css/adminLayout/deliveries.css'
import axios from 'axios'
const DriverHistory = () => {
    const hostServer = import.meta.env.VITE_SERVER_HOST;
    const { u_username: username, setIsLoading, u_id: id } = useOutletContext()
    const [deliveries, setDeliveries] = useState([])
    const getDeliveries = async () => {
        try {
            setIsLoading(true)
            const data = await axios.get(`${hostServer}/get-completed-trip?username=${username}`)
            const result = data.data.reverse()
            setIsLoading(false)
            setDeliveries(result)

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getDeliveries()
    }, [])

    const formatDate = (date) => {
        const newDate = new Date(date);
        const formattedDate = newDate.toLocaleString();
        return formattedDate;
      };

    return (
        <div className="DriverHistory">
            <div className="adminHeader">
                <div className="left">
                    <h1>History</h1>
                    <ul className="breadcrumb">
                        <li><a href="#">
                            Analytics
                        </a></li>
                        /
                        <li><a href="#" className="active">Metrics</a></li>
                    </ul>
                </div>
            </div>
            <div className="deliveries-list">
                {deliveries.length == 0 && <center><h1>No Deliveries Yet</h1></center>}
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
                                    <h4>Estimated Travel Time: 28 mins</h4>
                                    <h4>Estimated Total Distance: 106 km</h4>
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
                        </div>
                    )

                })}

            </div>



        </div>
    )
}

export default DriverHistory