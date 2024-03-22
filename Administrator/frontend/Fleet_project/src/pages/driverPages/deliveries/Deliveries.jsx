import { useEffect, useRef, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '/public/assets/css/adminLayout/deliveries.css';

const DriverDeliveries = ({ socket }) => {
    const hostServer = import.meta.env.VITE_SERVER_HOST;
    const mapboxToken = import.meta.env.VITE_MAPBOX_API;
    const { d_username: username, setIsLoading, d_id: id } = useOutletContext();
    const [deliveries, setDeliveries] = useState([]);
    const [deliveriesStorage, setDeliveriesStorage] = useState([])
    const nav = useNavigate()
    const [travelData, setTravelData] = useState([])
    const [travelStorage, setTravelStorage] = useState([])
    const [filterData, setFilterData] = useState('')
    const [onGoing, setOnGoing] = useState([])
    const acceptButtonRef = useRef(null);

    const acceptOrder = (deliveryId) => {
        console.log(onGoing)
        if (onGoing.length !== 0) {
            alert('You can only accept one order at a time!');
            return;
        } else {
            const accept = document.querySelector(`#accept${deliveryId}`)
            const view = document.querySelector(`#view${deliveryId}`)
            accept.style.display = "none"
            view.style.display = "block"

        }

    };
    const setInProgress = async (trip_id, driverFirstname, t_distance, t_weight) => {
        try {
            setIsLoading(true)
            const data = await axios.post(`${hostServer}/update-trip-pending/${trip_id}`, {
                status: "In Progress"
            })
            let deliveryState = "In Progress"
            let message = ''
            switch (deliveryState) {
                case 'In Progress':
                    message = `Delivery in progress, handled by ${driverFirstname}. Review details for more info.`;
                    break;
                case 'Completed':
                    message = `Delivery successfully completed by ${driverFirstname}. Thank you for your service!`;
                    break;
                case 'Cancelled':
                    message = `Delivery cancelled by ${driverFirstname}. Take necessary action and notify relevant parties.`;
                    break;
                case 'Pending':
                    message = `Delivery set as pending, awaiting action by ${driverFirstname}. Review details and provide instructions.`;
                    break;
            }

            const insertNotif = await axios.post(`${hostServer}/insertNotifications`,
                {
                    description: message
                })
            socket.emit('deliveryUpdate', { deliveryState, trip_id })
            setIsLoading(false)
            nav(`/driver/deliveries/tracking?trip_id=${trip_id}&miles=${convertMiles(t_distance)}&weight=${t_weight}`)

        } catch (error) {
            console.log(error)
        }
    }

    const filterDeliveries = (e) => {
        if (e == "") {
            setDeliveries(deliveriesStorage)
            setTravelData(travelStorage)
            setFilterData(e)
        } else {
            setFilterData(e)
            const indexes = []
            const filteredDeliveries = deliveriesStorage.filter((d, i) => {
                const startDate = new Date(d.t_start_date);
                startDate.setDate(startDate.getDate() + 1);
                const formattedDate = startDate.toISOString().split('T')[0];
                if (formattedDate == e) {
                    indexes.push(i)
                    return formattedDate

                }

            })
            console.log(indexes)
            const filterTripData = travelStorage.filter((v, i) => {
                if (i == indexes) {
                    return v
                }
            })
            console.log(filterTripData)
            setTravelData(filterTripData)
            setDeliveries(filteredDeliveries)
        }

    }

    const formatDate = (date) => {
        const newDate = new Date(date);
        const formattedDate = newDate.toLocaleString();
        return formattedDate;
    };
    function convertTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        const formattedTime = `${hours}h ${minutes}m`;
        return formattedTime;
    }

    function convertMiles(meters) {
        const miles = 0.00062137 * meters
        console.log(miles)
        return miles
    }
    function convertKm(meters) {
        const kilometers = meters / 1000;
        return kilometers.toFixed(2);
    }
    function reverseObject(obj) {
        // Convert the object into an array of key-value pairs
        var entries = Object.entries(obj);

        // Reverse the order of the entries
        var reversedEntries = entries.reverse();

        // Convert the reversed entries back into an object
        var reversedObj = Object.fromEntries(reversedEntries);

        return reversedObj;
    }
    const getDeliveries = async () => {
        try {
            setIsLoading(true);
            const data = await axios.get(`${hostServer}/get-trip?username=${id}`);
            const result = data.data;

            const ongoingTrips = result.filter((e) => { return e.t_trip_status == "In Progress" })
            const pendingTrips = result.filter((e) => { return e.t_trip_status == "Pending" })
            const travelRoutes = await Promise.all(pendingTrips.map(async (e) => {
                const travelTime = await axios.post(`${hostServer}/getDirections`, {
                    fLongitude: e.t_trip_fromlog,
                    fLatitude: e.t_trip_fromlat,
                    dLongitude: e.t_trip_tolog,
                    dLatitude: e.t_trip_tolat,
                    mapboxToken, id: e.t_id
                });
                const travel = travelTime.data?.routes[0];
                return travel;
            }));
            const reverseTravel = travelRoutes
            console.log(reverseTravel)
            setOnGoing(ongoingTrips)
            setTravelData(reverseTravel);
            setTravelStorage(reverseTravel)
            const del = await axios.get(`${hostServer}/get-trip?username=${id}`);
            const updatedDel = del.data;
            const pendingDel = result.filter((e) => { return e.t_trip_status == "Pending" })
            setDeliveries(pendingDel);
            console.log(pendingDel)
            setDeliveriesStorage(pendingDel)
            setIsLoading(false);

        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        getDeliveries();
    }, [username]);

    return (
        <div className="DriverDeliveries">
            <div className="adminHeader">
                <div className="left">
                    <h1>Deliveries</h1>
                    <ul className="breadcrumb">
                        <li>
                            <a href="#">Deliveries</a>
                        </li>
                        /
                        <li>
                            <a href="#" className="active">
                                Pending
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="filter">
                {/* <h3>Filter</h3> */}
                <div className="filter-container">
                    <p htmlFor=""> Start Date</p>
                    <div className="filter-input">
                        <input type="date" id='date-input' value={filterData} onChange={(e) => { filterDeliveries(e.currentTarget.value) }} />
                        <i className='bx bx-filter' ></i>
                    </div>

                </div>

            </div>
            <div className="deliveries-list">
                {deliveries.length === 0 && (
                    <center>
                        <h1>No Upcoming Deliveries Yet</h1>
                    </center>
                )}
                {deliveries?.map((e, i) => {
                    let statusColor = '';
                    if (e.t_trip_status === 'Completed') {
                        statusColor = '#388E3C'; // Green
                    } else if (e.t_trip_status === 'In Progress') {
                        statusColor = '#FBC02D'; // Yellow
                    } else if (e.t_trip_status === 'Cancelled') {
                        statusColor = '#D32F2F'; // Red
                    } else if (e.t_trip_status === 'Pending') {
                        statusColor = '#9E9E9E'; // Gray
                    }

                    return (
                        <div className="deliveries-container" key={i}>
                            <div className="time-container">
                                <p>Order Date: {formatDate(e.t_created_date)}</p>
                            </div>
                            <div className="delivery-info">
                                <div className="second-container">
                                    <div className="h3-container" style={{ backgroundColor: statusColor }}>
                                        <h3 >{e.t_trip_status}</h3>
                                    </div>
                                </div>

                            </div>
                            <div className="deliveries-header">
                                <div className="header1">
                                    <h4>Estimated Travel Time: {convertTime(travelData[i]?.duration)}</h4>
                                    <h4>Estimated Total Distance: {convertKm(travelData[i]?.distance)} km</h4>
                                </div>
                            </div>
                            <div className="deliveries-content">
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
                                <div className="trips-button-pending" id={`accept${e.t_id}`}>

                                    <button onClick={() => acceptOrder(e.t_id)} ref={acceptButtonRef}>
                                        Accept Order
                                    </button>
                                </div>
                                <div className="trips-button-view" id={`view${e.t_id}`}>
                                    <button onClick={() => { setInProgress(e.t_id, e.d_first_name, travelData[i]?.distance, e.t_totalweight) }}>View On Map</button>
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DriverDeliveries;
