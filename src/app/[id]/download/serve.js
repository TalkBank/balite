"use client";

import download from "downloadjs";
import { useEffect } from "react";

export default function Serve({name, blob}) {
    return (
        <div className="download">
            <a style={{textDecoration: "underline", cursor: "pointer"}} onClick={() => {
                download(blob, name, "text/plain");
            }}>Get Transcript</a>
        </div>
    );
}

