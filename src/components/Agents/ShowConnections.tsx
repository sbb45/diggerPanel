import React, {useEffect, useState} from 'react';
import {AgentAll} from "@/lib/types";
import {useUI} from "@/components/UI/UIProvider";
import Table from "@/components/UI/Table";
import {TableActions} from "@/app/admin/page.styled";
import SyncButton from "@/components/Agents/SyncButton";
import PauseButton from "@/components/Agents/PauseButton";
import OptionsButton from "@/components/Agents/OptionsButton";

type EditAgentModalProps ={
    row: AgentAll,
    onClose: ()=>void
}

const columns = [
    {key:'Created', label:'Created'},
    {key:'Src', label:'Src'},
    {key:'Dst', label:'Dst'},
    {key:'Debug', label:'Debug'},
    {key:'Digger', label:'Digger'},
    {key:'Username', label:'Username'},
    {key:'Real', label:'Real'},
    {key:'Errors', label:'Errors'},
    {key:'actions', label:''},
]

const ShowConnections = ({row, onClose}:EditAgentModalProps) => {
    const api = process.env.NEXT_PUBLIC_API_BASE
    const {addToast,closeModal} = useUI();
    const [connections, setConnections] = useState([]);

    const buttons = () => (
        <TableActions>
            <SyncButton row={row} />
            <PauseButton row={row} />
            <OptionsButton row={row} />
        </TableActions>
    )

    useEffect(() => {
        fetch(`${api}/api/v1/agents/${row.Id}/remote/connections`)
            .then(res=>res.json())
            .then(setConnections)
        console.log(connections)
    }, []);


    return (
        <div className={"modal"}>
            <div className="content" style={{margin:'30px 0'}}>
                <Table columns={columns} data={connections} buttons={buttons}  />
            </div>
        </div>
    );
};

export default ShowConnections;