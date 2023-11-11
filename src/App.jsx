import './App.css'
import {Route, Routes} from "react-router-dom"
import Home from './components/Home'
import { InputProcess } from './components/InputProcess'
import { Scheduling } from './components/Scheduling'

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/input' element={<InputProcess/>}/>
      <Route path='/scheduling' element={<Scheduling/>}/>
    </Routes>
    </>
  )
}

export default App
