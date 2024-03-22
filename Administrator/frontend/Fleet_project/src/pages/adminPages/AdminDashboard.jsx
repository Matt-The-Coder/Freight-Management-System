import { useEffect, useRef, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import {Line, Bar, Doughnut} from 'react-chartjs-2'
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import '/public/assets/css/adminLayout/dashboardAdmin.css';



const AdminDashboard = ({socket}) => {
    const { u_name, theme, setIsLoading } = useOutletContext()
    const [deliveries, setDeliveries] = useState([])
    const [sustainData, setSustainData] = useState([])
    const [fuelData, setFuelData] = useState()
    const [emissionData, setEmissionData] = useState()
    const hostServer = import.meta.env.VITE_SERVER_HOST;
    useEffect(()=>{
        if(theme == "light")
        {
            defaults.color = "#363949";
        }else {
            defaults.color = "white";
        }
    }, [theme])
    function formatDateTime(datetimeStr) {
        var datetime = new Date(datetimeStr);
        var options = {
            month: 'long',
        };
        // Format the date and time using options
        var formattedDateTime = datetime.toLocaleString('en-US', options);
        return formattedDateTime;
    }
    const downloadEmission = async () =>{
        const pdf = new jsPDF("portrait", "pt", "a4");
        const data = await html2canvas(document.querySelector("#emissionTable"));
        const img = data.toDataURL("image/png");  
        const imgProperties = pdf.getImageProperties(img);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
        pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("annual_emission_chart.pdf");
      
    }
    const downloadFuel = async () =>{
        const pdf = new jsPDF("portrait", "pt", "a4");
        const data = await html2canvas(document.querySelector("#fuelTable"));
        const img = data.toDataURL("image/png");  
        const imgProperties = pdf.getImageProperties(img);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
        pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("annual_fuel_chart.pdf");
      
    }
    const getDeliveries = async () => {
        try {
            const data = await axios.get(`${hostServer}/get-all-trips`)
            const result = data.data
            setDeliveries(result)

        } catch (error) {
            console.log(error)
        }
    }
    const getSustainData = async () => {
        try {
            setIsLoading(true)
            const data = await axios.get(`${hostServer}/getSustainableData`)
            const result = data.data
            setSustainData(result)
            let totalFuel = 0
            let totalEmission = 0
            result.carbonEmissions?.forEach((e)=>{
                let parsed = e.total_emission
                totalEmission += parsed
            })
            result.fuelConsumption?.forEach((e)=>{
                let parsed = e.total_fuel_consumption
                totalFuel += parsed
            })
            setEmissionData(totalEmission.toFixed(2))
            setFuelData(totalFuel.toFixed(2))
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
            case "Completed": numTrips = deliveries.filter((e)=>{return e.t_trip_status == type})
            break;
            case "In Progress": numTrips = deliveries.filter((e)=>{return e.t_trip_status == type})
            break;
            default:null
        }
        return numTrips.length;
  
    }
    useEffect(()=>{
        getDeliveries();
        getSustainData();
    },[u_name])
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
            <Link to="/admin/history/list">
            <div className="trip-box">
                <div className="trip-box-header">
                    <h2>Overall Trips</h2>
                </div>
                <div className="trip-box-content">
                    <div className="trip-box-logo">
                    <i className='bx bx-car' id="trips-car-overall"></i>
                    </div>
                    <div className="trip-box-number">
                        <h3>{deliveries.length}</h3>
                    </div>
                </div>
            </div></Link>
            <Link to="/admin/history/list">
            <div className="trip-box">
                <div className="trip-box-header">
                    <h2>Completed Trips</h2>
                </div>
                <div className="trip-box-content">
                    <div className="trip-box-logo">
                    <i className='bx bx-car' id="trips-car-completed"></i>
                    </div>
                    <div className="trip-box-number">
                        <h3>{getNumberTrips("Completed")}</h3>
                    </div>
                </div>
            </div></Link>
            <Link to="/admin/history/list">
            <div className="trip-box">
                <div className="trip-box-header">
                    <h2>Cancelled Trips</h2>
                </div>
                <div className="trip-box-content">
                    <div className="trip-box-logo">
                    <i className='bx bx-car' id="trips-car-unsuccessful"></i>
                    </div>
                    <div className="trip-box-number">
                        <h3>{getNumberTrips("Cancelled")}</h3>
                    </div>
                </div>
            </div></Link>
            <Link to="/admin/tracking/trips/upcoming">
            <div className="trip-box">
                <div className="trip-box-header">
                    <h2>Pending Trips</h2>
                </div>
                <div className="trip-box-content">
                    <div className="trip-box-logo">
                    <i className='bx bx-car' id="trips-car-pending"></i>
                    </div>
                    <div className="trip-box-number">
                        <h3>{getNumberTrips("Pending")}</h3>
                    </div>
                </div>
            </div></Link>
            <Link to="/admin/tracking/trips/ongoing">
            <div className="trip-box">
                <div className="trip-box-header">
                    <h2>In Progress Trips</h2>
                </div>
                <div className="trip-box-content">
                    <div className="trip-box-logo">
                    <i className='bx bx-car' id="trips-car-ongoing"></i>
                    </div>
                    <div className="trip-box-number">
                        <h3>{getNumberTrips("In Progress")}</h3>
                    </div>
                </div>
            </div></Link>
            <a href="#Chart">
            <div className="trip-box">
                <div className="trip-box-header">
                    <h2>Total Carbon Emissions</h2>
                </div>
                <div className="trip-box-content">
                    <div className="trip-box-logo">
                    <i className='bx bx-wind' id="trips-car-emission"></i>
                    </div>
                    <div className="trip-box-number">
                        <h3>{emissionData}g</h3>
                    </div>
                </div>
            </div>
            </a>
            <a href="#Chart">
            <div className="trip-box">
                <div className="trip-box-header">
                    <h2>Total Fuel Consumption</h2>
                </div>
                <div className="trip-box-content">
                    <div className="trip-box-logo">
                    <i className='bx bx-gas-pump' id="trips-car-fuel"></i>
                    </div>
                    <div className="trip-box-number">
                        <h3>{fuelData}l</h3>
                    </div>
                </div>
            </div>
            </a>


            </div>
           
           <div className="dashboard-charts" id="Chart">
            <div className="dashboard-charts-container">
                <div className="export">
                    <h3>Export as:</h3>
                    <button onClick={downloadEmission}>PDF</button>
                </div>
                <div className="kpi-card" >
            <Line id="emissionTable" data={{
                    labels: ["January","February","March","April","May","June","July","August","September","October","November","December"],
                    datasets:[
                    {
                        label:"Emissions in grams",
                        data:sustainData.carbonEmissions?.map((e)=>{return e.total_emission})
                    },
                    ],

                }}
                options={{
                    plugins: {
                        title: {
                            text:"Annual Carbon Emissions"
                        }
                    }
                }}/>
            </div>

            </div>
            <div className="dashboard-charts-container">
                <div className="export">
                    <h3>Export as:</h3>
                    <button onClick={downloadFuel}>PDF</button>
                </div>
                <div className="kpi-card" >
            <Line  id="fuelTable"  data={{
                    labels: ["January","February","March","April","May","June","July","August","September","October","November","December"],
                    datasets:[
                    {
                        label:"Fuel Usage in Liters",
                        data:sustainData.fuelConsumption?.map((e)=>{return e.total_fuel_consumption})
                    },
                    ],

                }}
                options={{
                    plugins: {
                        title: {
                            text:"Annual Fuel Consumption"
                        }
                    }
                }}/>
            </div>

            </div>


           </div>

            </div>

    )
}

export default AdminDashboard;