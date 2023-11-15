class Process:
    def __init__(self, id, arrive_time, burst, priority, QL):
        self.id = id
        self.QL = QL
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

gantt = []



def sjf(p, currt):
    global gantt
    curr_time = currt
    min_index = 0
    i = 0
    idle = 0
    while i < len(p):
        min_index = None
        if p[i].arrive_time > curr_time:
            p.insert(i, Process(-1, curr_time, p[i].arrive_time-curr_time))
            idle+=1

        for j in range(0, len(p)):
            if not p[j].completed:
                if p[j].arrive_time <= curr_time:
                    if min_index is None or p[j].burst < p[min_index].burst:
                        min_index = j

        if min_index is not None:
            p[min_index].waiting_time = curr_time - p[min_index].arrive_time
            p[min_index].completed = True
            curr_time += p[min_index].burst
            p[min_index].return_time = curr_time
            p[min_index].response_time = p[min_index].waiting_time
            p[min_index].turnaround_time = p[min_index].return_time - p[min_index].arrive_time
            gantt.append(p[min_index])
            break
        i+=1
    return curr_time

def fcfs(p, currt):
    total_return_time = currt
    i = 0
    while i < len(p):
        p[i].completed = True
        p[i].waiting_time = total_return_time - p[i].arrive_time
        p[i].return_time = total_return_time + p[i].burst
        p[i].turnaround_time = p[i].return_time - p[i].arrive_time
        total_return_time += p[i].burst
        gantt.append(p[i])
        i+=1
    return total_return_time

def srtf(p, currt, stop):
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
                queue[-1].burst = current_time - lastTime
                lastTime = current_time

            id = p[k].id
            queue.append(tempProcess(id))
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

        for i in range(len(p)):
            if p[i].completed == True:
                finished+=1
    
    queue[-1].return_time = current_time
    queue[-1].burst = current_time - lastTime
    if not final:
        gantt.append(queue[-1])
    return current_time

def pps(p, currt, stop):
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
                queue[-1].burst = current_time - lastTime

                lastTime = current_time

            id = p[k].id
            queue.append(tempProcess(id))
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

        for i in range(len(p)):
            if p[i].completed == True:
                finished+=1
    
    queue[-1].return_time = current_time
    queue[-1].burst = current_time - lastTime
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

def npps(p, currt):
    cpy = p[:]
    cpy = sorted(cpy, key=lambda x: (x.priority, x.arrive_time, x.burst))
    global gantt
    time = currt

    while True:
        check = False
        i = 0
        idx = 0
        while i < len(cpy):
            if (len(cpy) != 0):
                del cpy[i]
                idx = i
                check = True
            else:
                i+=1

        if not check:
            break
        
        p[idx].response_time = time - p[idx].arrive_time
        p[idx].return_time = time + p[idx].burst
        p[idx].turnaround_time = p[idx].return_time - p[idx].arrive_time
        p[idx].waiting_time = time - p[idx].arrive_time
        p[idx].completed = True
        gantt.append(p[idx])
        time += p[idx].burst
        break
    return time

def print_gantt_chart():
    global gantt
    p = gantt[:]
    leng = len(gantt)
    print("Gantt Chart (idle time = -1)")
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

        if (p[i].id < 10):
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
    print("  PID  AT   BT   P   QL   QT   ET   TAT   WT")

    for i in range(n):
        print("{:3d}  {:3d}  {:3d}  {:3d}  {:3d}  {:3d}  {:3d}  {:3d}  {:3d}".format(
            p[i].id, p[i].arrive_time, p[i].burst, p[i].priority, p[i].QL, ts[(p[i].QL-1)], p[i].return_time, p[i].turnaround_time, p[i].waiting_time))
    print("\n", end="")


#-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

def preempt(p, ts, ql, currtime, stop):
    if ql == 4:
        newTime = rr(p, ts, currtime, stop)
    elif ql == 5:
        newTime = pps(p, currtime, stop)
    elif ql == 6:
        newTime = srtf(p, currtime, stop)
    return newTime

