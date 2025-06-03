import React, {useEffect, useState} from "react";
import Input from "@/components/UI/Input";
import { useUI } from "@/components/UI/UIProvider";
import Dropdown from "@/components/UI/Dropdown";

type ConfigType = {
    TypeLog: string;
    CommandTimeoutSec: number;
    StaleLiveMin: number;
    MaxUserExclusionCount: number;
    CountersTimeoutHours: number;
    AutoSyncConnectionCount: number;
    IntervalSyncConnections: number;
    IntervalSyncStatistics: number;
    IntervalSyncRates: number;
    CustomFirmwares: string[];
};
type Props ={
    onClose: ()=>void
}


const AdminOptions = ({onClose }:Props ) => {
    const {addToast } = useUI();
    const [config, setConfig] = useState<ConfigType | null>(null);

    useEffect(() => {
        async function fetchConfig() {
            try {
                const res = await fetch(`/api/v1/config`);
                if (!res.ok) throw new Error( await res.text());
                const data = await res.json();
                setConfig(data);
            } catch (err) {
                addToast({ type: "danger", title:"Error config", message: err instanceof Error ? err.message : 'Unknown error' });
            }
        }
        fetchConfig();
    }, [addToast]);

    const setField = (field: keyof ConfigType, value: string) => {
        setConfig(prev => prev ? { ...prev, [field]: value } : prev);
    };

    const saveConfig = async () => {
        try {
            const res = await fetch(`/api/v1/config`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(config),
            });
            if (!res.ok) throw new Error("Failed to save config");
            addToast({ type: "success",title:"Config save", message: "Config saved successfully" });
        } catch (err) {
            addToast({ type: "danger", title:"Error save config", message: err instanceof Error ? err.message : 'Unknown error' });
        }
    };


    return (
        <div className="modal">
            <div className="content" style={{ margin: '30px 40px', display:"flex", flexDirection:'row',alignItems:"start", gap:"60px", width:"100%" }}>
                <span style={{width:"250px"}}>
                    <Input label="Log level" value={config?.TypeLog ?? ""} onChange={val => setField("TypeLog", val)} />
                    <Input label="Command Timeout Sec" value={config?.CommandTimeoutSec ?? ""} onChange={val => setField("CommandTimeoutSec", val)} />
                    <Input label="Stale Live Min" value={config?.StaleLiveMin ?? ""} onChange={val => setField("StaleLiveMin", val)} />
                    <Input label="Max User Exclusion Count" value={config?.MaxUserExclusionCount ?? ""} onChange={val => setField("MaxUserExclusionCount", val)} />
                    <Input label="Counters Timeout Hours" value={config?.CountersTimeoutHours ?? ""} onChange={val => setField("CountersTimeoutHours", val)} />
                </span>
                <span style={{width:"250px"}}>
                    <Input label="AutoSyncConnectionCount" value={config?.AutoSyncConnectionCount ?? ""} onChange={val => setField("AutoSyncConnectionCount", val)} />
                    <Input label="IntervalSyncConnections" value={config?.IntervalSyncConnections ?? ""} onChange={val => setField("IntervalSyncConnections", val)} />
                    <Input label="IntervalSyncStatistics" value={config?.IntervalSyncStatistics ?? ""} onChange={val => setField("IntervalSyncStatistics", val)} />
                    <Input label="IntervalSyncRates" value={config?.IntervalSyncRates ?? ""} onChange={val => setField("IntervalSyncRates", val)} />
                    <Input label="Counters" value={config?.CountersTimeoutHours ?? ""} onChange={val => setField("CountersTimeoutHours", val)} />
                </span>
            </div>
            <div className="btns">
                <button onClick={onClose} className="cancel">Cancel</button>
                <button onClick={saveConfig} className="success">Save</button>
            </div>
        </div>
    );
};

export default AdminOptions;
