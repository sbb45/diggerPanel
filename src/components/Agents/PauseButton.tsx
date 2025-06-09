import React, {useState} from 'react';
import {AgentButtonProps} from "@/lib/types";
import {useUI} from "@/components/UI/UIProvider";
import Image from "next/image";
import {TableBtn} from "@/app/admin/page.styled";
import {api} from "@/lib/const";


const PauseButton = ({row, fetchAgents}: AgentButtonProps) => {
    const [loading, setLoading] = useState(false)
    const action = row.Pause ? 'resume' : 'pause'
    const {addToast} = useUI();

    const togglePause = async ()=>{
        if(!row.Online || loading) return;
        setLoading(true)
        try {
            const res = await fetch(`${api}api/v1/agents/${row.Id}/command/${action}`,{
                method: 'POST',
                credentials: "include"
            })
            if(!res.ok){
                addToast({
                    type: "danger",
                    title: 'Pause error',
                    message: 'Can\'t pause'
                })
            }
            addToast({
                type: "success",
                title: 'Agent ' + action,
                message: 'Successfully ' + action
            })
            if (fetchAgents) {
                fetchAgents();
            }
        }catch (err){
            addToast({
                type: "danger",
                title: 'Pause error',
                message: err instanceof Error ? err.message : 'Unknown error'
            })
            console.error(err)
        }finally {
            setLoading(false)
        }
    }

    return (
        <TableBtn title={'Пауза'} onClick={togglePause} disabled={!row.Online || loading}>
            <Image src={`/icons/${action}.svg`} alt={action} width={28} height={28}/>
        </TableBtn>
    );
};

export default PauseButton;