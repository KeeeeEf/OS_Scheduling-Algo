import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { calculateScheduling } from '../algos/srtfScheduling';

export const Scheduling = () => {
  const location = useLocation();
  const { processes } = location.state;
  const [schedulingData, setSchedulingData] = useState([]);

  useEffect(() => {
    const calculatedData = calculateScheduling(processes);
    calculatedData.sort((a, b) => a.process.id - b.process.id);
    setSchedulingData(calculatedData);
  }, [processes]);

  return (
    <div>
      <h1>Scheduling</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Process ID</th>
            <th>Arrival Time</th>
            <th>CPU Burst</th>
            <th>End Time</th>
            <th>Turnaround Time</th>
            <th>Waiting Time</th>
          </tr>
        </thead>
        <tbody>
          {schedulingData.map((data, index) => (
            <tr key={index}>
              <td>{data.process.id}</td>
              <td>{data.process.arrivalTime}</td>
              <td>{data.process.cpuBurst}</td>
              <td>{data.endTime}</td>
              <td>{data.turnaroundTime}</td>
              <td>{data.waitingTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h2>Gantt Chart</h2>
      </div>
    </div>
  );
};