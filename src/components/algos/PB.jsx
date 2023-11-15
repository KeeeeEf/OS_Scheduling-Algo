function calculateScheduling(processes){
    let total = 0;
    let timelineList = [];
    let queueList = [];
    let newList = [...processes];
    let schedulingData = [];

    newList.sort(function(a,b){return a.arrivalTime - b.arrivalTime});

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
            total = nextProcess
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
                    queueList.sort((a, b) => a.id.localeCompare(b.id));
                    
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

export {calculateScheduling};