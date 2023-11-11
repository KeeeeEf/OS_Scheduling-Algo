import { Declare } from "./algos/SJF"
import { useEffect } from "react"

export const Result = () =>{

    useEffect(()=>{
        Declare();
    },[]);
    
    return(
        <div>
            <h1>Algo Name</h1>

        </div>
    )
}