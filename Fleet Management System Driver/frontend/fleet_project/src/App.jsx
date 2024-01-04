import { useState } from 'react'
import {Route, Routes} from 'react-router-dom'
import { Homepage } from './pages/components'
import Homelayout from './layouts/Homelayout'
function App() {

  return (
    <>
    <Routes>
      <Route  element={<Homelayout/>}>

      </Route>
      <Route path="/" element={<Homepage/>}/>
    </Routes>
    </>
  )
}

export default App
