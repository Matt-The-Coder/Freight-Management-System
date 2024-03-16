import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import io from 'socket.io-client'
import AdminDashboardLayout from './layouts/AdminDashboardLayout'
import DriverDashboardLayout from './layouts/DriverDashboardLayout.jsx'
import {
  AdminDashboard, Login, LiveTracking, TrackingTrips, UpcomingTrips, AdminChat, EditMaintenance, SubModules,
  MaintenanceList, AddMaintenance, Settings, LandingPage, AddFuel, FuelManagement, EditFuel, AdminHistory, DeliveryReports, SustainabilityReports
} from './pages/adminPages/Components.js'
import Notfound from './pages/Notfound'
import { History, Deliveries, DriverDashboard, DeliveryTracking, DriverChat, Inprogress, DriverSettings } from './pages/driverPages/driverComponents.js'
const hostServer = import.meta.env.VITE_SERVER_HOST
const socket = io.connect(`${hostServer}`)
const App = () => {
  return (
    <>
      <Routes>

        <Route element={<AdminDashboardLayout socket={socket} />}>
          {/* Admin Side */}
          <Route path='/admin/dashboard' element={<AdminDashboard socket={socket} />} />
          <Route path='/admin/maintenance/add' element={<AddMaintenance />} />
          <Route path='/admin/maintenance/list' element={<MaintenanceList />} />
          <Route path='/admin/history/list' element={<AdminHistory socket={socket} />} />
          <Route path='/admin/maintenance/edit/:maintenanceID' element={<EditMaintenance />} />
          <Route path='/account/admin/settings' element={<Settings />} />
          <Route path='/admin/tracking/trips/ongoing' element={<TrackingTrips socket={socket} />} />
          <Route path='/admin/tracking/trips/upcoming' element={<UpcomingTrips socket={socket} />} />
          <Route path='/admin/reports/trips' element={<DeliveryReports socket={socket} />} />
          <Route path='/admin/reports/sustainability' element={<SustainabilityReports socket={socket} />} />
          <Route path='/admin/tracking/live/' element={<LiveTracking socket={socket} />} />
          <Route path='/admin/fuel/manage' element={<FuelManagement />} />
          <Route path='/admin/fuel/add' element={<AddFuel />} />
          <Route path='/admin/fuel/edit/:fuel_id' element={<EditFuel />} />
          <Route path='/admin/chat' element={<AdminChat socket={socket}
          />} />
        </Route>

        {/* Driver Side */}

        <Route element={<DriverDashboardLayout socket={socket}/>}>
          <Route path='/driver/chats' element={<DriverChat socket={socket} />} />
          <Route path='/driver/history/deliveries' element={<History socket={socket} />} />
          <Route path='/driver/deliveries/ongoing' element={<Inprogress socket={socket} />} />
          <Route path='/driver/deliveries/pending' element={<Deliveries socket={socket} />} />
          <Route path='/driver/deliveries/tracking/' element={<DeliveryTracking socket={socket} />} />
          <Route path='/account/driver/settings' element={<DriverSettings />} />
          <Route path='/driver/dashboard' element={<DriverDashboard socket={socket} />} />
        </Route>

        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/modules' element={<SubModules />} />
        <Route path='/*' element={<Notfound />} />
      </Routes>
    </>
  )
}

export default App
