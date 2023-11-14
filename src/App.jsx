import './App.css'
import {Route, Routes} from "react-router-dom"
import Home from './components/Home'

import { InputProcess } from './components/InputProcess'
import { Scheduling } from './components/Scheduling'

import { PriorityInputProcess } from './components/PriorityInputProcess'
import { PriorityScheduling } from './components/PriorityScheduling'

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/input' element={<InputProcess/>}/>
      <Route path='/scheduling' element={<Scheduling/>}/>
      <Route path='/priority-input' element={<InputProcess/>}/>
      <Route path='/priority-scheduling' element={<Scheduling/>}/>
    </Routes>
    </>
  )
}

export default App
