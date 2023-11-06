import './App.css'
import {Route, Routes} from "react-router-dom"
import Home from './components/Home'
import { InputProcess } from './components/InputProcess'
import { Result } from './components/Result'

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/input' element={<InputProcess/>}/>
      <Route path='/result' element={<Result/>}/>
    </Routes>
    </>
  )
}

export default App
