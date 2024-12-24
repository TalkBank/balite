"use client";

import { useEffect } from "react";
import "../globals.css";
import { useRouter }  from "next/navigation";

export default function Refresh() {
    const router = useRouter();

    useEffect(() => {
        let interval = setInterval(() => {
            router.refresh();
        }, 1000);

        return () => {clearInterval(interval);};
    }, []);

    return (
        <a className="refresh-button" onClick={() => {
            router.refresh();
        }} ><span className="material-symbols-outlined">refresh</span></a>
    );
}
