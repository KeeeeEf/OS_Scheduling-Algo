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

function fcfs(processes) {
    let total = 0;
    let schedulingData = [];
    let timelineList = [];
    let queueList = [];
    let newList = processes;

    while(newList.length != 0 || queueList.length != 0){
        function findQ(list){
            while(list.length != 0 && list[0].arrivalTime <= total){
                queueList.push(list.shift());
            }
        }

        findQ(newList);

        if(queueList.length == 0 && newList.length > 0){
            total += newList[0].arrivalTime;
            timelineList.push({
                time: total,
                value: 'idle'
            })
        }else{
            while(queueList!=0){
                if(newList.length>0 && total>=newList[0].arrivalTime){
                    break
                }

                total += queueList[0].cpuBurst;
                const temp = {...queueList[0]};
                timelineList.push({
                    time: total,
                    value: temp.id
                })  
                const endTime = total;
                const turnaroundTime = endTime - queueList[0].arrivalTime;
                const waitingTime = turnaroundTime - queueList[0].cpuBurst;
                schedulingData.push({
                    process: queueList[0],
                    endTime,
                    turnaroundTime,
                    waitingTime,
                });
                queueList.shift();
            }
        }
    }
        
      return {schedulingData, timelineList};
}

function sjf(processes) {
    let total = 0;
    let schedulingData = [];
    let timelineList = [];
    let queueList = [];
    let newList = processes;

    while(newList.length != 0 || queueList.length != 0){
        function findQ(list){
            while(list.length != 0 && list[0].arrivalTime <= total){
                queueList.push(list.shift());
            }
        }

        findQ(newList);

        if(queueList.length == 0 && newList.length > 0){
            total += newList[0].arrivalTime;
            timelineList.push({
                time: total,
                value: 'idle'
            })
        }else{
            queueList.sort(function(a,b){return a.cpuBurst-b.cpuBurst});
            while(queueList!=0){
                if(newList.length>0 && total>=newList[0].arrivalTime){
                    break
                }

                total += queueList[0].cpuBurst;
                const temp = {...queueList[0]};
                timelineList.push({
                    time: total,
                    value: temp.id
                })  
                const endTime = total;
                const turnaroundTime = endTime - queueList[0].arrivalTime;
                const waitingTime = turnaroundTime - queueList[0].cpuBurst;
                schedulingData.push({
                    process: queueList[0],
                    endTime,
                    turnaroundTime,
                    waitingTime,
                });
                queueList.shift();
            }
        }
    }
        
      return {schedulingData, timelineList};
}

function srjf(processes) {
    const n = processes.length;
    const remainingTime = new Array(n).fill(0);
    const completed = new Array(n).fill(false);
    const schedulingData = [];
  
    let currentTime = 0;
    let completedCount = 0;
  
    while (completedCount < n) {
      let minRemainingTime = Number.MAX_VALUE;
      let minIndex = -1;
  
      for (let i = 0; i < n; i++) {
        if (processes[i].arrivalTime <= currentTime && !completed[i]) {
          if (processes[i].cpuBurst - remainingTime[i] < minRemainingTime) {
            minRemainingTime = processes[i].cpuBurst - remainingTime[i];
            minIndex = i;
          }
        }
      }
  
      if (minIndex === -1) {
        currentTime++;
        continue;
      }
  
      remainingTime[minIndex]++;
  
      if (remainingTime[minIndex] === processes[minIndex].cpuBurst) {
        completedCount++;
        completed[minIndex] = true;
        const endTime = currentTime + 1;
        const turnaroundTime = endTime - processes[minIndex].arrivalTime;
        const waitingTime = turnaroundTime - processes[minIndex].cpuBurst;
        schedulingData.push({
          process: processes[minIndex],
          endTime,
          turnaroundTime,
          waitingTime,
        });
      }
  
      currentTime++;
    }
  
    return {schedulingData, timelineList}
  }

