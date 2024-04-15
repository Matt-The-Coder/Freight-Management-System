import { useEffect, useRef, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import '/public/assets/css/adminLayout/fuel.css'
import axios from 'axios'
const AddFuel = () => {
    const {setIsLoading} = useOutletContext()
    const nav = useNavigate()
    const [vehicle, setVehicle] = useState("")
    const [vehicleList, setVehicleList] = useState([])
    const [driverList, setDriverList] = useState([])
    const [driver, setDriver] = useState("")
    const [date, setDate] = useState("")
    const [quantity, setQuantity] = useState("")
    const [odometerReading, setOdometerReading] = useState("")
    const [amount, setAmount] = useState("")
    const [remarks, setRemarks] = useState("")
    const hostServer = import.meta.env.VITE_SERVER_HOST;
    const AddFuel = async (e) => 
    {
        e.preventDefault()
        setIsLoading(true)
        const result = await axios.post(`${hostServer}/add-fuel`, 
        {vehicle, driver, date, quantity, odometerReading, amount, remarks})
        setIsLoading(false)
        alert("Added Successfully!")
        nav('/admin/fuel/manage')
    }
    const getAllVehicles = async () => {
        try {
            const res = await axios.get(`${hostServer}/retrieve-vehicles`)
            const data = res.data
            setVehicleList(data)
        } catch (error) {
           console.log(error) 
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

    const getVehicle = async (e) =>{
        setDriver(e)
        try {
            setIsLoading(true)
            const res = await axios.get(`${hostServer}/retrieve-vehicles?driver=${e}`)
            const data = res.data
            setVehicleList(data)
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
           console.log(error) 
        }
    }

    useEffect(()=>{
        getAllVehicles()
        getAllDrivers()
    },[])
  
    useEffect(()=>{
        const opt = document.querySelector("#vehicle")
        setVehicle(opt.value)
    }, [vehicleList])
    return (
        <div className="AddFuel">
            <div className="adminHeader">
                <div className="left">
                    <h1>Add Fuel</h1>
                    <ul className="breadcrumb">
                        <li><a href="#">
                            Fuel
                        </a></li>
                        /
                        <li><a href="#" className="active">Add Fuel</a></li>
                    </ul>
                </div>
            </div>

                <div className="fuel-details">
                <form onSubmit={(e)=>{AddFuel(e)}}>
                    <div className="first-row">
                        <div className="driver">
                            <h4>Driver</h4>
                            <select required onChange={(e)=>{getVehicle(e.currentTarget.value)}}>
                                <option disabled selected>Select Driver</option>
                                {driverList.map((e, i)=>{
                                    return <option key={i} value={`${e.d_first_name}`}>{e.d_first_name} {e.d_last_name}</option>
                                })}

                            </select>
                        </div>
                        <div className="vehicle">
                            <h4>Vehicle</h4>
                            <select name="vehicle" disabled required id='vehicle'>
                                <option disabled>Select Vehicle</option>
                                {vehicleList.map((e, i)=>{
                                    return <option selected key={i} value={e.name}>{e.name}</option>
                                })}
                            </select>
                        </div>
                        <div className="fill-date" >
                            <h4>Fill Date</h4>
                            <input type="date"  required onChange={(e)=>{setDate(e.currentTarget.value)}}/>
                        </div>
                        <div className="quantity">
                            <h4>Quantity</h4>
                            <input type="number"  required placeholder='Enter Volume' onChange={(e)=>{setQuantity(e.currentTarget.value)}}/>
                        </div>
                    </div>
                    <div className="second-row">
                        <div className="odometer-reading">
                            <h4>Odometer Reading</h4>
                            <input type="number" placeholder='Enter Usage' required onChange={(e)=>{setOdometerReading(e.currentTarget.value)}} />
                        </div>
                        <div className="amount">
                            <h4>Amount</h4>
                            <input type="number" placeholder='Enter Price'  required onChange={(e)=>{setAmount(e.currentTarget.value)}} />
                        </div>
                        <div className="comment">
                            <h4>Remarks</h4>
                            <input type="text" placeholder='Enter Comment' onChange={(e)=>{setRemarks(e.currentTarget.value)}}/>
                        </div>
                    </div>
                    <div className="add-button">
                        <button type='submit'>Add Fuel</button>
                    </div>
                    </form>
                </div>




        </div>
    )
}

export default AddFuel;