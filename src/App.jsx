import './App.css'
import {Route, Routes} from "react-router-dom"
import Home from './components/Home'

import { InputProcess } from './components/InputProcess'
import { Scheduling } from './components/Scheduling'

import { PriorityInputProcess } from './components/PriorityInputProcess'
import { PriorityScheduling } from './components/PriorityScheduling'

import { RRInputProcess } from './components/RRInputProcess'
import { RRScheduling } from './components/RRScheduling'

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/input' element={<InputProcess/>}/>
      <Route path='/scheduling' element={<Scheduling/>}/>
      <Route path='/priority-input' element={<PriorityInputProcess/>}/>
      <Route path='/priority-scheduling' element={<PriorityScheduling/>}/>
      <Route path='/rr-input' element={<RRInputProcess/>}/>
      <Route path='/rr-scheduling' element={<RRScheduling/>}/>
    </Routes>
    </>
  )
}

export default App
