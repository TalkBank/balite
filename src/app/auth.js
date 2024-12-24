"use client";

import {showAuthModal, initAuthModals} from 'https://sla2.talkbank.org/authUI/authModals.js';
import { useState, useEffect } from "react";
import "./auth.css";
import "./home.css";

function greet() {
    let today = new Date();
    let curHr = today.getHours();

    if (curHr < 12) {
        return 'Good morning,';
    } else if (curHr < 18) {
        return 'Good afternoon,';
    } else {
        return 'Good evening,';
    }
}

export default function Auth( { state } ) {
    const [greeting, setGreeting] = useState(greet());
    console.log(state);

    useEffect(() => {
        (async () => {
            await initAuthModals(
                'https://sla2.talkbank.org',
                () => {console.log("hey!");},
                () => {console.log("bye!");},
                "auth",
                true
            );
        })();

    }, []);

    useEffect(() => {
        setGreeting(greet());
    });


    return (
        <div>
            <div className="header" style={{fontSize: 19}}>{greeting} and welcome to
                <span style={{fontFamily: "var(--font-kanit)",
                              fontVariant: "small-caps",
                              fontWeight: 700,
                              fontStyle: "italic",
                             }}> Batchalign </span></div>
            <p>Please, <span className="submit" onClick={showAuthModal}>log in</span> to get started.</p>
            <p className="smallnote">If you don't yet have access but wish to use this hosted version of Batchalign, please contact Brian MacWhinney by reaching out <a href="mailto:macw@cmu.edu" className="link">by email</a>. You can also perform analysis on-premises using <a className="link" href="https://github.com/talkbank/batchalign2" target="_blank" rel="noopener noreferrer" >the open-source package</a> which is freely available.</p>
        </div>
    );
}

