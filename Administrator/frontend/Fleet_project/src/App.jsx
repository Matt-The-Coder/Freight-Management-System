import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import io from 'socket.io-client'
import AdminDashboardLayout from './layouts/AdminDashboardLayout'
import {
  AdminDashboard, Login, LiveTracking, TrackingTrips, UpcomingTrips, AdminChat, EditMaintenance,
  MaintenanceList, AddMaintenance, Settings, LandingPage, AddFuel, FuelManagement, EditFuel, AdminHistory, DeliveryReports
} from './pages/adminPages/Components.js'
import Notfound from './pages/Notfound'
import { History, Deliveries, DriverDashboard, DeliveryTracking, DriverChat } from './pages/driverPages/driverComponents.js'
const hostServer = import.meta.env.VITE_SERVER_HOST
const socket = io.connect(`${hostServer}`)
const App = () => {
  return (
    <>
      <Routes>

        <Route element={<AdminDashboardLayout socket={socket} />}>
          {/* Admin Side */}
          <Route path='/admin/dashboard' element={<AdminDashboard />} />
          <Route path='/admin/maintenance/add' element={<AddMaintenance />} />
          <Route path='/admin/maintenance/list' element={<MaintenanceList />} />
          <Route path='/admin/history/list' element={<AdminHistory />} />
          <Route path='/admin/maintenance/edit/:maintenanceID' element={<EditMaintenance />} />
          <Route path='/account/settings' element={<Settings />} />
          <Route path='/admin/tracking/trips/ongoing' element={<TrackingTrips />} />
          <Route path='/admin/tracking/trips/upcoming' element={<UpcomingTrips />} />
          <Route path='/admin/reports/trips' element={<DeliveryReports />} />
          <Route path='/admin/tracking/live/:trip_id' element={<LiveTracking />} />
          <Route path='/admin/fuel/manage' element={<FuelManagement />} />
          <Route path='/admin/fuel/add' element={<AddFuel />} />
          <Route path='/admin/fuel/edit/:fuel_id' element={<EditFuel />} />
          <Route path='/admin/chat' element={<AdminChat socket={socket}
          />} />
          {/* Driver Side */}

          <Route path='/driver/chats' element={<DriverChat socket={socket}/>} />
          <Route path='/driver/history' element={<History />} />
          <Route path='/driver/deliveries' element={<Deliveries />} />
          <Route path='/driver/deliveries/tracking/:trip_id' element={<DeliveryTracking />} />
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
