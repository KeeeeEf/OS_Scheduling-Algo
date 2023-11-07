class Process{
    constructor(processID, at, bt, ct=0, tt=0, wt=0){
        this.processID = processID;;
        this.at = at;
        this.bt = bt;
        this.ct = ct;
        this.tt = tt;
        this.wt = wt;
    }
}

class Timeline{
    constructor(time,value='idle'){
        this.time = time;
        this.value = value;
    }
}

function show(process) {
    console.log(process.processID, process.at, process.bt, process.ct, process.tt, process.wt);
}

function solve(processList, qlist, total){
    const pid = processList.find((data)=>{
        return data.processID == qlist.processID
    })

    pid.ct = total;
    pid.tt = pid.ct - pid.at
    pid.wt = pid.tt - pid.bt
}

function sjf(processList){
    let total = 0;
    let tlist = [];
    let qlist = [];
    let nlist = [...processList];

    nlist.sort(function(a,b){return a.at - b.at})

    while(nlist.length != 0 || qlist.length != 0){
        function findQ(list){
            while(list.length != 0 && list[0].at <= total){
                qlist.push(list.shift());
            }
        }

        findQ(nlist);

        if(qlist.length == 0 && nlist.length > 0){
            total += nlist[0].at;
            tlist.push(new Timeline(total));
        }else{
            qlist.sort(function(a,b){return a.bt-b.bt});
            while(qlist!=0){
                if(nlist.length>0 && total>=nlist[0].at){
                    break
                }

                total += qlist[0].bt;
                const temp = {...qlist[0]};
                tlist.push(new Timeline(total, temp.processID))
                solve(processList,qlist[0], total);
                qlist.shift();
            }
        }
    }
    return tlist
}

export const Declare = () =>{
    const A = new Process('A', 0 , 8)
    const B = new Process('B', 3, 4)
    const C = new Process('C', 4, 5)
    const D = new Process('D', 6, 3)
    const E = new Process('E', 10, 2)


    let processList  = []

    processList.push(A)
    processList.push(B)
    processList.push(C)
    processList.push(D)
    processList.push(E)

    const timeline = sjf(processList)

    processList.map((data)=>{
        // console.log(data.value, data.time);
        show(data)
    })
}
