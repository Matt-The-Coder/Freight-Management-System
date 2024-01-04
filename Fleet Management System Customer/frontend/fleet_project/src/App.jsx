import { useState } from 'react'
import {Route, Routes} from 'react-router-dom'
import { LiveTracking } from './pages/components'
import Homelayout from './layouts/Homelayout'
function App() {

  return (
    <>
    <Routes>
      <Route  element={<Homelayout/>}>

      </Route>
      <Route path="/" element={<LiveTracking/>}/>
    </Routes>
    </>
  )
}

export default App
