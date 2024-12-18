import Home from "./home.js";
import Auth from "./auth.js";

export default async function App() {
    const data = await (await fetch('https://sla2.talkbank.org/sessionHasAuth', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({rootName: 'data', path: 'whisper'})
    })).json();

    // ignore auth state for now

    return <Home />;
}

