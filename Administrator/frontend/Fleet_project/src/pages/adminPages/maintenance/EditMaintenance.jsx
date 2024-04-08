import { useEffect, useRef, useState } from 'react';
import '/public/assets/css/adminLayout/maintenance.css';
import { Link, useNavigate, useParams, useOutletContext } from "react-router-dom"
import axios from 'axios';
const EditMaintenance = () => {
  const { maintenanceID } = useParams();
  const nav = useNavigate()

  const { setIsLoading } = useOutletContext()
  const hostServer = import.meta.env.VITE_SERVER_HOST
  const [vehicleList, setVehicleList] = useState([])
  const [driverList, setDriverList] = useState([])
  const [vehicle, setVehicle] = useState();
  const [sDate, setSDate] = useState();
  const [eDate, setEDate] = useState();
  const [details, setDetails] = useState();
  const [cost, setCost] = useState();
  const [mService, setMService] = useState('')
  const [vendor, setVendor] = useState();
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


  const formatDate = (date) => {
    const formattedDate = new Date(date);
    formattedDate.setDate(formattedDate.getDate() + 1);
    return formattedDate.toISOString().split("T")[0];
  };
  const maintenanceUpdate = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const result = await axios.put(`${hostServer}/maintenance-update`,
      { vehicle, startDate: sDate, endDate: eDate, details, cost, vendor, mService, status, id: maintenanceID })
    setIsLoading(false)
    alert('Updated Successful!')
    nav('/admin/maintenance/list')
  }
  const getMaintenance = async () => {
    setIsLoading(true)
    const fetched = await axios.get(`${hostServer}/maintenancebyid/${maintenanceID}`)
    const data = fetched.data[0]
    setVehicle(data.m_v_id)
    setSDate(formatDate(data.m_start_date))
    setEDate(formatDate(data.m_end_date))
    setDetails(data.m_details)
    setCost(data.m_cost)
    setMService(data.m_service)
    setVendor(data.m_vendor_name)
    setStatus(data.m_status)
    setIsLoading(false)
  }
  const getAllVehicles = async () => {
    try {
      const res = await axios.get(`${hostServer}/retrieve-vehicles`)
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
    getMaintenance()
  }, [])

  return (
    <div className="AddMaintenance">
      <div className="adminHeader">
        <div className="left">
          <h1>Maintenance</h1>
          <ul className="breadcrumb">
            <li>
              <a href="#" >Maintenance</a>
            </li>
            /
            <li>
              <a href="#" className="active" >
                Edit Maintenance
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="vehicle-maintenance">
        <div className="vehicle-details">
          <div className="select-vehicle">
            <h4>Select Vehicle</h4>
            <select name="select-vehicle" id="select-vehicle" onChange={(e) => { setVehicle(e.currentTarget.value) }} value={vehicle}>
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
              <input type="date" name="" id="" onChange={(e) => { setSDate(formatDate(e.currentTarget.value)) }} value={sDate} />
            </div>
            <div className="end">
              <h4>
                <span>Maintenance</span> End Date
              </h4>
              <input type="date" name="" id="" onChange={(e) => { setEDate(formatDate(e.currentTarget.value)) }} value={eDate} />
            </div>
          </div>
          <div className="service-details">
            <h4>Service Details</h4>
            <textarea name="service-details" id="service-details" onChange={(e) => { setDetails(e.currentTarget.value) }} cols="45" rows="6" placeholder='Enter Details' value={details}></textarea>
          </div>
          <div className="cost-vendor">
            <div className="cost">
              <h4>Total Cost</h4>
              <input type="number" placeholder='Enter Price' disabled onChange={(e) => { setCost(e.currentTarget.value) }} value={cost} />
            </div>
            <div className="vendor">
              <h4>Vendor <span>Name</span> </h4>
              <input type="text" name="" id="" placeholder='Enter Name' disabled onChange={(e) => { setVendor(e.currentTarget.value) }} value={vendor} />
            </div>
          </div>
          <div className="parts-qty">
            <div className="parts-name">
              <h4>Maintenance Service</h4>
              <select name="parts" id="parts" onChange={(e) => { setMService(e.currentTarget.value) }} value={mService}>
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
            <select name="maintenance-status" id="maintenance-status" onChange={(e) => { setStatus(e.currentTarget.value) }} value={status}>
            <option selected>Choose Status</option>
              <option value="Scheduled" disabled>Scheduled</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="save">
            <button onClick={maintenanceUpdate}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMaintenance;