import {Link, useOutletContext} from 'react-router-dom'
import '/public/assets/css/adminLayout/trackingTrips.css'
const TrackingTrips = () => {
    const {image,u_role, u_first_name, u_last_name} = useOutletContext()
    const VITE_UPLOADING_SERVER = import.meta.env.VITE_UPLOADING_SERVER
    return (
        <>
            <div className="trips">
                <div className="adminHeader">
                    <div className="left">
                        <h1>Current trips</h1>
                        <ul className="breadcrumb">
                            <li><a href="#">
                                Analytics
                            </a></li>
                            /
                            <li><a href="#" className="active">Trips</a></li>
                        </ul>
                    </div>
                </div>
                <div className="trips-list">
                    <div className="trips-container">
                        <div className="trips-header">
                            <div className="header-container">
                                <div className="header1">
                                    <div className="row1">
                                        <div className="img">
                                        <img src={`${VITE_UPLOADING_SERVER}${image}`} alt="" />
                                        </div>
                                        <div className="name">
                                        <h4>{`${u_first_name} ${u_last_name}`}</h4>
                                        </div>
 

                                    </div>
                                    <div className="row2">
                                        <h4>Driver</h4>
                                    </div>
                                </div>
                                <div className="header2">
                                    <h2>Tracking Code</h2>
                                </div>
                            </div>
                        </div>
                        <div className="trips-content">
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
                                <a href="/admin/tracking/live"><button>View On Map</button></a>
                            </div>
                        </div>

                    </div>
                    <div className="trips-container">
                        <div className="trips-header">
                            <div className="header-container">
                                <div className="header1">
                                    <div className="row1">
                                        <div className="img">
                                        <img src={`${VITE_UPLOADING_SERVER}${image}`} alt="" />
                                        </div>
                                        <div className="name">
                                        <h4>{`${u_first_name} ${u_last_name}`}</h4>
                                        </div>
 

                                    </div>
                                    <div className="row2">
                                        <h4>Driver</h4>
                                    </div>
                                </div>
                                <div className="header2">
                                    <h2>Tracking Code</h2>
                                </div>
                            </div>
                        </div>
                        <div className="trips-content">
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
                                <a href="/admin/tracking/live"><button>View On Map</button></a>
                            </div>
                        </div>

                    </div>
                    <div className="trips-container">
                        <div className="trips-header">
                            <div className="header-container">
                                <div className="header1">
                                    <div className="row1">
                                        <div className="img">
                                        <img src={`${VITE_UPLOADING_SERVER}${image}`} alt="" />
                                        </div>
                                        <div className="name">
                                        <h4>{`${u_first_name} ${u_last_name}`}</h4>
                                        </div>
 

                                    </div>
                                    <div className="row2">
                                        <h4>Driver</h4>
                                    </div>
                                </div>
                                <div className="header2">
                                    <h2>Tracking Code</h2>
                                </div>
                            </div>
                        </div>
                        <div className="trips-content">
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
                                <a href="/admin/tracking/live"><button>View On Map</button></a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
}

export default TrackingTrips