"use client";

import { useEffect, useState, useActionState } from "react";

export default function Form( {submitForm} ) {
    const [state, formAction, isPending] = useActionState(submitForm, {});
    const [error, setError] = useState(undefined);

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


            <label className="job-pane-row-left form-label" htmlFor="input">Resources to Analyze</label> <br />
            <input className="job-pane-row-right form-filedrop" type="file" name="input" multiple required/> <br />

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
            {isPending ? <div className="loaderbox"><span className="loader"></span></div> : <></>}
        </form>
    );
}

