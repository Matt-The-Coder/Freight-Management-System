import { Routes, Route } from 'react-router-dom'
import AdminDashboardLayout from './layouts/AdminDashboardLayout'
import {
  AdminDashboard, Login, LiveTracking, TrackingTrips,
  MaintenanceList, AddMaintenance, Settings, LandingPage, AddFuel, FuelManagement
} from './pages/adminPages/Components.js'
import Notfound from './pages/Notfound'
import { Chats, History, Deliveries, DriverDashboard, DeliveryTracking } from './pages/driverPages/driverComponents.js'

const App = () => {


  return (
    <>
      <Routes>

        <Route element={<AdminDashboardLayout />}>
          {/* Admin Side */}
          <Route path='/admin/dashboard' element={<AdminDashboard />} />
          <Route path='/admin/maintenance/add' element={<AddMaintenance />} />
          <Route path='/admin/maintenance/list' element={<MaintenanceList />} />
          <Route path='/account/settings' element={<Settings />} />
          <Route path='/admin/tracking/trips' element={<TrackingTrips />} />
          <Route path='/admin/tracking/live' element={<LiveTracking />} />
          <Route path='/admin/fuel/manage' element={<FuelManagement />} />
          <Route path='/admin/fuel/add' element={<AddFuel />} />
          {/* Driver Side */}
          <Route path='/driver/chats' element={<Chats />} />
          <Route path='/driver/history' element={<History />} />
          <Route path='/driver/deliveries' element={<Deliveries />} />
          <Route path='/driver/deliveries/tracking' element={<DeliveryTracking />} />
          <Route path='/driver/dashboard' element={<DriverDashboard />} />
        </Route>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/*' element={<Notfound />} />
      </Routes>
    </>
  )
}

export default App
