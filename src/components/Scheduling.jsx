import React from 'react';
import { useLocation } from "react-router-dom";


export const Scheduling = () => {
  const location = useLocation();
  const { processes } = location.state;

    return (
      <div>
      <h1>Scheduling</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Process ID</th>
            <th>Arrival Time</th>
            <th>CPU Burst</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((process) => (
            <tr key={process.id}>
              <td>{process.id}</td>
              <td>{process.arrivalTime}</td>
              <td>{process.cpuBurst}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Render the scheduling content using the 'processes' data */}
    </div>
    );
};
