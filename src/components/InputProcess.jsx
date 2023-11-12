import React, { useState, useEffect } from 'react'
import '/src/App.css'
import { useNavigate } from 'react-router-dom'

export const InputProcess = () => {
  const navigate = useNavigate()
  const [processes, setProcesses] = useState([])
  const [arrivalTime, setArrivalTime] = useState('')
  const [cpuBurst, setCpuBurst] = useState('')
  const [editId, setEditId] = useState(null)

  const getNextProcessId = () => {
    const lastProcess = processes[processes.length - 1]
    if (!lastProcess) {
      return 'A'
    }
    const lastId = lastProcess.id
    const nextCharCode = lastId.charCodeAt(0) + 1
    return String.fromCharCode(nextCharCode)
  }

  const validateInput = () => {
    
    if (arrivalTime === '' || arrivalTime < 0) {
      alert('Please enter valid arrival time');
      return false;
    }

    if (cpuBurst === '' || cpuBurst < 1) {
      alert('Please enter valid CPU burst time.');
      return false;
    }

    return true;
  };

  // add or edit process
  const handleAddProcess = () => {
    if (!validateInput()) {
      return;
    }
    const remaining = parseInt(cpuBurst)

    if (editId !== null) {
      const updatedProcesses = processes.map((process) => {
        if (process.id === editId) {
          return {
            id: process.id,
            arrivalTime: parseInt(arrivalTime),
            cpuBurst: parseInt(cpuBurst),
          }
        }
        return process
      })
      setProcesses(updatedProcesses)
      setEditId(null)
    } else {
      const newProcess = {
        id: getNextProcessId(),
        arrivalTime: parseInt(arrivalTime),
        cpuBurst: parseInt(cpuBurst),
      }

      setProcesses([...processes, newProcess])
    }

    setArrivalTime('')
    setCpuBurst('')
  }

  // edit process
  const handleEditProcess = (id) => {
    const processToEdit = processes.find((process) => process.id === id)
    if (processToEdit) {
      setArrivalTime(processToEdit.arrivalTime.toString())
      setCpuBurst(processToEdit.cpuBurst.toString())
      setEditId(id)
    }
  }

  // delete process
  const handleDeleteProcess = (id) => {
    setProcesses((prevProcesses) => prevProcesses.filter((process) => process.id !== id))
    setEditId(null)

    setProcesses((prevProcesses) => {
      return prevProcesses.map((process, index) => ({
        ...process,
        id: String.fromCharCode('A'.charCodeAt(0) + index),
      }))
    })
  }

  useEffect(() => {
    const storedProcesses = JSON.parse(sessionStorage.getItem('inputProcesses'))
    if (storedProcesses) {
      setProcesses(storedProcesses)
    }
  }, [])

  const storeProcessesData = (data) => {
    sessionStorage.setItem('inputProcesses', JSON.stringify(data))
  }

  const handleSimulate = () => {

    if (processes.length < 2) {
      alert('Please add at least two processes before simulating.');
      return;
    }

    storeProcessesData(processes)
    navigate('/scheduling', {
      state: {
        processes,
      },
    })
  }

  return (
    <div>
      <h1>Input Processes</h1>
      <table className="table mt-5">
        <thead>
          <tr>
            <th>Process ID</th>
            <th>Arrival Time</th>
            <th>CPU Burst</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((process) => (
            <tr key={process.id}>
              <td>{process.id}</td>
              <td>
                {editId === process.id ? (
                  <input
                    type="number"
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="form-control"
                  />
                ) : (
                  process.arrivalTime
                )}
              </td>
              <td>
                {editId === process.id ? (
                  <input
                    type="number"
                    value={cpuBurst}
                    onChange={(e) => setCpuBurst(e.target.value)}
                    className="form-control"
                  />
                ) : (
                  process.cpuBurst
                )}
              </td>
              <td>
                {editId === process.id ? (
                  <button onClick={handleAddProcess} className="btn btn-primary">
                    Save
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditProcess(process.id)}
                      className="btn btn-warning mx-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProcess(process.id)}
                      className="btn btn-danger mx-2"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="row mt-5">
        <div className="col">
          <div className="form-group">
            <h5 className="bold">Arrival Time</h5>
            <input
              type="number"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              className="form-control"
            />
          </div>
        </div>

        <div className="col">
          <div className="form-group">
            <h5 className="bold">CPU Burst</h5>
            <input
              type="number"
              value={cpuBurst}
              onChange={(e) => setCpuBurst(e.target.value)}
              className="form-control"
            />
          </div>
        </div>

        <div className="col mt-2">
          <button onClick={handleAddProcess} className="btn btn-primary m-4">
            {editId !== null ? 'Save' : 'Add Process'}
          </button>
        </div>
      </div>

      <button onClick={handleSimulate} className="btn btn-lg btn-danger mx-2 mt-5">
        Simulate Scheduling
      </button>
    </div>
  )
}
