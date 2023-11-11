import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { calculateScheduling} from './algos/pnp';
import { GanttChart } from './GanttChart';

export const Scheduling = () => {
  const location = useLocation();
  const { processes } = location.state;
  const [schedulingData, setSchedulingData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);

  const [averageTurnaroundTime, setAverageTurnaroundTime] = useState(0);
  const [averageWaitingTime, setAverageWaitingTime] = useState(0);
  const [cpuUtilization, setCpuUtilization] = useState(0);
  const [totalCpuBurst, setToTalCpuBurst] = useState(0);
  const [finalEndTime, setFinalEndTime] = useState(0);

  useEffect(() => {
    const functionCall = calculateScheduling(processes);
    const originalData = functionCall.schedulingData;
    const sortedData = [...originalData].sort((a, b) => a.process.id.localeCompare(b.process.id));
    const timeline = functionCall.timelineList;

    const totalTurnaroundTime = sortedData.reduce((acc, data) => acc + data.turnaroundTime, 0);
    const avgTurnaroundTime = totalTurnaroundTime / sortedData.length;

    const totalWaitingTime = sortedData.reduce((acc, data) => acc + data.waitingTime, 0);
    const avgWaitingTime = totalWaitingTime / sortedData.length;

    const ttlCpuBurst = sortedData.reduce((acc, data) => acc + data.process.cpuBurst, 0);
    const finEndTime = sortedData.reduce((maxEndTime, data) => {return Math.max(maxEndTime, data.endTime);}, 0);
    const cpuUtil = ttlCpuBurst / finEndTime * 100;
    
    setSchedulingData(sortedData);
    setTimelineData(timeline);

    setAverageTurnaroundTime(avgTurnaroundTime);
    setAverageWaitingTime(avgWaitingTime);
    setToTalCpuBurst(ttlCpuBurst);
    setFinalEndTime(finEndTime);
    setCpuUtilization(cpuUtil);

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
            <th>Priority</th>
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
              <td>{data.process.priority}</td>
              <td>{data.endTime}</td>
              <td>{data.turnaroundTime}</td>
              <td>{data.waitingTime}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <h2>Gantt Chart</h2>
        <GanttChart data={timelineData}/>
      </div>

      <div className="container">
        <div className="row">
          <div className="col">
            <h5>
              CPU Utilization is at <sup>{totalCpuBurst}</sup>/<sub>{finalEndTime}</sub> = {cpuUtilization.toFixed(2)}%
            </h5>
          </div>
        </div>
        <div className="row">
          <div className="col">{schedulingData.map((data, index) => (
            <p key={index}>
              TAT<sub>{data.process.id}</sub> = {data.endTime} - {data.process.arrivalTime} = {data.turnaroundTime}
            </p>
            ))}
            <h5>The average turnaround time is {averageTurnaroundTime.toFixed(2)}</h5>
          </div>

          <div className="col">
            {schedulingData.map((data, index) => (
            <p key={index}>
              WT<sub>{data.process.id}</sub> = {data.turnaroundTime} - {data.process.cpuBurst} = {data.waitingTime}
            </p>
            ))}
            <h5>The average waiting time is {averageWaitingTime.toFixed(2)}</h5>
          </div>
        </div>
      </div>
    </div>
  );
};