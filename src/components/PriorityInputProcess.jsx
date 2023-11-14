import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const PriorityInputProcess = () => {
  const navigate = useNavigate();
  const [processes, setProcesses] = useState([]);
  const [arrivalTime, setArrivalTime] = useState('');
  const [cpuBurst, setCpuBurst] = useState('');
  const [priority, setPriority] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const storedProcesses = JSON.parse(sessionStorage.getItem('inputProcesses')) || [];
    setProcesses(storedProcesses);
  }, []);

  const storeProcessesData = (data) => {
    sessionStorage.setItem('inputProcesses', JSON.stringify(data));
  };

  const getNextProcessId = () => {
    const lastProcess = processes[processes.length - 1];
    return lastProcess ? String.fromCharCode(lastProcess.id.charCodeAt(0) + 1) : 'A';
  };

  const validateInput = () => {

    if (arrivalTime === '' || arrivalTime < 0) {
      alert('Please enter valid arrival time');
      return false;
    }

    if (cpuBurst === '' || cpuBurst < 1) {
      alert('Please enter valid CPU burst time.');
      return false;
    }

    if (priority === '' || priority < 1) {
      alert('Please enter valid priority.');
      return false;
    }

    return true;
  };

  const handleAddProcess = () => {
    if (!validateInput()) {
      return;
    }

    const remaining = parseInt(cpuBurst);

    if (editId !== null) {
      const updatedProcesses = processes.map((process) =>
        process.id === editId
          ? { ...process, arrivalTime: parseInt(arrivalTime), cpuBurst: parseInt(cpuBurst), priority: parseInt(priority) }
          : process
      );
      setProcesses(updatedProcesses);
      setEditId(null);
    } else {
      const newProcess = {
        id: getNextProcessId(),
        arrivalTime: parseInt(arrivalTime),
        cpuBurst: parseInt(cpuBurst),
        priority: parseInt(priority),
      };

      setProcesses([...processes, newProcess]);
    }

    setArrivalTime('');
    setCpuBurst('');
    setPriority('');
  };

  const handleEditProcess = (id) => {
    const processToEdit = processes.find((process) => process.id === id);
    if (processToEdit) {
      setArrivalTime(processToEdit.arrivalTime.toString());
      setCpuBurst(processToEdit.cpuBurst.toString());
      setPriority(processToEdit.priority.toString());
      setEditId(id);
    }
  };

  const handleDeleteProcess = (id) => {
    setProcesses((prevProcesses) => prevProcesses.filter((process) => process.id !== id));
    setEditId(null);

    setProcesses((prevProcesses) =>
      prevProcesses.map((process, index) => ({
        ...process,
        id: String.fromCharCode('A'.charCodeAt(0) + index),
      }))
    );
  };

  const handleSimulate = () => {
  
    if (processes.length < 2) {
      alert('Please add at least two processes before simulating.');
      return;
    }

    storeProcessesData(processes);
    navigate('/priority-scheduling', {
      state: {
        processes,
      },
    });
  };

  const handleBack = () => {
    navigate('/');
    window.location.reload();
  };
  
  return (
    <div>
      <h1>Input Processes</h1>
      <button onClick={handleBack} className="btn btn-primary">Back to Home</button>
      <table className="table mt-5">
        <thead>
          <tr>
            <th>Process ID</th>
            <th>Arrival Time</th>
            <th>CPU Burst</th>
            <th>Priority</th>
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
                    <input
                    type="number"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="form-control"
                    />
                ) : (
                    process.priority
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

        <div className="col">
          <div className="form-group">
            <h5 className="bold">Priority</h5>
            <input
              type="number"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
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
