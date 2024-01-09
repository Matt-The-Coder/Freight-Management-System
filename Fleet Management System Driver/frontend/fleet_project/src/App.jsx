import { useState } from 'react'
import {Route, Routes} from 'react-router-dom'
import { Homepage, Chat, Deliveries, History, Dashboard, Settings, Login} from './pages/components'
import Homelayout from './layouts/Homelayout'
function App() {

  return (
    <>
    <Routes>
      <Route  element={<Homelayout/>}>
      <Route path='/driver/dashboard' element={<Dashboard/>}/>
      <Route path='/driver/Chat' element={<Chat/>}/>
      <Route path='/driver/Deliveries' element={<Deliveries/>}/>
      <Route path='/driver/History' element={<History/>}/>
      <Route path='/driver/settings' element={<Settings/>}/>
      </Route>
      <Route path='/driver/login' element={<Login/>}/>
      <Route path="/" element={<Homepage/>}/>
    </Routes>
    </>
  )
}

export default App
