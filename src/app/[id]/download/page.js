import { connection } from 'next/server';
import Serve from "./serve.js";

export default async function Download( { params } ) {
    // wait fgor API/cookies/headers/etc. to start rendered
    // and connect to the background API
    await connection();

    const id = (await params).id;
    const status_endpoint = new URL(`/download/${id}.cha`, process.env.API_ENDPOINT);
    const result = (await fetch(status_endpoint));
    const blob = await result.blob();
    let data = {"status": "ok"};
    try {
        let a = JSON.parse(await blob.text());
        data = a;
    } catch(_) {}

    return (
        <div>
            <div className="header">Download Page</div>
            <div style={{fontFamily: "var(--font-robono), monospace", color: "var(--dark-blue)", fontSize: "12px", marginBottom: "10px"}}>{id}</div>
        {(data.status != "error") ? <p className="note">Please save the transcript; the download button below will <b>only be valid for a brief period of time</b>.</p> : <p className="note" style={{color: "var(--orange)"}}><b>This URL is no longer valid.</b></p>}

            {(data.status != "error") ? <Serve name={`${id}.cha`} blob={blob} /> : <></>}
        </div>
    );

}
