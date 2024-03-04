import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import {Line, Bar, Doughnut} from 'react-chartjs-2'
import '/public/assets/css/adminLayout/dashboardAdmin.css';
import axios from "axios";


const DriverDashboard = ({socket}) => {
    const { u_name, theme, u_username, setIsLoading } = useOutletContext()
    const [deliveries, setDeliveries] = useState([])
    const [refresh, setRefresh] = useState(false)
    const hostServer = import.meta.env.VITE_SERVER_HOST;
    useEffect(()=>{
        if(theme == "light")
        {
            defaults.color = "#363949";
        }else {
            defaults.color = "white";
        }
    }, [theme])

    const getDeliveries = async () => {
        try {
            setIsLoading(true)
            const data = await axios.get(`${hostServer}/get-all-trips?user=${u_username}`)
            const result = data.data
            console.log(result)
            setDeliveries(result)
            setRefresh(true)
            setIsLoading(false)


        } catch (error) {
            console.log(error)
        }
    }

    const getNumberTrips = (type) => {
        let numTrips = ""
        switch(type){
            case "Pending": numTrips = deliveries.filter((e)=>{return e.t_trip_status == type})
            break;
            case "Cancelled": numTrips = deliveries.filter((e)=>{return e.t_trip_status == type})
            break;
            case "Completed": {numTrips = deliveries.filter((e)=>{return e.t_trip_status == type})}
            break;
            case "In Progress": numTrips = deliveries.filter((e)=>{return e.t_trip_status == type})
            break;
            default:null
        }
        return numTrips.length;
    }
    useEffect(()=>{
        getDeliveries();
    },[refresh])
    useEffect(() => {
        socket.on('deliveryUpdate', (data) => {
                alert("Delivery Status Updated")
                location.reload()        
        });
        return () => socket.off('deliveryUpdate');
    
      }, [socket]);
defaults.maintainAspectRatio = false
defaults.responsive = true
defaults.plugins.title.display = true
defaults.plugins.title.align = "center"
defaults.plugins.title.font.size = 25
    return (
            <div className="adminDashboard">
            <div className="adminHeader">
                <div className="left">
                    <h1>Dashboard</h1>
                    <ul className="breadcrumb">
                        <li><a href="#">
                            Analytics
                        </a></li>
                        /
                        <li><a href="#" className="active">Metrics</a></li>
                    </ul>
                </div>
            </div>
            <div className="kpi-cards">
            <div className="trip-box">
                <div className="trip-box-header">
                    <h2>Overall Trips</h2>
                </div>
                <div className="trip-box-content">
                    <div className="trip-box-logo">
                    <i class='bx bx-car' id="trips-car-overall"></i>
                    </div>
                    <div className="trip-box-number">
                        <h3>{deliveries.length}</h3>
                    </div>
                </div>
            </div>
            <div className="trip-box">
                <div className="trip-box-header">
                    <h2>Completed Trips</h2>
                </div>
                <div className="trip-box-content">
                    <div className="trip-box-logo">
                    <i class='bx bx-car' id="trips-car-completed"></i>
                    </div>
                    <div className="trip-box-number">
                        <h3>{getNumberTrips("Completed")}</h3>
                    </div>
                </div>
            </div>
            <div className="trip-box">
                <div className="trip-box-header">
                    <h2>Cancelled Trips</h2>
                </div>
                <div className="trip-box-content">
                    <div className="trip-box-logo">
                    <i class='bx bx-car' id="trips-car-unsuccessful"></i>
                    </div>
                    <div className="trip-box-number">
                        <h3>{getNumberTrips("Cancelled")}</h3>
                    </div>
                </div>
            </div>
            <div className="trip-box">
                <div className="trip-box-header">
                    <h2>Pending Trips</h2>
                </div>
                <div className="trip-box-content">
                    <div className="trip-box-logo">
                    <i class='bx bx-car' id="trips-car-pending"></i>
                    </div>
                    <div className="trip-box-number">
                        <h3>{getNumberTrips("Pending")}</h3>
                    </div>
                </div>
            </div>
            <div className="trip-box">
                <div className="trip-box-header">
                    <h2>In Progress Trips</h2>
                </div>
                <div className="trip-box-content">
                    <div className="trip-box-logo">
                    <i class='bx bx-car' id="trips-car-ongoing"></i>
                    </div>
                    <div className="trip-box-number">
                        <h3>{getNumberTrips("In Progress")}</h3>
                    </div>
                </div>
            </div>

           

            </div>
           

            </div>

    )
}

export default DriverDashboard;