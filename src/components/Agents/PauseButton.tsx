import React, {useState} from 'react';
import {AgentButtonProps} from "@/lib/types";
import {useUI} from "@/components/UI/UIProvider";
import Image from "next/image";
import {TableBtn} from "@/app/admin/page.styled";


const PauseButton = ({row, onUpdate}: AgentButtonProps) => {
    const [loading, setLoading] = useState(false)
    const api = process.env.NEXT_PUBLIC_API_BASE
    const action = row.Pause ? 'resume' : 'pause'
    const {addToast} = useUI();

    const togglePause = async ()=>{
        if(!row.Online || loading) return;
        setLoading(true)
        try {
            const res = await fetch(api+`/api/v1/agents/${row.Id}/command/${action}`,{
                method: 'POST'
            })
            if(!res.ok){
                addToast({
                    type: "danger",
                    title: 'Pause error',
                    message: 'Can\'t pause'
                })
            }
            const updateAgent = await res.json()
            if(onUpdate){
                onUpdate(updateAgent)
            }
        }catch (err){
            addToast({
                type: "danger",
                title: 'Pause error',
                message: err instanceof Error ? err.message : 'Unknown error'
            })
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