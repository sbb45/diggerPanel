import React, {useCallback, useEffect, useState} from 'react';
import {AgentAll} from "@/lib/types";
import {useUI} from "@/components/UI/UIProvider";
import Table from "@/components/UI/Table";
import {TableActions} from "@/app/page.styled";
import {TableBtn} from "@/app/page.styled";
import Image from "next/image";
import WorkerStatisticsModal from "@/components/Agents/WorkerStatisticsModal";
import {api} from "@/lib/const";

type EditAgentModalProps ={
    row: AgentAll,
    onClose: ()=>void
}

interface RemoteConnection {
    Created: string;
    SrcAddress: string;
    DstAddress: string;
    Digger: boolean;
    Filter: {
        Debug: string;
    };
    Extra: {
        Username: string;
        ErrorsCount: number;
        AcceptedSubmitsCount: number;
        LegalSubmitsCount: number;
        IllegalSubmitsCount: number;
    };
    Key: string;
}

interface TableConnectionRow {
    Created: string;
    Src: string;
    Dst: string;
    Debug: string;
    Digger: string;
    Username: string;
    Ratio: string;
    Errors: number;
    Id: number;
    Item: RemoteConnection;
}


const columns = [
    {key:'Created', label:'Created'},
    {key:'Src', label:'Src'},
    {key:'Dst', label:'Dst'},
    {key:'Debug', label:'Debug'},
    {key:'Digger', label:'Digger'},
    {key:'Username', label:'Username'},
    {key:'Ratio', label:'Ratio'},
    {key:'Errors', label:'Errors'},
    {key:'actions', label:''},
]

const ShowConnections = ({row, onClose}:EditAgentModalProps) => {
    const {addToast,openModal} = useUI();
    const [connections, setConnections] = useState([]);

    const buttons = (row: TableConnectionRow) => (
        <TableActions>
            <TableBtn
                title={'Show Statistics'}
                onClick={() =>
                    openModal(
                        <WorkerStatisticsModal
                            agentId={row.Id}
                            username={row.Item.Extra?.Username ?? ''}
                        />
                    )
                }
                disabled={!row.Item?.Digger}
            >
                <Image src={`/admin/icons/filter.svg`} alt={'filter'} width={28} height={28} />
            </TableBtn>

            <TableBtn
                title={'Download'}
                onClick={() =>
                    window.open(
                        `${api}api/v1/agents/${row.Id}/command/connection-debug/${row.Item.Key}`,
                        '_blank'
                    )
                }
                disabled={!row.Item?.Filter?.Debug}
            >
                <Image src={`/admin/icons/download.svg`} alt={'download'} width={28} height={28} />
            </TableBtn>

            <TableBtn
                title="Close connection"
                onClick={() => closeConnection(row.Id, row.Item.Key)}
            >
                <Image src={`/admin/icons/close.svg`} alt={'close'} width={28} height={28} />
            </TableBtn>
        </TableActions>
    );


    const fetchConnections = useCallback(async () => {
        try {
            const res = await fetch(`${api}api/v1/agents/${row.Id}/remote/connections`, {
                credentials: 'include'
            });
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Show connections error');
            }

            const data = await res.json();
            const connections = data.map((item: RemoteConnection) => {
                const legal = item.Extra?.LegalSubmitsCount ?? 0;
                const illegal = item.Extra?.IllegalSubmitsCount ?? 0;

                const realRatio = legal > 0 ? ((illegal / legal) * 100).toFixed(2) : '0.00';

                return {
                    Created: new Date(item.Created).toLocaleString(),
                    Src: item.SrcAddress,
                    Dst: item.DstAddress,
                    Debug: item.Filter?.Debug ?? '',
                    Digger: item.Digger ? 'Yes' : '',
                    Username: item.Extra?.Username ?? '',
                    Ratio: `${realRatio}%`,
                    Errors: item.Extra?.ErrorsCount ?? 0,
                    Id: row.Id,
                    Item: item,
                };
            });
            setConnections(connections)
        } catch (err) {
            addToast({
                type: 'danger',
                title: 'Connections error',
                message: err instanceof Error ? err.message : 'Failed to fetch connections'
            });
            onClose()
        }
    }, [addToast, onClose, row.Id]);
    useEffect(() => {
        fetchConnections();
    }, [fetchConnections]);

    async function closeConnection(agentId: number, key: string) {
        try{
            const res = await fetch(`${api}api/v1/agents/${agentId}/command/connection-close/${key}`, {
                method: 'POST',
                credentials: 'include'
            });
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Connection closure error');
            }
            fetchConnections();
            addToast({
                type: 'success',
                title: 'Connections success',
                message: 'Connection closed'
            });
        }catch(err){
            addToast({
                type: 'danger',
                title: 'Connections error',
                message: err instanceof Error ? err.message : 'Connection closure error'
            });
        }
    }


    return (
        <div className={"modal"}>
            <div className="content" style={{margin:'30px 0', width:'100%'}}>
                <Table columns={columns} data={connections} buttons={buttons} style={{minWidth:"1300px", margin:'0 40px'}} />
            </div>
        </div>
    );
};

export default ShowConnections;