import "./home.css";
import Form from "./form.js";
import { redirect } from 'next/navigation';

export default function Home() {
    async function submitForm(previousState, formData) {
        "use server";

        const submit_endpoint = new URL(process.env.API_ENDPOINT);
        
        // Extract shared parameters
        const command = formData.get('command');
        const lang = formData.get('lang');
        const num_speakers = formData.get('num_speakers');
        
        // Find all resource inputs (input_0, input_1, etc.)
        const resourceInputs = [];
        for (const [key, value] of formData.entries()) {
            if (key.startsWith('input_') && value instanceof File) {
                const resourceId = key.replace('input_', '');
                if (!resourceInputs[resourceId]) {
                    resourceInputs[resourceId] = [];
                }
                resourceInputs[resourceId].push(value);
            }
        }
        
        // Convert to array and filter out empty slots
        const resources = Object.values(resourceInputs).filter(files => files.length > 0);
        
        const payloads = [];
        
        // Submit each resource separately
        for (const files of resources) {
            const resourceFormData = new FormData();
            resourceFormData.append('command', command);
            resourceFormData.append('lang', lang);
            resourceFormData.append('num_speakers', num_speakers);
            
            // Add all files for this resource
            files.forEach(file => {
                resourceFormData.append('input', file);
            });
            
            let data = {};
            try {
                data = await (await fetch(submit_endpoint, {
                    method: "POST",
                    body: resourceFormData
                })).json();
            } catch (_) {
                // If any fetch fails, fail everything
                let encoded = encodeURIComponent(JSON.stringify({"message": "We encountered an internal server error when processing your transcript. Please try again or reach out for help.", "payload": ""}));
                redirect(`/?error=${encoded}`);
            }
            
            if (data.detail == "submitted") {
                payloads.push(data.payload);
            } else {
                // If any submission fails, show the error
                let encoded = encodeURIComponent(JSON.stringify(data));
                redirect(`/?error=${encoded}`);
            }
        }
        
        // If all succeeded, redirect to comma-separated payload list
        redirect(`/${payloads.join(',')}`);
        
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
