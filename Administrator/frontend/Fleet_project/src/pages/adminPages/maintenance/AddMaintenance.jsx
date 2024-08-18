import { useEffect, useRef, useState } from 'react';
import '/public/assets/css/adminLayout/maintenance.css';
import { Link, useNavigate, useOutletContext } from "react-router-dom"
import axios from 'axios';
const AddMaintenance = () => {

  const { setIsLoading } = useOutletContext()
  const hostServer = import.meta.env.VITE_SERVER_HOST
  const nav = useNavigate()
  const [vehicleList, setVehicleList] = useState([])
  const [vehicle, setVehicle] = useState();
  const [sDate, setSDate] = useState();
  const [eDate, setEDate] = useState();
  const [details, setDetails] = useState();
  const [cost, setCost] = useState();
  const [mService, setMService] = useState('')
  const [status, setStatus] = useState();

  const maintenanceServices = [
    "Oil Change",
    "Brake Inspection/Service",
    "Tire Rotation",
    "Wheel Alignment",
    "Battery Check/Replacement",
    "Engine Tune-up",
    "Transmission Service",
    "Coolant Flush",
    "Air Filter Replacement",
    "Fuel Filter Replacement",
    "Spark Plug Replacement",
    "Timing Belt Replacement",
    "Serpentine Belt Replacement",
    "Power Steering Fluid Flush",
    "Suspension Inspection/Service",
    "Exhaust System Inspection/Service",
    "HVAC System Inspection/Service",
    "Windshield Wiper Blade Replacement",
    "Headlight/Taillight Bulb Replacement",
    "Fluid Level Check/Top-up",
    "DPF (Diesel Particulate Filter) Cleaning/Replacement",
    "EGR (Exhaust Gas Recirculation) System Cleaning/Service",
    "DEF (Diesel Exhaust Fluid) Refill/Service",
    "Trailer Hitch Inspection/Service",
    "Fifth Wheel Inspection/Service",
    "Trailer Brake Inspection/Service",
    "Trailer Suspension Inspection/Service",
    "Trailer Lighting Inspection/Service",
    "Trailer Tire Inspection/Service",
    "Trailer Coupling Inspection/Service"
  ];
  const maintenanceStatusOptions = [
    "Scheduled",
    "In Progress",
    "Completed",
    "Cancelled",
    "Failed",
    "Deferred",
    "On Hold"
  ];

  const createMaintenance = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const result = await axios.post(`${hostServer}/add-maintenance`,
      { vehicle, startDate: sDate, endDate: eDate, details, cost, mService, status })
    setIsLoading(false)
    alert("Created Successfully!")
    nav('/admin/maintenance/list')
  }

  const formatDate = (date) => {
    const formattedDate = new Date(date).toISOString().split("T")[0];
    return formattedDate
  }

  const getAllVehicles = async () => {
    try {
      const res = await axios.get(`${hostServer}/retrieve-vehicles-maintenance`)
      const data = res.data
      setVehicleList(data)
    } catch (error) {

    }
  }
  const getAllDrivers = async () => {
    try {
      const res = await axios.get(`${hostServer}/retrieve-drivers`)
      const data = res.data
      setDriverList(data)
      console.log(data)
    } catch (error) {

    }
  }

  useEffect(() => {
    getAllVehicles()
    getAllDrivers()
  }, [])
  return (
    <div className="AddMaintenance">
      <div className="adminHeader">
        <div className="left">
          <h1>Maintenance</h1>
          <ul className="breadcrumb">
            <li>
              <a to="#">Maintenance</a>
            </li>
            /
            <li>
              <a href="#" className="active">
                Add Maintenance
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="vehicle-maintenance">
        <div className="vehicle-details">
          <form onSubmit={(e)=>{createMaintenance(e)}}>
          <div className="select-vehicle">
            <h4>Select Vehicle</h4>
            <select required name="select-vehicle" id="select-vehicle" onChange={(e) => { setVehicle(e.currentTarget.value) }}>
              <option disabled selected>Select Vehicle</option>
              {vehicleList.map((e, i) => {
                return <option key={i} value={e.name}>{e.name}</option>
              })}
            </select>
          </div>
          <div className="maintenance-date">
            <div className="start">
              <h4>
                <span>Maintenance</span> Start Date
              </h4>
              <input required type="date" name="" id="" onChange={(e) => { setSDate(formatDate(e.currentTarget.value)) }} />
            </div>
            <div className="end">
              <h4>
                <span>Maintenance</span> End Date
              </h4>
              <input required type="date" name="" id="" onChange={(e) => { setEDate(formatDate(e.currentTarget.value)) }} />
            </div>
          </div>
          <div className="service-details">
            <h4>Service Details</h4>
            <textarea required name="service-details" id="service-details" onChange={(e) => { setDetails(e.currentTarget.value) }} cols="45" rows="6" placeholder='Enter Details'></textarea>
          </div>
          <div className="cost-vendor">
            <div className="cost">
              <h4>Total Cost</h4>
              <input required min="1" type="number" placeholder='Enter Price' onChange={(e) => { setCost(e.currentTarget.value) }} />
            </div>
          </div>
          <div className="parts-qty">
            <div className="parts-name">
              <h4>Maintenance Service</h4>
              <select required name="parts" id="parts" onChange={(e) => { setMService(e.currentTarget.value) }}>
                <option disabled selected>Select Service</option>
                {maintenanceServices.map((e) => {
                  return (
                    <option value={e}>{e}</option>
                  )
                })}
              </select>
            </div>

          </div>
          <div className="maintenance-status">
            <h4>Maintenance Status</h4>
            <select required name="maintenance-status" id="maintenance-status" onChange={(e) => { setStatus(e.currentTarget.value) }}>
              <option disabled selected>Choose Status</option>
              <option value="Scheduled">Scheduled</option>
            </select>
          </div>
          <div className="save">
            <button type='submit'>Create</button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMaintenance;