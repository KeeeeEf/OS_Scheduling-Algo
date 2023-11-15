class Process:
    def __init__(self, id, arrive_time, burst, priority):
        self.id = id
        self.QL = 1
        self.arrive_time = arrive_time
        self.waiting_time = 0
        self.return_time = 0
        self.turnaround_time = 0
        self.response_time = 0
        self.burst = burst
        self.burst_remain = burst
        self.priority = priority
        self.completed = False

class idleProcess:
    def __init__(self, id, arrive_time, burst, return_time):
        self.id = id
        self.arrive_time = arrive_time
        self.return_time = return_time
        self.burst = burst
    
class tempProcess:
    def __init__(self, id):
        self.id = id
        self.return_time = 0
        self.burst = 0
        self.burst_remain = self.burst
        self.return_time = 0
        self.completed = False

class tempProcessRR:
    def __init__(self, idx,  id, arrive_time, burst, burst_remain):
        self.id = id
        self.idx = idx
        self.arrive_time = arrive_time
        self.burst = burst
        self.return_time = 0
        self.burst_remain = burst_remain
        self.completed = False

ql1 = []
ql2 = []
ql3 = []
ql4 = []
ql5 = []
ql6 = []
multigantt = [ql1, ql2,ql3,ql4,ql5,ql6]
gantt = []

def sjf(p, currt, final):
    global gantt
    curr_time = currt
    min_index = 0
    i = 0
    idle = 0
    while i < len(p):
        min_index = None

        for j in range(0, len(p)):
            if not p[j].completed:
                if p[j].arrive_time <= curr_time:
                    if min_index is None or p[j].burst < p[min_index].burst:
                        min_index = j

        if min_index is not None:
            p[min_index].waiting_time = curr_time - p[min_index].arrive_time
            p[min_index].completed = True
            curr_time += p[min_index].burst_remain
            p[min_index].return_time = curr_time
            p[min_index].response_time = p[min_index].waiting_time
            p[min_index].turnaround_time = p[min_index].return_time - p[min_index].arrive_time
            gantt.append(p[min_index])
            if not final:
                break
        i+=1
    return curr_time

def fcfs(p, currt):
    total_return_time = currt
    i = 0
    while i < len(p):
        p[i].completed = True
        p[i].waiting_time = total_return_time - p[i].arrive_time
        p[i].return_time = total_return_time + p[i].burst_remain
        p[i].turnaround_time = p[i].return_time - p[i].arrive_time
        total_return_time += p[i].burst_remain
        gantt.append(p[i])
        i+=1
    return total_return_time

def srtf(p, currt, stop, fnl):
    global gantt
    current_time = currt
    total_burst_time = stop
    k = 0
    queue = []

    count = [0 for _ in range(len(p))]

    currID = 0
    lastTime = currt
    final = False
    finished = 0
    while (current_time < total_burst_time) and finished != len(p):
        burst = float('inf')
        final = False
        finished = 0
        
        if current_time <= p[-1].arrive_time:
            for i in range(len(p)):
                if not p[i].completed and p[i].arrive_time <= current_time and burst > p[i].burst_remain:
                    burst = p[i].burst_remain
                    k = i
        else:
            for i in range(len(p)):
                if not p[i].completed and burst > p[i].burst_remain:
                    burst = p[i].burst_remain
                    k = i

        if count[k] == 0:
            count[k] += 1
            p[k].response_time = current_time

        if (p[k].id != currID):
            if (len(queue) != 0):
                queue[-1].return_time = current_time
                queue[-1].burst_remain = current_time - lastTime
                lastTime = current_time

            id = p[k].id
            queue.append(tempProcess(id))
            queue[-1].burst = p[k].burst
            currID = p[k].id

        p[k].burst_remain -= 1
        current_time += 1

        if p[k].burst_remain == 0:
            p[k].completed = True
            p[k].return_time = current_time
            p[k].turnaround_time = p[k].return_time - p[k].arrive_time
            p[k].waiting_time = current_time - p[k].burst - p[k].arrive_time
            gantt.append(p[k])
            final = True
            if not fnl:
                break

        for i in range(len(p)):
            if p[i].completed == True:
                finished+=1
    
    queue[-1].return_time = current_time
    queue[-1].burst_remain = current_time - lastTime
    if not final:
        gantt.append(queue[-1])
    return current_time

