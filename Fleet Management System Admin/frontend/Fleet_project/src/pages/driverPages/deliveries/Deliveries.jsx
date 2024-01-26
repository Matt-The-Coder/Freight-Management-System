import '/public/assets/css/adminLayout/deliveries.css'
const DriverDeliveries = () => 
{
    return(
        <div className="DriverDeliveries">
                        <div className="adminHeader">
                <div className="left">
                    <h1>Deliveries</h1>
                    <ul className="breadcrumb">
                        <li><a href="#">
                            Analytics
                        </a></li>
                        /
                        <li><a href="#" className="active">Metrics</a></li>
                    </ul>
                </div>
            </div>
            <div className="deliveries-list">
                <div className="deliveries-container">
                    <div className="deliveries-header">
                        <div className="header1">
                            <h4>Estimated Travel Time: 28 mins</h4>
                            <h4>Estimated Total Distance: 106 km</h4>
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
                                        <p>M339+HC2, Roxas Ave, Diliman, Quezon City, Metro Manila</p>
                                    </div>
                                    <div className="location-to">
                                        <h4>To:</h4>
                                        <hp>Quirino Hwy, Novaliches, Quezon City, Metro Manila</hp>
                                    </div>
                                </div>
                            </div>
                            <div className="trips-button">
                                <a href="/driver/deliveries/tracking"><button>View On Map</button></a>
                            </div>
                    </div>
                </div>
            </div>
            
        
        </div>
    )
}

export default DriverDeliveries