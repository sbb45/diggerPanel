import React, {useEffect, useState} from 'react';
import {AgentAll} from "@/lib/types";
import {api} from "@/lib/const";

type ShowTunnelsProps = {
    row: AgentAll,
    onClose: ()=>void
}

const ShowTunnels = ({row, onClose}:ShowTunnelsProps) => {
    const [tunnels, setTunnels] = useState()

    const fetchTunnels = async ()=>{
        try{
            const res = await fetch(`${api}/api/v1/agents/${row.Id}/remote/tunnels`,{
                credentials: 'include'
            })
            if(!res.ok){ throw new Error(await res.text())}

        }catch (err){

        }
    }
    useEffect(() => {
        fetchTunnels()
    }, []);

    return (
        <div>
            
        </div>
    );
};

export default ShowTunnels;