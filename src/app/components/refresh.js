"use client";

import "../globals.css";

export default function Refresh() {
    return (
        <a className="refresh-button" onClick={() => {
            window.location.reload();
        }} ><span className="material-symbols-outlined">refresh</span></a>
    );
}