def pps(p, currt, stop, fnl):
    global gantt
    current_time = currt
    total_burst_time = stop
    k = 0
    queue = []

    count = [0 for _ in range(len(p))]

    currID = 0
    final = False
    lastTime = currt
    finished = 0
    while (current_time < total_burst_time) and finished != len(p):
        priority = float('inf')
        final = False
        finished = 0
        
        if current_time <= p[-1].arrive_time:
            for i in range(len(p)):
                if not p[i].completed and p[i].arrive_time <= current_time and priority > p[i].priority:
                    priority = p[i].priority
                    k = i
        else:
            for i in range(len(p)):
                if not p[i].completed and priority > p[i].priority:
                    priority = p[i].priority
                    k = i

        if count[k] == 0:
            count[k] += 1
            p[k].response_time = current_time

        if (p[k].id != currID):
            if (len(queue) != 0):
                queue[-1].return_time = current_time
                queue[-1].burst_remain = current_time - lastTime

                lastTime = current_time

            id = p[k].id
            queue.append(tempProcess(id))
            queue[-1].burst = p[k].burst
            currID = p[k].id

        p[k].burst_remain -= 1
        current_time += 1

        if p[k].burst_remain == 0:
            p[k].completed = True
            p[k].return_time = current_time
            p[k].turnaround_time = p[k].return_time - p[k].arrive_time
            p[k].waiting_time = current_time - p[k].burst - p[k].arrive_time
            gantt.append(p[k])
            final = True
            if not fnl:
                break

        for i in range(len(p)):
            if p[i].completed == True:
                finished+=1
    
    queue[-1].return_time = current_time
    queue[-1].burst_remain = current_time - lastTime
    if not final:
        gantt.append(queue[-1])
    return current_time

def rr(p, ts, currt, stop):
    cpy = p[:]
    global gantt
    ini = len(gantt)
    queue = gantt
    temp = []
    time = currt
    

    subt = ts if cpy[0].burst_remain > ts else cpy[0].burst_remain
    queue.append(tempProcessRR(0, cpy[0].id, cpy[0].arrive_time, subt, cpy[0].burst_remain))
    temp.append(tempProcessRR(0, cpy[0].id, cpy[0].arrive_time, subt, cpy[0].burst_remain))
    del cpy[0]
    num = 1
    while True or time >= stop:
        x = 0
        if len(temp) != 0:
            subt = ts if temp[0].burst_remain > ts else temp[0].burst_remain
            temp[0].burst_remain -= subt
            time += subt

        while x < len(cpy):
            if cpy[x].arrive_time <= time and cpy[x].burst_remain > 0:
                pbt = ts if cpy[x].burst_remain > ts else cpy[x].burst_remain
                temp.append(tempProcessRR(num, cpy[0].id, time, pbt, cpy[x].burst_remain))
                queue.append(tempProcessRR(num, cpy[0].id, time, pbt, cpy[x].burst_remain))
                del cpy[x]
                num += 1
            else:
                x += 1
                
        if temp[0].burst_remain > 0:
            subt = ts if temp[0].burst_remain > ts else temp[0].burst_remain
            temp.append(tempProcessRR(temp[0].idx, temp[0].id, temp[0].arrive_time, subt, temp[0].burst_remain))
            queue.append(tempProcessRR(temp[0].idx, temp[0].id, temp[0].arrive_time, subt, temp[0].burst_remain))
        else:
            queue[-1].completed = True

        del temp[0]

        if (len(temp) == 0 and len(cpy) == 0) :
            break

    i = ini
    time = currt
    while i < len(queue):
        time += queue[i].burst
        queue[i].return_time = time
        idx = queue[i].idx
        p[idx].completed = queue[-1].completed
        p[idx].response_time = time
        p[idx].return_time = time
        p[idx].turnaround_time = p[idx].response_time - p[idx].arrive_time
        p[idx].waiting_time = p[idx].turnaround_time - p[idx].burst
        i += 1

    return time

def default(p, ts, currt, stop, final):
    cpy = p[:]
    global gantt
    ini = len(gantt)
    queue = gantt
    temp = []
    time = currt
    

    subt = ts if cpy[0].burst_remain > ts else cpy[0].burst_remain
    queue.append(tempProcessRR(0, cpy[0].id, cpy[0].arrive_time, subt, cpy[0].burst_remain))
    temp.append(tempProcessRR(0, cpy[0].id, cpy[0].arrive_time, subt, cpy[0].burst_remain))
    del cpy[0]
    num = 1
    while True and time <= stop:
        x = 0
        if len(temp) != 0:
            subt = ts if temp[0].burst_remain > ts else temp[0].burst_remain
            temp[0].burst_remain -= subt
            p[temp[0].idx].burst_remain -= subt
            time += subt

        while x < len(cpy) and time <= stop:
            if cpy[x].arrive_time <= time and cpy[x].burst_remain > 0:
                pbt = ts if cpy[x].burst_remain > ts else cpy[x].burst_remain
                temp.append(tempProcessRR(num, cpy[0].id, time, pbt, cpy[x].burst_remain))
                queue.append(tempProcessRR(num, cpy[0].id, time, pbt, cpy[x].burst_remain))
                del cpy[x]
                num += 1
            else:
                x += 1
                
        if temp[0].burst_remain > 0 and final:
            subt = ts if temp[0].burst_remain > ts else temp[0].burst_remain
            temp.append(tempProcessRR(temp[0].idx, temp[0].id, temp[0].arrive_time, subt, temp[0].burst_remain))
            queue.append(tempProcessRR(temp[0].idx, temp[0].id, temp[0].arrive_time, subt, temp[0].burst_remain))
        else:
            if temp[0].burst_remain <= 0 :
                queue[-1].completed = True

        del temp[0]

        if (len(temp) == 0 and len(cpy) == 0) and not final:
            break

    i = ini
    time = currt
    while i < len(queue):
        time += queue[i].burst
        queue[i].return_time = time
        idx = queue[i].idx
        if (p[idx].burst_remain == 0):
            p[idx].completed = True
        p[idx].response_time = time
        p[idx].return_time = time
        p[idx].turnaround_time = p[idx].response_time - p[idx].arrive_time
        p[idx].waiting_time = p[idx].turnaround_time - p[idx].burst
        i += 1

    num = len(p) - len(cpy)
    for i in range(num, len(p)):
        p[i].QL -= 1

    return time

def npps(p, currt, final):
    p = sorted(p, key=lambda x: (x.priority, x.arrive_time, x.burst))
    global gantt
    time = currt

    idx = 0
    while idx < len(p):
        if (len(p) != 0):
            p[idx].response_time = time - p[idx].arrive_time
            p[idx].return_time = time + p[idx].burst_remain
            p[idx].turnaround_time = p[idx].return_time - p[idx].arrive_time
            p[idx].waiting_time = time - p[idx].arrive_time
            p[idx].completed = True
            gantt.append(p[idx])
            time += p[idx].burst_remain
            p[idx].burst_remain = 0
            idx+=1

    return time

def print_gantt_chart(p):
    leng = len(p)
    for i in range(leng):
        print("--", end='')
        for j in range(p[i].burst%15):
            print("--", end='')
        print("", end='')
    print("-", end='')

    print("\n|", end='')
    for i in range(leng):
        for j in range((p[i].burst-1)%15):
            print(" ", end='')

        if (p[i].id == None):
            print("-- ", end='')
        elif (p[i].id < 10):
            print(" "+"{: <2}".format(str(p[i].id)), end='')
        else:
            print(str(p[i].id)+" ", end='')

        for j in range((p[i].burst-1)%15):
            print(" ", end='')

        print("|", end='')

    print("\n", end='')

    for i in range(leng):
        print("--", end='')
        for j in range(p[i].burst%15):
            print("--", end='')

        print("", end='')
    print("-", end='')
    print("\n", end='')

    print("0", end='')

    for i in range(leng):
        for j in range(p[i].burst%15):
            print("  ", end='')

        if p[i].return_time > 9:
            print("\b", end='')

        print(" " + str(p[i].return_time), end='')

    print("\n")

def print_table(p, n, ts):
    print(" PID  AT  BT  P    ET    TAT    WT")
    for i in range(n):
        print("{:3d}  {:3d}  {:3d}  {:3d}  {:3d}  {:3d}  {:3d}".format(
            p[i].id, p[i].arrive_time, p[i].burst, p[i].priority, p[i].return_time, p[i].turnaround_time, p[i].waiting_time))
    print("\n", end="")


#-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

def preempt(p, ts, ql, currtime, stop, final):
    if ql == 4:
        newTime = rr(p, ts, currtime, stop)
    elif ql == 5:
        newTime = pps(p, currtime, stop, final)
    elif ql == 6:
        newTime = srtf(p, currtime, stop, final)
    return newTime

def nonpreempt(p, ql, currtime, final):
    if ql == 1:
        newTime = fcfs(p, currtime)
    elif ql == 2:
        newTime = sjf(p, currtime, final)
    elif ql == 3:
        newTime = npps(p, currtime, final)
    return newTime

