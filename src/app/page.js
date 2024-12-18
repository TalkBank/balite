import "./home.css";
import Form from "./form.js";
import { redirect } from 'next/navigation';

export default function Home() {
    async function submitForm(previousState, formData) {
        "use server";

        const submit_endpoint = new URL(process.env.API_ENDPOINT);
        let data = {};
        try {
            data = await (await fetch(submit_endpoint, {
                method: "POST",
                body: formData
            })).json();
        } catch (_) {
            // the server has gone crazy
            let encoded = encodeURIComponent(JSON.stringify({"message": "We encountered an internal server error when processing your transcript. Please try again or reach out for help.", "payload": ""}));
            redirect(`/?error=${encoded}`);
        }

        if (data.detail == "submitted") {
            redirect(`/${data.payload}`);
        } else {
            let encoded = encodeURIComponent(JSON.stringify(data));
            redirect(`/?error=${encoded}`);
        }

        return {}; // dead code
    }

    return (
        <div>
            <div className="header">Hello, let's get analyzing!</div>
            What task and resources are we working with today?
            <div style={{height: 13}}>&nbsp;</div>
            <Form submitForm={submitForm} />
        </div>

    );
}
