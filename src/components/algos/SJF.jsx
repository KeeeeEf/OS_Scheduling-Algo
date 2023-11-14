function calculateScheduling(processes) {
    let total = 0;
    let schedulingData = [];
    let timelineList = [];
    let queueList = [];
    let newList = [...processes];
    
    newList.sort(function(a,b){return a.arrivalTime - b.arrivalTime})

    while(newList.length != 0 || queueList.length != 0){
        function findQ(list){
            while(list.length != 0 && list[0].arrivalTime <= total){
                queueList.push(list.shift());
            }
        }

        findQ(newList);

        if(queueList.length == 0 && newList.length > 0){
            total = newList[0].arrivalTime;
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
    
export { calculateScheduling };  