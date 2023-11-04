import './App.css'
import {Route, Routes} from "react-router-dom"
import Home from './components/Home'
import { InputProcess } from './components/InputProcess'

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/input' element={<InputProcess/>}/>
    </Routes>
    </>
  )
}

export default App
