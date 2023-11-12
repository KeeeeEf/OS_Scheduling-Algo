function calculateScheduling(processes) {
  let total = 0;
  let schedulingData = [];
  let timelineList = [];
  let queueList = [];
  let newList = [...processes];

  // Sort processes by arrival time and priority
  newList.sort(function(a, b) {
    if (a.arrivalTime !== b.arrivalTime) {
      return a.arrivalTime - b.arrivalTime;
    } else {
      return a.priority - b.priority;
    }
  });

  while (newList.length !== 0 || queueList.length !== 0) {
    function findQ(list) {
      while (list.length !== 0 && list[0].arrivalTime <= total) {
        queueList.push(list.shift());
      }
    }

    findQ(newList);

    if (queueList.length === 0 && newList.length > 0) {
      total = newList[0].arrivalTime;
    } else {
      // Sort the queue by priority
      queueList.sort(function(a, b) {
        return a.priority - b.priority;
      });

      // Execute the process with the highest priority
      const currentProcess = queueList.shift();
      total += currentProcess.cpuBurst;

      timelineList.push({
        time: total,
        value: currentProcess.id,
      });

      const endTime = total;
      const turnaroundTime = endTime - currentProcess.arrivalTime;
      const waitingTime = turnaroundTime - currentProcess.cpuBurst;

      schedulingData.push({
        process: currentProcess,
        endTime,
        turnaroundTime,
        waitingTime,
      });
    }
  }

  return { schedulingData, timelineList };
}

export { calculateScheduling };
