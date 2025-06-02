import React, {useEffect, useState} from 'react';
import {AgentAll} from "@/lib/types";

type ShowTunnelsProps = {
    row: AgentAll,
    onClose: ()=>void
}

const ShowTunnels = ({row, onClose}:ShowTunnelsProps) => {
    const api = process.env.NEXT_PUBLIC_API_BASE;
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