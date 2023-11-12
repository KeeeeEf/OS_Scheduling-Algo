class Process{
    constructor(id, arrivalTime, cpuBurst, priority, endTime=0, turnaroundTime=0, waitingTime=0){
        this.id = id;;
        this.arrivalTime = arrivalTime;
        this.cpuBurst = cpuBurst;
        this.priority = priority
        this.endTime = endTime;
        this.turnaroundTime = turnaroundTime;
        this.waitingTime = waitingTime;
    }
}

function show(data) {
    console.log(data.process.id, data.process.arrivalTime, data.process.cpuBurst, data.process.priority, data.endTime, data.turnaroundTime, data.waitingTime);
}

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

  return schedulingData
}
    
const Declare = () =>{
    const A = new Process('A', 0 , 8, 2)
    const B = new Process('B', 3, 4, 3)
    const C = new Process('C', 4, 5, 1)
    const D = new Process('D', 6, 3, 5)
    const E = new Process('E', 10, 2, 4)


    let processList  = []

    processList.push(A)
    processList.push(B)
    processList.push(C)
    processList.push(D)
    processList.push(E)

    const timeline = calculateScheduling(processList)

    console.log(timeline[0]);

    timeline.map((data)=>{
        show(data);
        // console.log(data.value, data.time);
    })
}

export {Declare}