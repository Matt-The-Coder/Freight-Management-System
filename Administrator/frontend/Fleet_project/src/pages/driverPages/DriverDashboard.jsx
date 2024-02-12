import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import {Line, Bar, Doughnut} from 'react-chartjs-2'



const DriverDashboard = () => {
    const { u_name, theme } = useOutletContext()
    useEffect(()=>{
        if(theme == "light")
        {
            defaults.color = "#363949";
        }else {
            defaults.color = "white";
        }
    }, [theme])

defaults.maintainAspectRatio = false
defaults.responsive = true
defaults.plugins.title.display = true
defaults.plugins.title.align = "center"
defaults.plugins.title.font.size = 25
    return (
            <div className="driverDashboard">
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
            <div className="kpi-card">
                <Bar data={{
                    labels: ["Car1", "Car2", "Car3"],
                    datasets:[
                        {
                        label:"Price",
                        data:[50,60,70],
                        backgroundColor: ["Blue", "Orange", "Yellow"],
                        borderRadius:10
                    },
                    {
                        label:"Fuel",
                        data:[50,60,70]
                    },
                    ],
                    
                }}
                options={{
                    plugins: {
                        title: {
                            text:"Car Data"
                        }
                    }
                }}/>
            </div>
            <div className="kpi-card">
            <Doughnut data={{
                    labels: ["Car1", "Car2", "Car3"],
                    datasets:[
                        {
                        label:"Price",
                        data:[50,60,70]
                    },
                    {
                        label:"Fuel",
                        data:[50,60,70]
                    },
                    ],

                }}
                options={{
                    plugins: {
                        title: {
                            text:"Car Data"
                        }
                    }
                }}/>
            </div>
            <div className="kpi-card">
            <Line data={{
                    labels: ["Car1", "Car2", "Car3"],
                    datasets:[
                    {
                        label:"Price",
                        data:[50,60,70]
                    },
                    {
                        label:"Fuel",
                        data:[20,10,90]
                    },
                    ],

                }}
                options={{
                    plugins: {
                        title: {
                            text:"Car Data"
                        }
                    }
                }}/>
            </div>
            <div className="kpi-card">
            <Bar data={{
                    labels: ["Car1", "Car2", "Car3"],
                    datasets:[
                        {
                        label:"Price",
                        data:[50,60,70]
                    },
                    {
                        label:"Fuel",
                        data:[50,60,70]
                    },
                    ],

                }}
                options={{
                    plugins: {
                        title: {
                            text:"Car Data"
                        }
                    }
                }}/>
            </div>
            </div>
           
       
            </div>

    )
}

export default DriverDashboard;