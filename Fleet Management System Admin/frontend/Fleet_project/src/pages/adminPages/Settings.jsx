
import '/public/assets/css/adminLayout/settings.css'
const Settings = ()=>{
    return(
        <div className="Settings">
            <div className="adminHeader">
                <div className="left">
                    <h1>Account settings</h1>
                    <ul className="breadcrumb">
                        <li><a href="#">
                            User Access
                        </a></li>
                        /
                        <li><a href="#" className="active">Account Info</a></li>
                    </ul>
                </div>
            </div>
            <div className="settings-container">
            <div className="personal-settings">
                <div className="title">
                    <h3>Personal Information</h3>
                </div>
                <div className="profile">
                    <img src="/assets/img/prof-pic.jpg" alt="Profile" />
                    <i class='bx bx-camera' ></i>
                    <div className="sub-title">
                        <h4>Ralph Matthew</h4>
                        <h5>Admin</h5>
                    </div>
                </div>
                <form action="">
                    <div className="first-row">
                        <div className="first-column">
                        <label htmlFor="name">First Name</label>
                        <input type="text" placeholder='First Name' />
                        </div>
                        <div className="second-column">
                        <label htmlFor="name">Last Name</label>
                        <input type="text" placeholder='Last Name' />
                        </div>
                    </div>
                    <div className="second-row">
                        <div className="first-column">
                        <label htmlFor="name">Username</label>
                        <input type="text" placeholder='Username' />
                        </div>
                        <div className="second-column">
                        <label htmlFor="name">Email</label>
                        <input type="emai;" placeholder='Email' />
                        </div>
                    </div>
                    
                  <div className="save-button">
                    <button type='submit'>Save <span>Profile</span> </button>
                  </div>
                </form>
            </div>
            <div className="security-settings">
            <div className="title">
                    <h3>Security Information</h3>
                </div>
            <form action="">
                    <div className="first-row">
                        <div className="first-column">
                        <label htmlFor="name">Current Password</label>
                        <input type="password" placeholder='Password' />
                        </div>
                    </div>
                    <div className="second-row">
                        <div className="first-column">
                        <label htmlFor="name">New Password</label>
                        <input type="password" placeholder='New Password' />
                        </div>
                        <div className="second-column">
                        <label htmlFor="name">Confirm Password</label>
                        <input type="password" placeholder='Re-enter new password' />
                        </div>
                    </div>
                    <div className="save-button">
                    <button type='submit'>Save <span>Password</span> </button>
                  </div>
                </form>
            </div>
            </div>



        </div>
    )
}

export default Settings;