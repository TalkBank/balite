import { connection } from 'next/server';
import Refresh from "../components/refresh.js";
import Link from 'next/link';

import { headers } from "next/headers";

export const revalidate = 1;

export default async function Status( { params } ) {
    // wait fgor API/cookies/headers/etc. to start rendered
    // and connect to the background API
    await connection();

    const id = (await params).id;
    const status_endpoint = new URL(id,
                                    process.env.API_ENDPOINT);
    const data = await (await fetch(status_endpoint)).json();

    const headerList = await headers();
    const pathname = headerList.get("x-current-path");

    return (
        <div>
            <div className="header">Job status
                <Refresh />
            </div>
            {(data.detail != "success") ? <p className="note">Save a <Link className="link" href={pathname}>link to this page</Link> to check the status of your job.</p> :<p className="note">Visit the link below to download your transcript.</p> }
            <br />
            <div className="info-pane">
                <div className="info-pane-row">
                    <span className="job-pane-row-left">Job ID</span>
                    <span className="job-pane-row-right"><span className="job-id">{id}</span></span>
                </div>

                <div className="info-pane-row">
                    <span className="job-pane-row-left">Status</span>
                    <span className="job-pane-row-right">
                        {(() => {
                            if (data.detail == "pending") {
                                return (
                                    <span className="job-status-badge job-status-pending">Pending</span>
                                );
                            } else if (data.detail == "started") {
                                return (
                                    <span className="job-status-badge job-status-started">Running</span>
                                );
                            } else if (data.detail == "success") {
                                return (
                                    <span className="job-status-badge job-status-success">Success</span>
                                );
                            } else if (data.detail == "failure") {
                                return (
                                    <span className="job-status-badge job-status-failure">Failure</span>
                                );
                            } else {
                                return (
                                    <span className="job-status-badge job-status-unknown">Unknown</span>
                                );
                            }
                        })()}
                    </span>
                </div>

                {(data.detail == "success") ?
                 <div className="download">
                     <Link className="underline" href={`/${id}/download`}>Visit Download Link</Link>
                 </div>
                 : 
                 <>
                     <br />
                     <div className="info-pane-row">
                         <div className="block job-pane-row-left">Information</div>
                         <br />
                         <div className="block job-pane-row-right">{data.message}</div>
                     </div>

                     {(data.detail == "failure") ? <div>
                                                       <span className="error-message">{data.payload}</span>

                                                   </div> : <></>}
                 </>
                }
            </div>
        </div>
    );
}