def nonpreempt(p, ql, currtime):
    if ql == 1:
        newTime = fcfs(p, currtime)
    elif ql == 2:
        newTime = sjf(p, currtime)
    elif ql == 3:
        newTime = npps(p, currtime)
    return newTime

def mlq_calculate(processes, ts, ql):
    global gantt
    current_time = 0
    total_burst_time = 0
    nextarrive = 0
    break_time = 0
    to_be_processed = []

    for process in processes:
        total_burst_time += process.burst

    while current_time < total_burst_time:
        qlevel = float('inf')
        idle = True

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
        
        if not idle:
            for i in range(len(processes)):
                if not processes[i].completed and processes[i].arrive_time <= current_time and processes[i].QL == qlevel:
                    to_be_processed.append(processes[i])

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
                current_time = nonpreempt(to_be_processed, ql[qlevel-1], current_time)
            elif ql[qlevel-1] >= 4 and ql[qlevel-1] <= 6:
                current_time = preempt(to_be_processed, ts[qlevel-1], ql[qlevel-1], current_time, break_time)
            to_be_processed.clear()
        else:
            gantt.append(idleProcess(-1, current_time, processes[nextarrive].arrive_time - current_time, processes[nextarrive].arrive_time))
            total_burst_time += processes[nextarrive].arrive_time - current_time
            current_time += processes[nextarrive].arrive_time - current_time


def MLQ(p, leng, ts, ql):
    total_waiting_time = 0
    total_turnaround_time = 0
    total_return_time = 0
    total_response_time = 0

    p = sorted(p, key=lambda p: (p.arrive_time, p.QL, p.burst, p.id))
    mlq_calculate(p, ts, ql)

    final_return_time = 0
    for i in range(leng):
        if final_return_time < p[i].return_time:
            final_return_time = p[i].return_time
        total_waiting_time += p[i].waiting_time
        total_turnaround_time += p[i].turnaround_time
        total_response_time += p[i].response_time
        total_return_time += p[i].burst

    print_gantt_chart()
    p.sort(key=lambda x: x.id)
    print_table(p, leng, ts)
    print("ATAT: {:0.2f} ms".format(total_turnaround_time / leng))
    print("AWT: {:0.2f} ms".format(total_waiting_time / leng))
    print("CPU Util.: {:0.2f}%".format((total_return_time / final_return_time)*100))


def main():
    process = []
    timeslice = []
    queue_levels = []
    try:
        ts = 0
        print("\n\nMLQ Scheduling\n")
        queue_number = int(input("How many queue levels?: "))
        process_count = int(input("How many processes?: "))
        print("Which algorithms to use?:\n1 - FCFS\n2 - SJF\n3 - PNP\n4 - RR\n5 - PB\n6 - SRTF\n")
        for j in range(queue_number):
            selection = 7
            while selection > 6:
                selection = int(input(f"What is the algorithm for level {j+1}?: "))
                if selection > 6:
                    print("There are only six algorithms.")
            queue_levels.append(selection)
            if selection == 4:
                ts = 0
                while ts == 0:
                    ts = int(input(f"What is the time slice for level {j+1}?: "))
                    if ts == 0:
                        print("Time slice must not be 0.")
                    else:
                        timeslice.append(ts)
            else:
                timeslice.append(0)
        
        print()
        for i in range(process_count):
            id = i+1
            arrive_time = int(input(f"\nProcess {id} - Arrival Time: "))
            burst = int(input(f"Process {id} - Burst Time: "))
            priority = int(input(f"Process {id} - Priority: "))
            ql = queue_number + 1
            while ql > queue_number:
                ql = int(input(f"Process {id} - Queue Level: "))
                if ql > queue_number:
                    print(f"\nThere are only {queue_number} queue levels.")
            process.append(Process(id, arrive_time, burst, priority, ql))
        if process_count != 0:
            MLQ(process, process_count, timeslice, queue_levels)
    except:
        print("Only integers allowed.")
        
if __name__ == "__main__":
    main()