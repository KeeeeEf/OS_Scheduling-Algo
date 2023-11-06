import React, { useState } from 'react'
import '/src/App.css'
import { Link, useNavigate } from 'react-router-dom'

export const InputProcess = () => {
    const [processes, setProcesses] = useState([]);
    const [arrivalTime, setArrivalTime] = useState('');
    const [cpuBurst, setCpuBurst] = useState('');
    const [editId, setEditId] = useState(null);
  
    const handleAddProcess = () => {
        if (arrivalTime === '' || arrivalTime < 0) {
            alert('Please enter valid arrival time');
            return;
        }

        if (cpuBurst === '' || cpuBurst < 1) {
            alert('Please enter valid CPU burst time.');
            return;
        }
        
          if (editId !== null) {
            // If editId is not null, update the existing process
            const updatedProcesses = processes.map((process) => {
              if (process.id === editId) {
                return {
                  id: process.id,
                  arrivalTime: parseInt(arrivalTime),
                  cpuBurst: parseInt(cpuBurst),
                };
              }
              return process;
            });
        
            setProcesses(updatedProcesses);
            setEditId(null);
          } else {
            // If editId is null, add a new process
            const newProcess = {
              id: processes.length === 0 ? 1 : processes[processes.length - 1].id + 1,
              arrivalTime: parseInt(arrivalTime),
              cpuBurst: parseInt(cpuBurst),
            };
        
            setProcesses([...processes, newProcess]);
          }
        
          setArrivalTime('');
          setCpuBurst('');
    };
  
    const handleEditProcess = (id) => {
      const processToEdit = processes.find((process) => process.id === id);
      if (processToEdit) {
        setArrivalTime(processToEdit.arrivalTime.toString());
        setCpuBurst(processToEdit.cpuBurst.toString());
        setEditId(id);
      }
    };
  
    const handleDeleteProcess = (id) => {
      setProcesses((prevProcesses) => prevProcesses.filter((process) => process.id !== id));
      setEditId(null);
      
      setProcesses((prevProcesses) => {
        return prevProcesses.map((process, index) => ({
          ...process,
          id: index + 1,
        }));
      });
    };

    const navigate = useNavigate()

    const handleSimulate = () =>{
      navigate('/scheduling')
    }
  
    return (
      <div>
        <h1>Input Processes</h1>
        <table className="table">
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
                <td>{editId === process.id ? (
                  <input
                    type="number"
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="form-control"
                  />
                ) : process.arrivalTime}</td>
                <td>{editId === process.id ? (
                  <input
                    type="number"
                    value={cpuBurst}
                    onChange={(e) => setCpuBurst(e.target.value)}
                    className="form-control"
                  />
                ) : process.cpuBurst}</td>
                <td>
                  {editId === process.id ? (
                    <button onClick={handleAddProcess} className="btn btn-primary">
                      Save
                    </button>
                  ) : (
                    <>
                      <button onClick={() => handleEditProcess(process.id)} className="btn btn-warning">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteProcess(process.id)} className="btn btn-danger">
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="form-group">
          <label>Arrival Time:</label>
          <input
            type="number"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>CPU Burst:</label>
          <input
            type="number"
            value={cpuBurst}
            onChange={(e) => setCpuBurst(e.target.value)}
            className="form-control"
          />
        </div>
        
        <button onClick={handleAddProcess} className="btn btn-primary">
          {editId !== null ? 'Save' : 'Add Process'}
        </button>

        <button onClick={handleSimulate} className="btn btn-primary">
            Simulate
        </button>

      </div>
    );
};
