"use client";

import {showAuthModal, initAuthModals} from 'https://sla2.talkbank.org/authUI/authModals.js';
import { useState, useEffect } from "react";

export default function Auth() {

    useEffect(() => {
        (async () => {
            await initAuthModals(
                'https://sla2.talkbank.org',
                () => {console.log("hey!");},
                () => {console.log("bye!");},
                "chickenPie",
                "bickenBie"
            );
        })();

    }, []);


    return (
        "Authentication is fun and ~~easy~~"
    );
}

