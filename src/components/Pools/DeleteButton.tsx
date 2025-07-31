import React, {useState} from 'react';
import Image from "next/image";
import {TableBtn} from "@/app/page.styled";
import {Pools} from "@/lib/types";
import {useUI} from "@/components/UI/UIProvider";
import {api} from "@/lib/const";

type SwitchButtonProps ={
    row: Pools,
    fetchPools: ()=>void
}

const DeleteButton = ({row, fetchPools}: SwitchButtonProps) => {
    const [loading, setLoading] = useState(false)
    const {addToast} = useUI();

    async function switchPoolsAction(){
        setLoading(true)
        try {
            const res = await fetch(`${api}api/v1/pools/${row.Id}`,{
                method:'DELETE',
                credentials: 'include'
            })
            if(!res.ok) { throw new Error(await res.text())}
            addToast({
                type: "success",
                title: 'Pool is deleted',
                message: 'Pool successfully deleted',
            })

            fetchPools()
        }catch (err){
            addToast({
                type: "danger",
                title: 'Pool deletion error',
                message: err instanceof Error ? err.message : 'Unknown error',
            })
        }finally {
            setLoading(false)
        }
    }

    return (
        <TableBtn disabled={loading} onClick={() => switchPoolsAction()} title={'Delete pool'}>
            <Image src={`/admin/icons/trash.svg`} alt={'trash'} width={28} height={28}/>
        </TableBtn>
    );
};

export default DeleteButton;