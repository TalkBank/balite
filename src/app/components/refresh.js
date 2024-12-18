"use client";

import "../globals.css";
import { useRouter }  from "next/navigation";

export default function Refresh() {
    const router = useRouter();

    return (
        <a className="refresh-button" onClick={() => {
            router.refresh();
        }} ><span className="material-symbols-outlined">refresh</span></a>
    );
}
