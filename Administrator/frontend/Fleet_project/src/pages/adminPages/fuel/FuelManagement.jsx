import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const FuelManagement = () => {
    const nav = useNavigate()
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const {setIsLoading} = useOutletContext()
    const [isDelete, setIsDelete] = useState(false)
    const hostServer = import.meta.env.VITE_SERVER_HOST;
    const [fuelList, setFuelList] = useState([])
    const [filterData, setFilterData] = useState("")
    const [fuelData, setFuelData] = useState([])
    const [fuelSearch, setFuelSearch] = useState('')
    const getFuelList = async () => {
        setIsLoading(true)
        const fetchFuel = await axios.get(`${hostServer}/retrieve-fuel?page=${page}&pageSize=${pageSize}`)
        const  data = fetchFuel.data;
        setFuelList(data)
        setIsLoading(false)
    }
    const getFuelListFull = async () => {
        setIsLoading(true)
        const fetchFuel = await axios.get(`${hostServer}/retrieve-fuel-full`)
        const  data = fetchFuel.data;
        setFuelData(data)
        setIsLoading(false)
    }
    const searchFuel = async() =>
    {
        setIsLoading(true)
        const fetchFuel = await axios.get(`${hostServer}/fuel?search=${fuelSearch}`)
        const filteredData = fetchFuel.data
        setFuelList(filteredData)
        setIsLoading(false)
    }
    const updateData = (e) => {
        if(e){
            nav(`/admin/fuel/edit/${e}`)
        }  
    }
    const filterFuel = (e) => {
        if(e == [] || e == ""){
            setFuelList(fuelData)
        }else{
            setFilterData(e)
            const filtered = fuelData.filter((f)=>{
                const formattedDate = formatDate(f.v_fuelfilldate);
                if(formattedDate == e){
                    return f
                }
            })
            setFuelList(filtered)
        }
       
    }
    useEffect(()=>{
        getFuelList()
        getFuelListFull()
    },[isDelete, page])
    const formatDate = (date) => {
        const formattedDate = new Date(date);
        formattedDate.setDate(formattedDate.getDate());
        return formattedDate.toISOString().split("T")[0];
      };
      const deleteData = async (e) => {
        try {
            setIsLoading(true)
            const fetched = await axios.put(`${hostServer}/fuel-delete/${e}`) 
            setIsDelete(!isDelete)
            setIsLoading(false)
            alert(fetched.data.message)
        } catch (error) {
            console.log(error)
        }

       }
    return (
        <div className="FuelManagement">
            <div className="adminHeader">
                <div className="left">
                    <h1>Fuel Info</h1>
                    <ul className="breadcrumb">
                        <li><a href="#">
                            Fuel
                        </a></li>
                        /
                        <li><a href="#" className="active">Fuel Management</a></li>
                    </ul>
                </div>
            </div>
                <div className="filter">
                {/* <h3>Filter</h3> */}
                <div className="filter-container">
                    <p htmlFor=""> Fill Date</p>
                    <div className="filter-input">
                    <input type="date" id='date-input' value={filterData} onChange={(e)=>{filterFuel(e.currentTarget.value)}}/>
                        <i className='bx bx-filter' ></i>
                    </div>

                </div>

            </div>
            <div className="fuel-content">
                <div className="fuel-search">

                    <input type="text" id='search' onChange={e => setFuelSearch(e.target.value)} />
                    <button onClick={searchFuel}>Search</button>

                </div>
                <div className="fuel-list" id="fuelReports">
                    <table className='fuel-table'>
                        <thead>
                            <tr>
                                <th>F.No</th>
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
                                <td>FL-{e.v_fuel_id}</td>
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
                <div className="pagination-container">
                        <div className='pagination'>
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >
                                Previous
                            </button>
                            <span>Page {page}</span>
                            <button disabled={fuelList.length < 5} onClick={() => setPage(page + 1)}>Next</button>
                        </div>
                    </div>
            </div>

        </div>
    )
}

export default FuelManagement;