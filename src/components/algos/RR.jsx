function calculateScheduling(processes,tq) {
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

                total += (queueList[0].cpuBurst >= tq)?tq:queueList[0].cpuBurst;
                let temp = {...queueList[0]};
                temp.cpuBurst = Math.max(temp.cpuBurst-tq, 0);
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
                    const endTime = total;
                    const turnaroundTime = endTime - temp.arrivalTime;
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
        
      return {schedulingData, timelineList};
    }
    
export { calculateScheduling };  