def mlfq_calculate(processes, ts, ql):
    global gantt
    global multigantt
    lastidx = 0
    current_time = 0
    total_burst_time = 0
    nextarrive = 0
    break_time = 0
    to_be_processed = []

    for process in processes:
        total_burst_time += process.burst

    x = sum(p.completed for p in processes)
    while current_time < total_burst_time and x != len(processes):
        qlevel = float('inf')
        idle = True
        final = False

        if current_time <= processes[-1].arrive_time:
            for i in range(len(processes)):
                if not processes[i].completed and processes[i].arrive_time <= current_time and qlevel > processes[i].QL:
                    qlevel = processes[i].QL
                    idle = False
        else:
            for i in range(len(processes)):
                if not processes[i].completed and qlevel > processes[i].QL:
                    qlevel = processes[i].QL
                    idle = False

        x = sum(p.completed for p in processes)
        if not idle:
            for i in range(len(processes)):
                if not processes[i].completed and processes[i].arrive_time <= current_time and processes[i].QL == qlevel:
                    to_be_processed.append(processes[i])
                    processes[i].QL += 1
                    if (processes[i].QL > len(ql)):
                        final = True

            for i in range(len(processes)):
                if processes[i].arrive_time > current_time:
                    nextarrive = i
                    break
            
            x = sum(p.completed for p in processes)

            if processes[nextarrive].arrive_time > current_time:
                break_time = processes[nextarrive].arrive_time
            elif x == len(processes)-1:
                break_time = total_burst_time
            else:
                break_time = total_burst_time
            
            if ql[qlevel-1] >= 1 and ql[qlevel-1] <= 3:
                current_time = nonpreempt(to_be_processed, ql[qlevel-1], current_time, final)
            elif ql[qlevel-1] >= 4 and ql[qlevel-1] <= 6:
                current_time = preempt(to_be_processed, ts[qlevel-1], ql[qlevel-1], current_time, break_time, final)
            else:
                current_time = default(to_be_processed, ts[qlevel-1], current_time, break_time, final)
                
            to_be_processed.clear()
            
            for i in range(len(processes)):
                if (processes[i].QL > len(ql)):
                    processes[i].completed = True

            for i in range(len(ql)):
                if i == qlevel-1:
                    for j in range (lastidx, len(gantt)):
                        multigantt[i].append(gantt[j])
                        lastidx+=1
                else:
                    if (len(multigantt[i]) != 0) and multigantt[i][-1].id == None:
                        multigantt[i][-1].burst = current_time + multigantt[i][-1].arrive_time
                        multigantt[i][-1].return_time = current_time
                    else:
                        multigantt[i].append(idleProcess(None, current_time, gantt[-1].burst, current_time))
            
        else:
            gantt.append(idleProcess(-1, current_time, processes[nextarrive].arrive_time - current_time, processes[nextarrive].arrive_time))
            total_burst_time += processes[nextarrive].arrive_time - current_time
            current_time = processes[nextarrive].arrive_time



def MLFQ(p, leng, ts, ql):
    global gantt
    total_waiting_time = 0
    total_turnaround_time = 0
    total_return_time = 0
    total_response_time = 0

    p = sorted(p, key=lambda p: (p.arrive_time, p.QL, p.burst, p.id))
    mlfq_calculate(p, ts, ql)

    final_return_time = 0
    for i in range(leng):
        if final_return_time < p[i].return_time:
            final_return_time = p[i].return_time
        total_waiting_time += p[i].waiting_time
        total_turnaround_time += p[i].turnaround_time
        total_response_time += p[i].response_time
        total_return_time += p[i].burst

    print(f"\n")
    for i in range(len(ql)):
        print(f"Queue {i+1} - Gantt Chart")
        print_gantt_chart(multigantt[i])
        
    print("Summary (idle time = -1)")
    print_gantt_chart(gantt)
    p.sort(key=lambda x: x.id)
    print_table(p, leng, ts)
    print("CPU Util.: {:0.2f}%".format((total_return_time / final_return_time)*100))
    print("ATAT: {:0.2f}".format(total_turnaround_time / leng))
    print("AWT: {:0.2f}".format(total_waiting_time / leng))


def main():
    process = []
    timeslice = []
    queue_levels = []
    try:
        ts = 0
        print("MLFQ Scheduling\n")
        queue_number = int(input("How many queue levels?: "))
        process_count = int(input("How many processes?: "))
        for j in range(queue_number-1):
            queue_levels.append(-1)
            ts = 0
            while ts == 0:
                ts = int(input(f"What is the time slice for level {j+1}?: "))
                if ts == 0:
                    print("Time slice must not be 0.")
                else:
                    timeslice.append(ts)
        print("Which algorithms to use?:\n1 - FCFS\n2 - SJF\n3 - PNP\n4 - RR\n5 - PB\n6 - SRTF\n")
        while True:
            selection = int(input(f"What is the algorithm for level {j+2}?: "))
            if selection < 0 and selection > 7:
                print("There are only six algorithms.")
            else:
                if selection == 4:
                    ts = 0
                    while ts == 0:
                        ts = int(input(f"What is the time slice for level {j+1}?: "))
                        if ts == 0:
                            print("Time slice must not be 0.")
                        else:
                            timeslice.append(ts)
                break
        queue_levels.append(selection)

        print()
        for i in range(process_count):
            id = i+1
            arrive_time = int(input(f"\nProcess {id} - Arrival Time: "))
            burst = int(input(f"Process {id} - Burst Time: "))
            priority = int(input(f"Process {id} - Priority: "))
            process.append(Process(id, arrive_time, burst, priority))
        if process_count != 0:
            MLFQ(process, process_count, timeslice, queue_levels)
    except:
        print("Only integers allowed.")
        
if __name__ == "__main__":
    main()