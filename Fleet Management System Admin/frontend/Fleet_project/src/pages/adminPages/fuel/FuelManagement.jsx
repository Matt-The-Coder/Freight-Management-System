import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FuelManagement = () => {
    const nav = useNavigate()
    const [isDelete, setIsDelete] = useState(false)
    const [vehicle, setVehicle] = useState("")
    const [driver, setDriver] = useState("")
    const [date, setDate] = useState("")
    const [quantity, setQuantity] = useState("")
    const [odometerReading, setOdometerReading] = useState("")
    const [amount, setAmount] = useState("")
    const [remarks, setRemarks] = useState("")
    const hostServer = import.meta.env.VITE_SERVER_HOST;
    const [fuelList, setFuelList] = useState([])
    const [fuelSearch, setFuelSearch] = useState('')
    const getFuelList = async () => {
        const fetchFuel = await axios.get(`${hostServer}/retrieve-fuel`)
        const  data = fetchFuel.data;
        setFuelList(data)
    }
    const searchFuel = async() =>
    {
        const fetchFuel = await axios.get(`${hostServer}/fuel?search=${fuelSearch}`)
        console.log(fetchFuel.data)
        const filteredData = fetchFuel.data
        setFuelList(filteredData)
    }
    const updateData = (e) => {
        if(e){
            nav(`/admin/fuel/edit/${e}`)
        }
        
    }
    useEffect(()=>{
        getFuelList()
    },[isDelete])
    const formatDate = (date) => {
        const formattedDate = new Date(date);
        formattedDate.setDate(formattedDate.getDate() + 1);
        return formattedDate.toISOString().split("T")[0];
      };
      const deleteData = async (e) => {
        const fetched = await axios.delete(`${hostServer}/fuel-delete/${e}`) 
        setIsDelete(!isDelete)
        alert('Deleted Successfully!')
       }
    return (
        <div className="FuelManagement">
            <div className="adminHeader">
                <div className="left">
                    <h1>Fuel Info</h1>
                    <ul className="breadcrumb">
                        <li><a href="#">
                            Analytics
                        </a></li>
                        /
                        <li><a href="#" className="active">Shop</a></li>
                    </ul>
                </div>
            </div>
            <div className="fuel-content">
                <div className="fuel-search">

                    <input type="text" id='search' onChange={e => setFuelSearch(e.target.value)} />
                    <button onClick={searchFuel}>Search</button>

                </div>
                <div className="fuel-list">
                    <table className='fuel-table'>
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Fill Date</th>
                                <th>Vehicle</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                                <th>Filled By</th>
                                <th>Odometer Reading</th>
                                <th>Remarks</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>

                            {fuelList.map((e,i)=>
                            { return (
                                <tr key={i}>
                                <td>{e.v_fuel_id}</td>
                                <td>{formatDate(e.v_fuelfilldate)} </td>
                                <td>{e.v_id}</td>
                                <td> {e.v_fuel_quantity} </td>
                                <td> {e.v_fuelprice}</td>
                                <td> {e.v_fueladdedby} </td>
                                <td> {e.v_odometerreading}</td>
                                <td>{e.v_fuelcomments}</td>
                                <td><button onClick={()=>{updateData(e.v_fuel_id)}}>Edit</button><button onClick={()=>{deleteData(e.v_fuel_id)}}>Delete</button></td>
                            </tr>
                            )

                            
                            })}
                        </tbody>

                    </table>
                </div>
            </div>

        </div>
    )
}

export default FuelManagement;