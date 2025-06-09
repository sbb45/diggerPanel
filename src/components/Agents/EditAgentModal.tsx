import React, {useState} from 'react';
import {AgentAll} from "@/lib/types";
import Dropdown from "@/components/UI/Dropdown";
import Input from "@/components/UI/Input";
import {useUI} from "@/components/UI/UIProvider";
import {api} from "@/lib/const";

type EditAgentModalProps ={
    row: AgentAll,
    onClose: ()=>void,
    onSuccess: () => void;
}

const stateOptions = [
    {value: 'true', label: 'Enabled'},
    {value: 'false', label: 'Disabled'},
]
const modeOptions = [
    {value: "0", label:"Manual"},
    {value: "1", label:"Transparent"},
    {value: "2", label:"FeeBlockOnly"},
    {value: "3", label:"StaticPercent"},
    {value: "4", label:"FeeBlockAndStaticPercent"},
]

const EditAgentModal = ({row, onClose, onSuccess }:EditAgentModalProps) => {
    const {addToast,closeModal} = useUI();
    const [state, setState] = useState(
        stateOptions.find(opt => opt.value === String(row.State)) || stateOptions[0]
    );
    const [note, setNote] = useState(row.Note);
    const [group, setGroup] = useState(row.Group);
    const [mode, setMode] = useState(
        modeOptions.find(opt => opt.value === String(row.Mode)) || stateOptions[0]
    );
    const [percent, setPercent] = useState(row.Percent);

    async function sendAgent(){
        try{
            const res = await fetch(`${api}api/v1/agents/${row.Id}`,{
                method: 'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    Id: row.Id,
                    Note: note,
                    Group: group,
                    State: state.value === 'true',
                    Mode: Number(mode.value),
                    Percent: Number(percent)
                })
            })
            if(!res.ok){
                const errorText = await res.text()
                throw new Error(errorText || 'Unknown error')
            }
            addToast({
                type:'success',
                title:'Successfully modified',
                message:'The agent has been successfully modified'
            })
            onSuccess()
        }catch (err){
            addToast({
                type:'danger',
                title:'Edit error',
                message: err instanceof Error ? err.message : 'Unknown error'
            })
        }finally {
            closeModal()
        }
    }

    return (
        <div className={"modal"}>
            <div className="content" style={{margin:'30px 0'}}>
                <Dropdown options={stateOptions} value={state} onChange={setState} label="State" style={{width:"100%"}} />
                <Input label={'Note'} value={String(note)} onChange={setNote} />
                <Input label={'Group'} value={String(group)} onChange={setGroup} />
                <Dropdown options={modeOptions} value={mode} onChange={setMode} label="Mode" style={{width:"100%"}} />
                <Input label={'Percent'} value={String(percent)} onChange={setPercent} />
            </div>
            <div className="btns">
                <button onClick={onClose} className="cancel">Cancel</button>
                <button className={'success'} onClick={sendAgent}>
                    Save
                </button>
            </div>
        </div>
    );
};

export default EditAgentModal;