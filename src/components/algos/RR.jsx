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


function rr(processList, tq){
    let total = 0;
    let tlist = [];
    let qlist = [];
    let nlist  = [...processList];

    nlist.sort(function(a,b){return a.at - b.at});

    while(nlist.length != 0 || qlist.length!=0){
        function findQ(list){
            while(list.length != 0 && list[0].at <= total){
                qlist.push(nlist.shift());
            }
        }
        
        findQ(nlist);

        if(qlist.length == 0 && nlist.length > 0){
            total += nlist[0].at;
            tlist.push(new Timeline(total));
        }

        else{
            while(qlist.length != 0){
                total += (qlist[0].bt >= tq)?tq:qlist[0].bt;
                let temp = {...qlist[0]};
                temp.bt = Math.max(temp.bt-tq, 0);
                qlist.shift();
                tlist.push(new Timeline(total, temp.processID));
                findQ(nlist);

                if(temp.bt > 0){
                    qlist.push(temp);
                }else{
                    solve(processList, temp, total)
                }
            }
        }

    }
    return tlist;
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

    const timeline = rr(processList, 3)

    processList.map((data)=>{
        // console.log(data.value, data.time);
        show(data)
    })
}