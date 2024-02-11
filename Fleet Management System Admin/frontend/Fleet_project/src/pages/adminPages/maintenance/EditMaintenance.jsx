import { useEffect, useRef, useState } from 'react';
import '/public/assets/css/adminLayout/maintenance.css';
import {Link, useNavigate, useParams, useOutletContext} from "react-router-dom"
import axios from 'axios';
const EditMaintenance = () => {
    const {maintenanceID} = useParams();
    const nav = useNavigate()
    
    const {setIsLoading} = useOutletContext()
  const hostServer = import.meta.env.VITE_SERVER_HOST
//   const [addedParts, setAddedParts] = useState([]);
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
  const truckNames = [
    "Volvo FH16",
    "Scania R730",
    "Mercedes-Benz Actros",
    "MAN TGX",
    "Iveco Stralis",
    "DAF XF",
    "Renault T Range",
    "Kenworth W900",
    "Peterbilt 379",
    "Freightliner Cascadia",
    "International LT",
    "Mack Anthem",
    "Western Star 4900",
    "Hino 700",
    "Fuso Super Great",
    "Isuzu Giga"
  ];
  // useEffect(()=>{
  //   console.log(addedParts)
  // }, [addedParts])
  // const addParts = () => {
  //   const newPart = {
  //     parts: '',
  //     quantity: '',
  //   };

  //   setAddedParts([...addedParts, newPart]);
  // };

  // const removeParts = (index) => {
  //   const updatedParts = [...addedParts];
  //   updatedParts.splice(index, 1);
  //   setAddedParts(updatedParts);
  // };

  // const handlePartChange = (index, e) => {
  //   const { name, value } = e.target;
  //   const updatedParts = [...addedParts];
  //   updatedParts[index][name] = value;
  //   setAddedParts(updatedParts);
  // };

  const formatDate = (date) => {
    const formattedDate = new Date(date);
    formattedDate.setDate(formattedDate.getDate() + 1);
    return formattedDate.toISOString().split("T")[0];
  };
  const maintenanceUpdate = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const result = await axios.put(`${hostServer}/maintenance-update`,
        {vehicle, startDate:sDate, endDate:eDate, details, cost, vendor, mService, status, id:maintenanceID })
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
useEffect(() => {
    getMaintenance()
}, [])
  return (
    <div className="AddMaintenance">
      <div className="adminHeader">
        <div className="left">
          <h1>Maintenance</h1>
          <ul className="breadcrumb">
            <li>
              <Link to="/admin/dashboard" className="active">Dashboard</Link>
            </li>
            /
            <li>
              <a href="#" >
                Vehicle Maintenance
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
              <option value="Truck">Select Vehicle</option>
              {truckNames.map(e=>{
                return(
                  <option value={e}>{e}</option>
                )
              })}
            </select>
          </div>
          <div className="maintenance-date">
            <div className="start">
              <h4>
                <span>Maintenance</span> Start Date
              </h4>
              <input type="date" name="" id="" onChange={(e) => {  setSDate(formatDate(e.currentTarget.value)) }} value={sDate}/>
            </div>
            <div className="end">
              <h4>
                <span>Maintenance</span> End Date
              </h4>
              <input type="date" name="" id="" onChange={(e) => { setEDate(formatDate(e.currentTarget.value)) }} value={eDate}/>
            </div>
          </div>
          <div className="service-details">
            <h4>Service Details</h4>
            <textarea name="service-details" id="service-details" onChange={(e) => { setDetails(e.currentTarget.value) }} cols="45" rows="6" placeholder='Enter Details' value={details}></textarea>
          </div>
          <div className="cost-vendor">
            <div className="cost">
              <h4>Total Cost</h4>
              <input type="number" placeholder='Enter Price' onChange={(e) => { setCost(e.currentTarget.value) }}  value={cost}/>
            </div>
            <div className="vendor">
              <h4>Vendor <span>Name</span> </h4>
              <input type="text" name="" id="" placeholder='Enter Name' onChange={(e) => { setVendor(e.currentTarget.value) }} value={vendor}/>
            </div>
          </div>
          <div className="parts-qty">
            <div className="parts-name">
              <h4>Maintenance Service</h4>
              <select name="parts" id="parts" onChange={(e) => { setMService(e.currentTarget.value) }} value={mService}>
                <option value="parts1">Select Service</option>
                {maintenanceServices.map((e)=>{
                  return(
                    <option value={e}>{e}</option>
                  )
                })}
              </select>
            </div>

          </div>
          {/* {addedParts.map((part, index) => (
            <div className="parts-qty" key={index}>
              <div className="parts-name">
                <h4>Parts Name</h4>
                <select name="parts" id="parts" value={part.parts} onChange={(e) => handlePartChange(index, e)}>
                  <option value="parts1">Select Parts</option>
                </select>
              </div>
              <div className="qty">
                <h4>Quantity</h4>
                <select name="quantity" id="quantity" value={part.quantity} onChange={(e) => handlePartChange(index, e)}>
                  <option value="quantity">1</option>
                </select>
              </div>
              <div className="add">
                <i className='bx bxs-trash bx-tada' onClick={() => removeParts(index)}></i>
              </div>
            </div>
          ))} */}
          <div className="maintenance-status">
            <h4>Maintenance Status</h4>
            <select name="maintenance-status" id="maintenance-status" onChange={(e) => { setStatus(e.currentTarget.value) }} value={status}>
              <option value="1">Choose Status</option>
              {maintenanceStatusOptions.map((e)=>{
                return (
                  <option value={e}>{e}</option>
                )
              })}
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