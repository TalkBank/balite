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
    const jobIds = id.split('%2C').filter(jobId => jobId.trim() !== '');
    
    // Fetch status for all jobs in parallel
    const jobDataPromises = jobIds.map(async (jobId) => {
        const status_endpoint = new URL(jobId.trim(), process.env.API_ENDPOINT);
        try {
            const response = await fetch(status_endpoint);
            const data = await response.json();
            return { jobId: jobId.trim(), ...data, error: null };
        } catch (error) {
            return { jobId: jobId.trim(), error: error.message, detail: 'error' };
        }
    });
    
    const jobsData = await Promise.all(jobDataPromises);

    const headerList = await headers();
    const pathname = headerList.get("x-current-path");
    
    const truncateJobId = (jobId, maxLength = 12) => {
        if (jobId.length <= maxLength) return jobId;
        return jobId.substring(0, maxLength) + '...';
    };
    
    const downloadLinks = jobsData.filter(job => job.detail === 'success');
    const hasMultipleJobs = jobIds.length > 1;

    return (
        <div>
            <div className="header">{hasMultipleJobs ? 'Jobs Status' : 'Job Status'}
                <Refresh />
            </div>
                <p className="note">Save a <Link className="link" href={pathname}>link to this page</Link> to check the status of your {hasMultipleJobs ? 'jobs' : 'job'}.</p>
            <br />
            <div className="info-pane">
                {/* Jobs Table */}
                <div style={{marginBottom: '15px'}}>
                    <div className="info-pane-row" style={{fontWeight: '600', borderBottom: '1px solid #e5e5e5', paddingBottom: '5px', marginBottom: '8px'}}>
                        <span style={{width: '150px', display: 'inline-block'}}>Job ID</span>
                        <span style={{width: '80px', display: 'inline-block'}}>Status</span>
                        <span style={{display: 'inline-block'}}>Information</span>
                    </div>
                    {jobsData.map((job, index) => (
                        <div key={index} className="info-pane-row"
                             style={{marginBottom: '8px',
                                     display: "flex"}}>
                            <span style={{width: '150px',  display: 'flex', flexDirection:"column", justifyContent:"center"}}>
                                <span style={{marginBottom: "7px"}} className="job-id" title={job.jobId}>{truncateJobId(job.jobId)}</span>
                            </span>
                            <span style={{width: '80px', display: 'flex', flexDirection:"column", justifyContent:"center", paddingRight: "15px"}}>
                                {(() => {
                                    if (job.detail === "pending") {
                                        return <span className="job-status-badge job-status-pending">Pending</span>;
                                    } else if (job.detail === "started") {
                                        return <span className="job-status-badge job-status-started">Running</span>;
                                    } else if (job.detail === "success") {
                                        return <span className="job-status-badge job-status-success">Success</span>;
                                    } else if (job.detail === "failure") {
                                        return <span className="job-status-badge job-status-failure">Failure</span>;
                                    } else if (job.detail === "error") {
                                        return <span className="job-status-badge job-status-failure">Error</span>;
                                    } else {
                                        return <span className="job-status-badge job-status-unknown">Unknown</span>;
                                    }
                                })()}
                            </span>
                            <span style={{
                                display: 'inline-block',
                                flex: '1',
                                maxWidth: "250px",
                                overflow: "hidden"
                            }}>
                                {(() => {
                                    if (job.error) {
                                        return job.error;
                                    } else if (job.detail == "success") {
                                        return (
                                            <div>
                                                {job.message+" "}
                                                <span style={{fontWeight: '600', marginBottom: '10px', color: 'var(--dark-blue)'}}>
                                                    <Link className="underline" href={`/${job.jobId}/download`}>
                                                        Download
                                                    </Link>
                                                </span>

                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div>{job.message}</div>
                                        );
                                    }
                                })()}
                                {job.detail === "failure" && job.payload && (
                                    <div>
                                        <span className="error-message">{job.payload}</span>
                                    </div>
                                )}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


