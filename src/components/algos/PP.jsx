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
  
    newList.sort(function(a,b){return a.arrivalTime - b.arrivalTime});

    while (newList.length !== 0 || queueList.length !== 0) {
      let nextProcess;

      function findQ(list) {
        while (list.length !== 0 && list[0].arrivalTime <= total) {
          queueList.push(list.shift());
        }
        nextProcess = list.length > 0 ? list[0].arrivalTime : undefined;
      }
  
      findQ(newList);
  
      if (queueList.length === 0 && newList.length > 0) {
        total = newList[0].arrivalTime;
        timelineList.push({
          time: total, 
          value: 'idle',
        });
      }else {
        while(queueList.length!=0){
            queueList.sort(function (a, b) {return a.priority - b.priority;});

            let temp = {...queueList[0]};


            if(nextProcess!=undefined){
              for(let x=total; x<nextProcess; x++){
                total += 1;
                temp.cpuBurst -= 1;
              }
            }else{
              total += temp.cpuBurst;
              temp.cpuBurst = 0
            }
            queueList.shift();
            timelineList.push({
                time: total,
                value: temp.id
            })
            findQ(newList);

            if(temp.cpuBurst > 0){
                queueList.push(temp);
            }else{
                let process = processes.find((data)=>{
                    return data.id == temp.id;
                })
                const endTime = total - 1;
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
  
    return schedulingData;
  }

  const Declare = () =>{
    const A = new Process(1, 0 , 8, 2)
    const B = new Process(2, 3, 4, 3)
    const C = new Process(3, 4, 5, 1)
    const D = new Process(4, 6, 3, 5)
    const E = new Process(5, 10, 2, 4)


    let processList  = [A,B,C,D,E];

    const timeline = calculateScheduling(processList)
    timeline.sort((a, b) => a.process.id - b.process.id);

    timeline.map((data)=>{
        show(data);
        // console.log(data.value, data.time);
    })
}

export {Declare, calculateScheduling};