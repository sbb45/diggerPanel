import React, {useState} from 'react';
import Image from "next/image";
import {TableBtn} from "@/app/page.styled";
import {useUI} from "@/components/UI/UIProvider";
import {AgentButtonProps} from "@/lib/types";
import {api} from "@/lib/const";


const SyncButton: React.FC<AgentButtonProps> = ({row}:AgentButtonProps) => {
    const [loading, setLoading] = useState(false)
    const {addToast} = useUI();

    const syncAgentAction = async () =>{
        const agentId = row.Id
        try {
            setLoading(true)
            const res = await fetch(`${api}api/v1/agents/${agentId}/command/sync`,{
                method:'POST',
                credentials: "include",
            })
            if(!res.ok){
                const text = await res.text()
                addToast({
                    type: 'danger',
                    title: "Sync failed",
                    message: text
                })
            }
            addToast({
                type: 'success',
                title: "Sync successful",
                message: "Sync synchronized successfully"
            })
        }catch(err){
            addToast({
                type: 'danger',
                title: "Sync failed",
                message: err instanceof Error ? err.message : 'Unknown error'
            })
        } finally {
          setLoading(false)
        }
    }
    return (
        <TableBtn disabled={!row.Online || loading} onClick={() => syncAgentAction()} title={'Синхронизировать'}>
            <Image src={'/admin/icons/refresh.svg'} alt={'refresh'} width={28} height={28}/>
        </TableBtn>
    );
};

export default SyncButton;