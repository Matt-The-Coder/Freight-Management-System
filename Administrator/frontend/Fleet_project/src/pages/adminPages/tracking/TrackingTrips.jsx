import { Link, useOutletContext } from 'react-router-dom'
import '/public/assets/css/adminLayout/trackingTrips.css'
import axios from 'axios'
import { useState, useEffect } from 'react'
const TrackingTrips = ({socket}) => {
    const { image, u_role, u_first_name, u_last_name, setIsLoading } = useOutletContext()
    const VITE_UPLOADING_SERVER = import.meta.env.VITE_UPLOADING_SERVER
    const mapboxToken = import.meta.env.VITE_MAPBOX_API;
    const hostServer = import.meta.env.VITE_SERVER_HOST;
    const [filterData, setFilterData] = useState('')
    const [travelData, setTravelData]= useState([])
    const [deliveries, setDeliveries] = useState([])
    const [deliveriesStorage, setDeliveriesStorage] = useState([])
    const [refresh, setRefresh] = useState(false)
    useEffect(() => {
        socket.on('deliveryUpdate', (data) => {
                alert("Delivery Information Updated")
                location.reload()        
        });
        return () => socket.off('deliveryUpdate');
    
      }, [socket]);
    function convertMiles(meters) {
        const miles = 0.00062137 * meters
        return miles
    }
    const getDeliveries = async () => {
        try {
            setIsLoading(true)
            const data = await axios.get(`${hostServer}/get-all-trip`)
            const result = data.data
            setDeliveries(result)
            setDeliveriesStorage(result)
            setIsLoading(false)


        } catch (error) {
            console.log(error)
        }
    }
    const filterDeliveries = (e) => {
        if (e == "") {
            setDeliveries(deliveriesStorage)
            setFilterData(e)
        } else {
            setFilterData(e)
            const filteredDeliveries = deliveriesStorage.filter((d) => {
                const startDate = new Date(d.t_start_date);
                startDate.setDate(startDate.getDate() + 1);
                const formattedDate = startDate.toISOString().split('T')[0];
                let result = formattedDate == e
                return result;
            })
            setDeliveries(filteredDeliveries)
        }
        console.log(e)




    }

    const formatDate = (date) => {
        const newDate = new Date(date);
        const formattedDate = newDate.toLocaleString();
        return formattedDate;
      };
    useEffect(() => {
        getDeliveries()
    }, [refresh])
    useEffect(() => {
        const fetchTravelData = async () => {
          try {
            setIsLoading(true);
            const promises = deliveries.map(async (e) => {
              const travelTime = await axios.post(`${hostServer}/getDirections`, {
                fLongitude: e.t_trip_fromlog,
                fLatitude: e.t_trip_fromlat,
                dLongitude: e.t_trip_tolog,
                dLatitude: e.t_trip_tolat,
                mapboxToken,
                id: e.t_id
              });
              return travelTime.data.routes;
            });
      
            const travelData = await Promise.all(promises);
            setTravelData(travelData.flat());
            console.log(travelData.flat())
            setIsLoading(false);
          } catch (error) {
            console.log(error);
          }
        };
      
        fetchTravelData();
      }, [deliveries]);
      
    return (
        <>
            <div className="trips">
                <div className="adminHeader">
                    <div className="left">
                        <h1>OnGoing Trips</h1>
                        <ul className="breadcrumb">
                            <li><a href="#">
                                Tracking
                            </a></li>
                            /
                            <li><a href="#" className="active">OnGoing Trips</a></li>
                        </ul>
                    </div>
                </div>
                <div className="filter">
                    {/* <h3>Filter</h3> */}
                    <input type="date" id='date-input' value={filterData} onChange={(e) => { filterDeliveries(e.currentTarget.value) }} />
                    <i className='bx bx-filter' ></i>
                </div>
                <div className="trips-list">
                    {deliveries.length == 0 && <center><h1>No OnGoing Trips at the Moment</h1></center>}
                    {deliveries.map((e, i) => {
                        return (
                            <div className="trips-container" key={i}>
                                <div className="trips-header">
                                    <div className="header-container">
                                        <div className="header1">
                                            <div className="row1">
                                                <div className="img">
                                                    <img src={`${VITE_UPLOADING_SERVER}${e.d_picture}`} alt="" />
                                                </div>
                                                <div className="name">
                                                    <h4>{`${e.d_first_name} ${e.d_last_name}`}</h4>
                                                </div>


                                            </div>
                                            <div className="row2">
                                                <h4>Driver</h4>
                                            </div>
                                        </div>
                                        <div className="header2">
                                            <h2>{e.t_trackingcode}</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="trips-content">
                                <div className="trip-date">
                  <div className="s-trip-date">
                  <h4>Start Date:</h4>
                  <p>{formatDate(e.t_start_date)}</p>
                  </div>
                  <div className="e-trip-date">
                  <h4>End Date:</h4>
                  <p>{formatDate(e.t_end_date)}</p>
                  </div>

                </div>
                                    <div className="main-content">
                                        <div className="content-design">
                                            <h1>•</h1>
                                            <p></p>
                                            <h1>•</h1>
                                        </div>
                                        <div className="content-locations">
                                            <div className="location-from">
                                                <h4>From:</h4>
                                                <p>{e.t_trip_fromlocation}</p>
                                            </div>
                                            <div className="location-to">
                                                <h4>To:</h4>
                                                <p>{e.t_trip_tolocation}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="trips-button">
                                        <a href={`/admin/tracking/live?trip_id=${e.t_id}&miles=${convertMiles(travelData[i]?.distance)}&weight=${e.t_totalweight}`}><button>View On Map</button></a>
                                    </div>
                                </div>

                            </div>
                        )
                    })}
                </div>
            </div>

        </>
    )
}

export default TrackingTrips