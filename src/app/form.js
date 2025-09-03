"use client";

import { useEffect, useState, useActionState } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPlus } from '@fortawesome/free-solid-svg-icons';

async function logout() {
    const logoutResp = await fetch('https://sla2.talkbank.org/logOutUser', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    const logoutStatus = await logoutResp.json();
    
    window.location.reload();
}

export default function Form( {submitForm} ) {
    const [state, formAction, isPending] = useActionState(submitForm, {});
    const [error, setError] = useState(undefined);
    const [resources, setResources] = useState([{ id: 0 }]);

    const addResource = () => {
        const newId = Math.max(...resources.map(r => r.id)) + 1;
        setResources([...resources, { id: newId }]);
    };

    const removeResource = (id) => {
        if (resources.length > 1) {
            setResources(resources.filter(resource => resource.id !== id));
        }
    };

    useEffect(() => {
        setError((new URLSearchParams(window.document.location.search)).get("error"));
    });

    return (
        <form action={formAction}>
            <label className="job-pane-row-left form-label" htmlFor="num_speakers">Task</label>
            <select className="job-pane-row-right form-select" type="number" name="command">
                <option value="asr" className="form-select-option">Transcription</option>
                <option value="morphosyntax" className="form-select-option">Morpho-Syntactic Analysis</option>
            </select> <br /> 


            <label className="job-pane-row-left form-label" htmlFor="lang">Language</label>
            <input className="job-pane-row-right form-text" autoCapitalize="none" type="text" name="lang" placeholder="3 letter ISO code here"  required/> <br />

            <label className="job-pane-row-left form-label" htmlFor="num_speakers">Speaker Count</label>
            <input className="job-pane-row-right form-text" type="number" name="num_speakers" placeholder="number here" required /> <br />
            <div  className="form-break">
                <hr />
            </div>


            <label className="job-pane-row-left form-label">Resources to Analyze</label> <br />
            {resources.map((resource, index) => (
                <div key={resource.id} style={{marginBottom: '10px', display: "flex"}}>
                    <input 
                        className="job-pane-row-right form-filedrop" 
                        type="file" 
                        name={`input_${resource.id}`} 
                        multiple 
                        required
                        style={{flexGrow: "1"}}
                    />
                    {resources.length > 1 && (
                        <button 
                            type="button" 
                            className="xbutton"
                            onClick={() => removeResource(resource.id)}
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    )}
                </div>
            ))}
            <button 
                type="button" 
                onClick={addResource}
                style={{
                    marginBottom: '10px',
                    transform: "translateX(-4px)",
                    color: "#575757"
                }}
            >
                <FontAwesomeIcon
                    icon={faPlus}
                    style={{marginRight: "4px"}}
                />
                <span style={{
                    display: "inline-block",
                    transform: "translateY(-1px)",
                    marginTop: 5
                }}>Add Another Resource</span>
            </button> <br />

            <div  className="form-break two">
                <hr />
            </div>
            {(error && error != "") ?
             <div>
                 <h1 className="error-header">Error</h1>
                 <span className="error-message">{JSON.parse(decodeURIComponent(error)).message}</span>
                 <div className="error-text">
                    {JSON.parse(decodeURIComponent(error)).payload}
                 </div>

             </div> : <></>}

            <input className="submit" type="submit" value="Submit" />
            <a className="float-right logout" type="button" onClick={logout}>Logout</a>
            {isPending ? <div className="loaderbox"><span className="loader"></span></div> : <></>}
        </form>
    );
}

