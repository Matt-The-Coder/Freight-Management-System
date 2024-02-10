import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import '/public/assets/css/adminLayout/fuel.css'
import axios from 'axios'
const EditFuel = () => {
    const { fuel_id } = useParams()
    const [vehicle, setVehicle] = useState("")
    const [driver, setDriver] = useState("")
    const [date, setDate] = useState("")
    const [quantity, setQuantity] = useState("")
    const [odometerReading, setOdometerReading] = useState("")
    const [amount, setAmount] = useState("")
    const [remarks, setRemarks] = useState("")
    const hostServer = import.meta.env.VITE_SERVER_HOST;
    const nav = useNavigate()
    const formatDate = (date)=> {
        const formattedDate = new Date(date).toISOString().split("T")[0];
        return formattedDate
      }
    const updateFuel = async (e) => {
        e.preventDefault()
        const result = await axios.put(`${hostServer}/fuel-update`,
            { vehicle, driver, date, quantity, odometerReading, amount, remarks, id:fuel_id })
        alert('Updated Successful!')
        nav('/admin/fuel/manage')
    }
    const getfuel = async () => {
        const fetched = await axios.get(`${hostServer}/fuelbyid/${fuel_id}`)
        const data = fetched.data[0]
        setVehicle(data.v_id)
        setDriver(data.v_fueladdedby)
        setDate(formatDate(data.v_created_date))
        setQuantity(data.v_fuel_quantity)
        setOdometerReading(data.v_odometerreading)
        setAmount(data.v_fuelprice)
        setRemarks(data.v_fuelcomments)
        console.log(formatDate(data.v_created_date))
    }
    useEffect(() => {
        getfuel()
    }, [])
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
    return (
        <div className="AddFuel">
            <div className="adminHeader">
                <div className="left">
                    <h1>Edit Fuel</h1>
                    <ul className="breadcrumb">
                        <li><a href="#">
                            Fuel
                        </a></li>
                        /
                        <li><a href="#" className="active">Edit Fuel</a></li>
                    </ul>
                </div>
            </div>

            <div className="fuel-details">
                <form onSubmit={(e) => { updateFuel(e) }}>
                    <div className="first-row">
                        <div className="vehicle">
                            <h4>Vehicle</h4>
                            <select name="vehicle" onChange={(e) => { setVehicle(e.currentTarget.value) }} value={vehicle}>
                                <option value="">Select Vehicle</option>
                                {truckNames.map(e => {
                                    return (
                                        <option value={e}>{e}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="driver">
                            <h4>Driver</h4>
                            <select required onChange={(e) => { setDriver(e.currentTarget.value) }} value={driver}>
                                <option value="">Select Driver</option>
                                <option value="Matthew">Matthew</option>
                                <option value="Ralph">Ralph</option>
                            </select>
                        </div>
                        <div className="fill-date" >
                            <h4>Fill Date</h4>
                            <input type="date" required onChange={(e) => { setDate(e.currentTarget.value) }} value={date} />
                        </div>
                        <div className="quantity">
                            <h4>Quantity</h4>
                            <input type="number" required placeholder='Enter Volume' onChange={(e) => { setQuantity(e.currentTarget.value) }} value={quantity} />
                        </div>
                    </div>
                    <div className="second-row">
                        <div className="odometer-reading">
                            <h4>Odometer Reading</h4>
                            <input type="number" placeholder='Enter Usage' required onChange={(e) => { setOdometerReading(e.currentTarget.value) }} value={odometerReading} />
                        </div>
                        <div className="amount">
                            <h4>Amount</h4>
                            <input type="number" placeholder='Enter Price' required onChange={(e) => { setAmount(e.currentTarget.value) }} value={amount} />
                        </div>
                        <div className="comment">
                            <h4>Remarks</h4>
                            <input type="text" placeholder='Enter Comment' onChange={(e) => { setRemarks(e.currentTarget.value) }} value={remarks} />
                        </div>
                    </div>
                    <div className="add-button">
                        <button type='submit'>Save</button>
                    </div>
                </form>
            </div>




        </div>
    )
}

export default EditFuel;