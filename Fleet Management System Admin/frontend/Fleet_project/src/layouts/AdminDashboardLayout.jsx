import {Outlet, Link, useNavigate} from 'react-router-dom'
import '../../public/assets/css/adminLayout/dashboard.css'
import { useEffect, useState } from 'react';
import RiseLoader from "react-spinners/RiseLoader";
import axios from 'axios';
const AdminDashboardLayout = ()=>{
  axios.defaults.withCredentials = true;
  const hostServer = import.meta.env.VITE_SERVER_HOST
  const nav = useNavigate(null)
  const [trackingDropdown, setTrackingDropdown] = useState(false)
  const [maintenanceDropdown, setMaintenanceDropdown] = useState(false)
  const [chatsDropdown, setChatsDropdown] = useState(false)
  const [fuel, setFuel] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const [user, setUser] = useState(null)
  const [authError, setAuthError] = useState(null)
  const [mapStyle, setMapStyle] = useState('streets-v12')
  const [theme, setTheme] = useState("light")
  const [refresh, setRefresh] = useState(false)
  const [access, setAccess] = useState("")
  const [image, setImage] = useState('')
  const toggleDropdown = (e) => {
      switch(e.id) {
        case'tracking': setTrackingDropdown(!trackingDropdown) 
        break;
        case'maintenance': setMaintenanceDropdown(!maintenanceDropdown) 
        break;
        case "fuel" : setFuel(!fuel)
        break;
        case "chats": setChatsDropdown(!chatsDropdown)
        break;
        default:null;
      }


  }

  const override = {
    display: "block",
    margin: "0 auto",
    position: "fixed"
  };
  

  const checkAuthentication = async () => {

    try {
      const result = await axios.get(`${hostServer}/homeAuthentication`)
      if(result.data.message){
        setAuthError(result.data.message)
        nav("/login")
      }else{
        const userData = result.data
        setIsAuth(true);
        setUser(userData.authData.user[0])
        setRefresh(!refresh)
      }
    } catch (error) {
      setAuthError("Cannot fetch, Internal server is down!")
    }
 

  }
  const getProfilePicture = async () => 
  {
    const result = await axios.get(`${hostServer}/getProfilePicture/${user.u_id}`)
    setImage(result.data.image[0].u_profile_picture)
  }
  const getAccess = async () => 
  {
    const result = await axios.get(`${hostServer}/getAccess/${user.u_id}`)
    const fetchedData = result.data.data[0]
    setAccess(fetchedData)
  }
  const handleLogout = async () => 
  {   
    try {
      setIsLoading(true)
      await axios.delete(`${hostServer}/logout`);
      setIsLoading(false)
      nav("/login")
    } catch (error) {
      console.log(error)
    }
  
  }
  useEffect(()=>
  { 
    checkAuthentication()

  }, [])
  useEffect(()=>
  { 
    getAccess()
    getProfilePicture()
  }, [refresh])


    useEffect(() => {
        // Function to handle side menu item clicks
        const handleSideMenuItemClick = (e) => {
          const sideLinks = document.querySelectorAll('.adminSidebar .side-menu  li a:not(.logout)');
          sideLinks.forEach((item) => item.parentElement.classList.remove('active'));
          e.target.parentElement.classList.add('active');
        };


    
        // Function to handle menu bar click
        const handleMenuBarClick = () => {
          const adminSidebar = document.querySelector('.adminSidebar');
          const sideMenu = document.querySelectorAll('#subMenu');
          
          // Toggle the 'close' class on the adminSidebar
          adminSidebar.classList.toggle('close');
        
          // Check if the adminSidebar is closed
          if (adminSidebar.classList.contains('close')) {
            sideMenu.forEach((menu) => {
              // Apply styles for smooth hiding
              menu.style.opacity = '0.5';
            });
            adminSidebar.style.display = "none"
          } else {
            sideMenu.forEach((menu) => {
              // Apply styles for smooth showing
              menu.style.opacity = '1';
            });
            adminSidebar.style.display = "block"
          }
        };
        
    
        // Function to handle search button click
        const handleSearchBtnClick = (e) => {
          if (window.innerWidth < 576) {
            e.preventDefault(); // Fixed a missing function call 'preventDefault'
            const searchForm = document.querySelector('.content nav form');
            searchForm.classList.toggle('show');
            const searchBtnIcon = document.querySelector('.content nav form .form-input button .bx');
            if (searchForm.classList.contains('show')) {
              searchBtnIcon.classList.replace('bx-search', 'bx-x');
            } else {
              searchBtnIcon.classList.replace('bx-x', 'bx-search');
            }
          }
        };

        // // Function to handle window resize
        // const handleWindowResize = () => {
        //   const adminSidebar = document.querySelector('.adminSidebar');
        //   if (window.innerWidth < 768) {
        //     adminSidebar.classList.add('close');
        //   } else {
        //     adminSidebar.classList.remove('close');
        //   }
    
        //   const searchForm = document.querySelector('.content nav form');
        //   const searchBtnIcon = document.querySelector('.content nav form .form-input button .bx');
        //   if (window.innerWidth > 576) {
        //     searchBtnIcon.classList.replace('bx-x', 'bx-search');
        //     searchForm.classList.remove('show');
        //   }
        // };
    
        // Function to handle theme toggle
        const handleThemeToggle = () => {
          const toggler = document.getElementById('theme-toggle');
          if (toggler.checked) {
            document.body.classList.add('dark');
            setTheme("dark")
          } else {
            document.body.classList.remove('dark');
            setTheme("light")
          }
        };
    
        // Attach event listeners
        const sideLinks = document.querySelectorAll('.adminSidebar .side-menu li a:not(.logout)');
        sideLinks.forEach((item) => {
          item.addEventListener('click', handleSideMenuItemClick);
        });
    
        const menuBar = document.querySelector('.content nav .bx.bx-menu');
        menuBar.addEventListener('click', handleMenuBarClick);
    
        const searchBtn = document.querySelector('.content nav form .form-input button');
        searchBtn.addEventListener('click', handleSearchBtnClick);
    
        // window.addEventListener('resize', handleWindowResize);
    
        const toggler = document.getElementById('theme-toggle');
        toggler.addEventListener('change', handleThemeToggle);
    
        // Clean up event listeners when the component unmounts
        return () => {
          sideLinks.forEach((item) => {
            item.removeEventListener('click', handleSideMenuItemClick);
          });
          menuBar.removeEventListener('click', handleMenuBarClick);
          searchBtn.removeEventListener('click', handleSearchBtnClick);
          // window.removeEventListener('resize', handleWindowResize);
          toggler.removeEventListener('change', handleThemeToggle);
        };
      
      }, []); // Empty dependency array ensures this code runs only once, like componentDidMount

      const setMapTheme = () => 
      {

        setTimeout(()=>{
          if(mapStyle == 'streets-v12')
          {
            setMapStyle('navigation-night-v1')
          }else{
            setMapStyle('streets-v12')
          }
        }, 100)
     
      }
    return(


       <div className='DashboardLayout'>

       {isLoading && (
       <>
  <div className="loadingScreen"></div>
  <div className="loadingHandler">
  <RiseLoader
  id='loader'
  color="#1976D2"
  cssOverride={override}
  speedMultiplier={0.8}
/>
  </div>


       </>)}
       <noscript>You need to enable JavaScript to run this app.</noscript>
        <div className="adminSidebar close">
    <a href="/admin/settings" className="logo">
      <img src="/assets/img/kargada-logo.png" alt="Company Logo"/>
      <div className="logo-name">
        <span>Kar</span>gada
      </div>
    </a>
    <ul className="side-menu">
      {access.a_admin_board==1 && 
      <li>
        <Link to="/admin/dashboard">
          <i className="bx bxs-dashboard" />
          Dashboard
        </Link>
      </li>}
      {access.a_driver_board==1 && 
      <li>
        <Link to="/driver/dashboard">
          <i className="bx bxs-dashboard" />
          Dashboard
        </Link>
      </li>}
      {access.a_deliveries ==1 && 
            <li id='deliveries' onClick={(e)=>{toggleDropdown(e.currentTarget)}}>
            <Link to="/driver/deliveries">
            <i className='bx bx-package' ></i>
              Deliveries
            </Link>
          </li>
      }
      {access.a_history ==1 && 
     
            <li id='history' onClick={(e)=>{toggleDropdown(e.currentTarget)}}>
            <Link to="/driver/history">
            <i className='bx bx-history' ></i>
              History
            </Link>
          </li>
     }
      {access.a_driver_chat ==1 && 
      (<>
            <li id='chats' onClick={(e)=>{toggleDropdown(e.currentTarget)}}>
            <Link to="/driver/chats">
            <i className='bx bx-chat'></i>
              Chats
            </Link>
          </li>
                {chatsDropdown && (
                  <>
                <li>
                  <Link to="/admin/chats/list"  id='subMenu'>
                  chats List
                  </Link> 
                </li >
                <li >
                <Link to="/admin/chats/add" id='subMenu'>
                Add chats
                </Link> 
              </li>
              </>
              )
                }
      </>)}
      {access.a_maintenance ==1 && ( <>
            <li id='maintenance' onClick={(e)=>{toggleDropdown(e.currentTarget)}}>
            <Link to="#">
            <i className='bx bx-wrench'></i>
              Maintenance
            </Link>
          </li>
                {maintenanceDropdown && (
                  <>
                <li>
                  <Link to="/admin/maintenance/list"  id='subMenu'>
                  Maintenance List
                  </Link> 
                </li >
                <li >
                <Link to="/admin/maintenance/add" id='subMenu'>
                Add Maintenance
                </Link> 
              </li>
              </>
              )
                } </>)
          
          }

          {access.a_fuel ==1 && (
          <>
                  <li id='fuel' onClick={(e)=>{toggleDropdown(e.currentTarget)}}>
        <Link to="#">
        <i className='bx bx-gas-pump'></i>
          Fuel
        </Link>
      </li>
      {
        fuel && (
          <>
          <li>
            <Link to="/admin/fuel/manage"  id='subMenu'>
            Fuel Management
            </Link> 
          </li >
          <li >
          <Link to="/admin/fuel/add" id='subMenu'>
          Add Fuel
          </Link> 
        </li>
        </>
        )
      }
          
          </>)}
      {access.a_tracking ==1 && (
      <>
            <li id='tracking' onClick={(e)=>{toggleDropdown(e.currentTarget)}}>
        <Link to="#">
        <i className='bx bx-navigation'></i>
          Tracking
        </Link>
      </li>
      {trackingDropdown && (
        <>
      {/* <li >
        <a href="/admin/tracking/history" id='subMenu'>
        History Tracking
        </a> 
      </li> */}
      <li >
      <Link to="/admin/tracking/trips" id='subMenu'>
       Trips
      </Link> 
    </li>
    </>
    )
      } 
      </>)}
      {access.a_admin_chat ==1 && 
      (<>
            <li id='chats' onClick={(e)=>{toggleDropdown(e.currentTarget)}}>
            <Link to="#">
            <i className='bx bx-chat'></i>
              Chats
            </Link>
          </li>
                {chatsDropdown && (
                  <>
                <li>
                  <Link to="/admin/chats/list"  id='subMenu'>
                  chats List
                  </Link> 
                </li >
                <li >
                <Link to="/admin/chats/add" id='subMenu'>
                Add chats
                </Link> 
              </li>
              </>
              )
                }
      </>)}

      <li id='settings' onClick={(e)=>{toggleDropdown(e.currentTarget)}}>
        <Link to="/account/settings">
          <i className="bx bx-cog" />
          Settings
        </Link>
      </li>
      
    </ul>
    <ul className="side-menu">
      <li onClick={handleLogout} style={{cursor:"pointer"}}>
        <a className="logout">
          <i className="bx bx-log-out-circle" />
          Logout
        </a>
      </li>
    </ul>
  </div>
                
  {/* Main Content */}
  <div className="content">
    {/* Navbar */}
    <nav>
      <i className="bx bx-menu" />
      <form action="#">
        <div className="form-input">
          <input type="search" placeholder="Search..." />
          <button className="search-btn" type="submit">
            <i className="bx bx-search" />
          </button>
        </div>
      </form>
      <input type="checkbox" id="theme-toggle" hidden="" onClick={setMapTheme}/>
      <label htmlFor="theme-toggle" className="theme-toggle" onClick={setMapTheme} />
      <Link to="/account/settings" className="profile">
        <img src={`${hostServer}/${image}`} alt='Profile' />
      </Link>
    </nav>
    {/* End of Navbar */}
    <main>
         <Outlet context={{isLoading, setIsLoading, ...user, mapStyle, setMapStyle, theme, setImage, image}}/>

    </main>
  </div>
               
             
        </div>
    )
}

export default AdminDashboardLayout;