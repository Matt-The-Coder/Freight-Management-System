import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
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
    const emissionTable = useRef(null)
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
        console.log(datetime)
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
        pdf.save("shipping_label.pdf");
      
    }
    const getDeliveries = async () => {
        try {
            setIsLoading(true)
            const data = await axios.get(`${hostServer}/get-all-trips`)
            const result = data.data
            setIsLoading(false)
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
            setIsLoading(false)
            setSustainData(result)

        } catch (error) {
            console.log(error)
        }
    }

    const getNumberTrips = (type) => {
        let numTrips = ""
        switch(type){
            case "Pending": numTrips = deliveries.filter((e)=>{return e.t_trip_status == type})
            break;
            case "Unsuccessful ": numTrips = deliveries.filter((e)=>{return e.t_trip_status == type})
            break;
            case "Completed ": numTrips = deliveries.filter((e)=>{return e.t_trip_status == type})
            break;
            case "In Progress": numTrips = deliveries.filter((e)=>{return e.t_trip_status == type})
            break;
            default:console.log("Hello")
        }
        return numTrips.length;
    }
    useEffect(()=>{
        getDeliveries();
        getSustainData();
    },[])
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
                    <h2>Unsuccessful Trips</h2>
                </div>
                <div className="trip-box-content">
                    <div className="trip-box-logo">
                    <i class='bx bx-car' id="trips-car-unsuccessful"></i>
                    </div>
                    <div className="trip-box-number">
                        <h3>{getNumberTrips("Unsuccessful")}</h3>
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
           
           <div className="dashboard-charts">
            <div className="dashboard-charts-container">
                <div className="export">
                    <h3>Export as:</h3>
                    <button onClick={downloadEmission}>PDF</button>
                </div>
                <div className="kpi-card" ref={emissionTable} id="emissionTable">
            <Line  data={{
                    labels: ["January","February","March","April","May","June","July","August","September","October","November","December"],
                    datasets:[
                    {
                        label:"Emissions in grams",
                        data:[50,60,70]
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



           </div>

            </div>

    )
}

export default AdminDashboard;