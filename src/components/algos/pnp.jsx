function calculateScheduling(processes) {
  processes.sort((a, b) => a.priority - b.priority);

  let currentTime = 0;
  let schedulingData = [];
  let timelineList = [];

  processes.forEach((process) => {
    if (process.arrivalTime > currentTime) {
      currentTime = process.arrivalTime;
    }

    const startTime = currentTime;
    const endTime = startTime + process.cpuBurst;
    const turnaroundTime = endTime - process.arrivalTime;
    const waitingTime = turnaroundTime - process.cpuBurst;
    currentTime = endTime;

    schedulingData.push({
      process: process,
      startTime,
      endTime,
      turnaroundTime,
      waitingTime,
    });

    timelineList.push({
      time: endTime,
      value: process.id,
    });
    
  });
  
  return { schedulingData, timelineList };
}

export { calculateScheduling };
