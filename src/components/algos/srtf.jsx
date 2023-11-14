function calculateScheduling(processes) {
    const n = processes.length;
    const remainingTime = new Array(n).fill(0);
    const completed = new Array(n).fill(false);
    let schedulingData = [];
    let timelineList = [];
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
        } else {
            if (timelineList.length === 0 || timelineList[timelineList.length - 1].value !== processes[minIndex].id) {
                timelineList.push({
                    time: currentTime,
                    value: 'idle'
                });  
                timelineList.push({
                    time: currentTime + 1,
                    value: processes[minIndex].id,
                });
            } else {
                timelineList[timelineList.length - 1] = {
                    time: currentTime + 1,
                    value: processes[minIndex].id,
                };
            }
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

    return {schedulingData, timelineList};
}

export { calculateScheduling };