function pnp(processes) {
    let total = 0;
    let schedulingData = [];
    let timelineList = [];
    let queueList = [];
    let newList = processes;
  
    // Sort processes by arrival time and priority
    newList.sort(function(a, b) {
        return a.priority - b.priority;
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
  
    return {schedulingData, timelineList}
  }

function pp(processes){
    let total = 0;
    let timelineList = [];
    let queueList = [];
    let newList = processes;
    let schedulingData = [];

    while(newList.length != 0 || queueList.length!=0){
        let nextProcess = undefined;

        function findQ(list){
            while(list.length !=0 && list[0].arrivalTime <= total){
                queueList.push(list.shift());
            }
            nextProcess = list.length > 0? list[0].arrivalTime : undefined;
        }

        findQ(newList);

        if(queueList.length === 0){
            total += nextProcess
            timelineList.push({
                time: total,
                value: 'idle'
            })
        }else{
            while(queueList.length!==0){
                queueList.sort(function(a,b){return a.priority - b.priority});

                let temp = {...queueList[0]};

                if(nextProcess != undefined){
                    for(let x = 0; x<nextProcess && temp.cpuBurst !=0; x++){
                        total += 1;
                        temp.cpuBurst = Math.max(temp.cpuBurst - 1,0);
                    }
                    findQ(newList);
                }else{
                    total += temp.cpuBurst;
                    temp.cpuBurst = 0;
                }

                queueList.shift()
                timelineList.push({
                    time: total,
                    value: temp.id
                })

                if(temp.cpuBurst > 0){
                    queueList.push(temp);
                    queueList.sort(function(a,b){return a.id - b.id});
                }else{
                    let process = processes.find((data)=>{
                        return data.id == temp.id;
                    })
                    const endTime = total;
                    const turnaroundTime = endTime - process.arrivalTime;
                    const waitingTime = turnaroundTime - process.cpuBurst;
                    schedulingData.push({
                        process: process,
                        endTime,
                        turnaroundTime,
                        waitingTime,
                    });
                }
            }
        }
    }

    return {schedulingData, timelineList}
}

function rr(newList, processes,tq, processTotal) {
    let queue = []
    let timelineList = []

    if(processes.length == 0 && newList.length > 0){
        total += newList[0].arrivalTime;
        timelineList.push({
            time: total,
            value: 'idle'
        })
    }

    while(processes.length != 0){
        let temp = {...processes[0]}
        processTotal += (processes[0].cpuBurst >= tq)?tq:processes[0].cpuBurst
        temp.cpuBurst = Math.max(temp.cpuBurst-tq, 0);
        processes.shift();
        timelineList.push({
            time: processTotal,
            value: temp.id
        })
        if(temp.cpuBurst > 0){
            queue.push(temp);
        }
    }
   return {queue, timelineList};
}

function calculateScheduling(process, queueInfo){
    let total = 0
    let levelQueue = [];
    let processQueue = [];
    let newList = [...process];

    newList.sort(function(a,b){return a.arrivalTime - b.arrivalTime});

    for(let x =0; x<queueInfo.levels;x++){
        if(x == queueInfo.levels-1){
            levelQueue.push({
                levelID: x,    
                queueList: [],
                timelineList: [],
                algo: queueInfo.algo,
            });
        }else{
            levelQueue.push({
                levelID: x,        
                queueList: [],
                timelineList: [],
                algo: 'RR',
                timeQuantum: queueInfo.tq[x]
            })
        }
    }
    
    while(newList.length!=0){
        let level = 0;
        
        function findQ(list) {
          while (list.length !== 0 && list[0].arrivalTime <= total) {
            processQueue.push(list.shift());
          }
        }

        findQ(newList);

        while(level<queueInfo.level){

            function algoSelect(queueInfo, newList, total){
                let algo = queueInfo.algo
                switch(algo){
                    case algo == 'RR':
                       return rr(newList, queueInfo.queueList, queueInfo.timeQuantum, total);
                    case algo == 'FCFS':
                       return fcfs(newList, queueInfo.queueList, total);
                    case algo == 'SJF':
                        return sjf(newList, queueInfo.queueList, total);
                    case algo == 'SRJF':
                        return srjf(newList, queueInfo.queueList, total);
                    case algo == 'PNP':
                        return pnp(newList, queueInfo.queueList, total);
                    case algo == 'PP':
                        return pp(newList, queueInfo.queueList, total);
                }
            }

            if(processQueue.length != 0){
                level = 0;
                levelQueue[level].queueList.push(...processQueue);
                processQueue.splice(0, processQueue.length);

                let lists = algoSelect(levelQueue[level],newList, total)
                levelQueue[level].timelineList.push(...lists.timelineList);

                if(levelQueue[level].length != 0 && level < levelQueue[level].length-1){
                    levelQueue[level+1].queueList.push(...lists.schedulingData);
                }

                findQ(newList);

                level += 1;
            }else if(levelQueue[level].queueList.length != 0){

                let lists = algoSelect(levelQueue[level, newList, total])
                levelQueue[level].timelineList.push(...lists.timelineList);

                if(levelQueue[level].length != 0 && level < levelQueue[level].length-1){
                    levelQueue[level+1].queueList.push(...lists.schedulingData);
                }

                findQ(newList)

                level += 1;
            }
        }
    }
    return levelQueue
}

const Declare = () =>{
    // const A = new Process(1, 0 , 8, 1)
    // const B = new Process(2, 3, 4, 1)
    // const C = new Process(3, 4, 5, 1)
    // const D = new Process(4, 6, 3, 1)
    // const E = new Process(5, 10, 2, 1)

    // const A = new Process(1, 0 , 8, 1)
    // const B = new Process(2, 3, 4, 3)
    // const C = new Process(3, 4, 5, 2)
    // const D = new Process(4, 6, 3, 5)
    // const E = new Process(5, 10, 2, 4)

    const A = new Process(1, 0 , 8, 1)
    const B = new Process(2, 3, 4, 1)
    const C = new Process(3, 4, 5, 2)
    const D = new Process(4, 6, 3, 3)
    const E = new Process(5, 10, 2, 2)

    const queueInfo = {
        levels: 3,
        algo: 'fcfs',
        tq: [3,3]
    }


    let processList  = [A,B,C,D,E];

    const timeline = calculateScheduling(processList, queueInfo)
    timeline[3].queueList.sort((a, b) => a.process.id - b.process.id);

    timeline.map((data)=>{
        show(data);
        // console.log(data.value, data.time);
    })
}

export {Declare, calculateScheduling}