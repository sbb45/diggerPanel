import React, {useState} from 'react';
import Image from "next/image";
import {TableBtn} from "@/app/admin/page.styled";
import {Pools} from "@/lib/types";
import {useUI} from "@/components/UI/UIProvider";
import {api} from "@/lib/const";

type SwitchButtonProps ={
    row: Pools,
    fetchPools: ()=>void
}

const SwitchButton = ({row, fetchPools}: SwitchButtonProps) => {
    const [loading, setLoading] = useState(false)
    const {addToast} = useUI();
    const currentState = row.State ? 'disabled' : 'play'

    async function switchPoolsAction(){
        setLoading(true)
        try {
            const res = await fetch(`${api}api/v1/pools/${row.Id}/state/${!row.State}`,{
                method:'POST',
                credentials: 'include'
            })
            if(!res.ok) { throw new Error(await res.text())}
            addToast({
                type: "success",
                title: 'Status changed',
                message: 'Status successfully changed',
            })

            fetchPools()
        }catch (err){
            addToast({
                type: "danger",
                title: 'Status change error',
                message: err instanceof Error ? err.message : 'Unknown error',
            })
        }finally {
            setLoading(false)
        }
    }

    return (
        <TableBtn disabled={loading} onClick={() => switchPoolsAction()} title={currentState}>
            <Image src={`/icons/${currentState}.svg`} alt={currentState} width={28} height={28}/>
        </TableBtn>
    );
};

export default SwitchButton;