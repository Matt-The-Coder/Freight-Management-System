import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import '/public/assets/css/adminLayout/deliveries.css';

const DriverDeliveries = () => {
  const hostServer = import.meta.env.VITE_SERVER_HOST;
  const mapboxToken = import.meta.env.VITE_MAPBOX_API;
  const { u_username: username, setIsLoading, u_id: id } = useOutletContext();
  const [deliveries, setDeliveries] = useState({});
  const [travelData, setTravelData]= useState([])
  const acceptButtonRef = useRef(null);

  const acceptOrder = (deliveryId) => {
    const updatedDeliveries = { ...deliveries };
    updatedDeliveries[deliveryId].isShow = true;
    setDeliveries(updatedDeliveries);
  };

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

  function convertMiles (meters) {
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
      const data = await axios.get(`${hostServer}/get-trip?username=${username}`);
      const result = data.data;
      const travelRoutes = await Promise.all(result.map(async (e) => {
        const travelTime = await axios.post(`${hostServer}/getDirections`, {
          fLongitude: e.t_trip_fromlog,
          fLatitude: e.t_trip_fromlat,
          dLongitude: e.t_trip_tolog,
          dLatitude: e.t_trip_tolat,
          mapboxToken
        });
        const travel = travelTime.data?.routes[0];
        return travel;
      }));
      const reverseTravel = travelRoutes.reverse()
      setTravelData(reverseTravel);
      setIsLoading(false);
      const deliveriesObject = {};
      result.forEach((delivery) => {
        deliveriesObject[delivery.t_id] = {
          ...delivery,
          isShow: false,
        };
      });
      console.log(reverseObject(deliveriesObject))
      setDeliveries(deliveriesObject);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDeliveries();
  }, []);

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
                List
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="deliveries-list">
        {Object.entries(deliveries).length === 0 && (
          <center>
            <h1>No Assigned Deliveries Yet</h1>
          </center>
        )}
        {Object.entries(deliveries).reverse().map(([deliveryId, delivery], i) => {
          const { t_trip_status, t_trip_fromlocation, t_trip_tolocation, t_created_date, t_totalweight } = delivery;
          let statusColor = '';
          if (t_trip_status === 'Completed') {
            statusColor = '#388E3C'; // Green
          } else if (t_trip_status === 'In Progress') {
            statusColor = '#FBC02D'; // Yellow
          } else if (t_trip_status === 'Cancelled') {
            statusColor = '#D32F2F'; // Red
          } else if (t_trip_status === 'Pending') {
            statusColor = '#9E9E9E'; // Gray
          }

          return (
            <div className="deliveries-container" key={deliveryId}>
              <div className="delivery-info">
                <div className="first-container"></div>
                <div className="second-container">
                  <div className="h3-container" style={{ backgroundColor: statusColor }}>
                    <h3 >{t_trip_status}</h3>
                  </div>
                </div>
                <div className="time-container">
                  <p>{formatDate(t_created_date)}</p>
                </div>

              </div>
              <div className="deliveries-header">
                <div className="header1">
                  <h4>Estimated Travel Time: {convertTime(travelData[i].duration)}</h4>
                  <h4>Estimated Total Distance: {convertKm(travelData[i].distance)} km</h4>
                </div>
              </div>
              <div className="deliveries-content">
                <div className="main-content">
                  <div className="content-design">
                    <h1>•</h1>
                    <p></p>
                    <h1>•</h1>
                  </div>
                  <div className="content-locations">
                    <div className="location-from">
                      <h4>From:</h4>
                      <p>{t_trip_fromlocation}</p>
                    </div>
                    <div className="location-to">
                      <h4>To:</h4>
                      <p>{t_trip_tolocation}</p>
                    </div>
                  </div>
                </div>
                <div className="trips-button">
                  {!delivery.isShow && (
                    <button onClick={() => acceptOrder(deliveryId)} ref={acceptButtonRef}>
                      Accept Order
                    </button>
                  )}
                </div>
                {delivery.isShow && (
                  <>
                    <div className="odometer">
                      <p>Set Vehicle Odometer:</p>
                      <input type="text" />
                    </div>
                    <div className="trips-button">
                      <a href={`/driver/deliveries/tracking?trip_id=${deliveryId}&miles=${convertMiles(travelData[i].distance)}&weight=${t_totalweight}`}>
                        <button>View On Map</button>
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DriverDeliveries;
