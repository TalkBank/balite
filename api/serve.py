import os
from typing import Union
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, FileResponse
from fastapi import (FastAPI, File, UploadFile, Form, BackgroundTasks,
                     HTTPException, Response, status)

from typing import Annotated

import batchalign as ba

from rich.logging import RichHandler
import logging
L = logging.getLogger('uvicorn.error')

from celery import uuid
from celery.result import AsyncResult

from pathlib import Path
WORKDIR = Path(os.getenv("BA2_WORKDIR", ""))
WORKDIR.mkdir(exist_ok=True)

from api.celery import ba_dispatch

app = FastAPI(title="Batchalign2 API Service")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", response_class=HTMLResponse, include_in_schema=False)
async def home():
    return f"""
    <h1><tt>TalkBank | Batchalign Lite</tt></h1>

    <pre>
    The JSON API welcomes you. 

    If you see this screen, it is likely that the BAlite API is correctly setup.
    Visit <a href="/api/redoc">here</a> for a programming guide/API specifications.

    If you are expecting to *use* Batchalign, you have ended up in the wrong place.
    Feel free to reach out to houjun@cmu.edu / macw@cmu.edu for help.
    </pre>
    """

@app.post("/")
async def submit(
        input: list[UploadFile],
        command: Annotated[str, Form(
            title="Command",
            description="The Batchalign pipeline task(s) requested, seperated by commas."
        )],
        lang: Annotated[str, Form(
            title="Language",
            description="The 3-letter ISO language code of the transcript; not respected for transcripts with language already."
        )],
        num_speakers: Annotated[int, Form(
            title="Number of Speakers",
            description="Number of speakers in the audio"
        )],
        response: Response
):
    """Submit a new job to the Batchalign pipeline."""

    audio_file = None
    transcript_file = None

    id = str(uuid())
    workdir = (WORKDIR / id)
    workdir.mkdir(exist_ok=True)

    for i in input:
        if i.filename == "":
            continue # supplied no file
        # we only take one file of each type, so if we
        # haven't gotten it yet, we check if the types match and then
        # append it
        if transcript_file == None and i.filename.endswith(".cha"):
            with open(workdir/i.filename, 'wb') as df:
                df.write((await i.read()))
            transcript_file = workdir/i.filename
        if audio_file == None and (not i.filename.endswith(".cha")):
            with open(workdir/i.filename, 'wb') as df:
                df.write((await i.read()))
            audio_file = workdir/i.filename

    # validate transcirpt, if exists
    doc = ba.Document()
    if transcript_file:
        try:
            doc = ba.CHATFile(path=transcript_file).doc
        except ba.CHATValidationException as e:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return {"payload": str(e), "status": "error", "detail": "bad_format", "message": "We recieved a badly formatted CHAT transcript and it didn't pass validation."}
    if audio_file and not transcript_file:
        doc = ba.Document.new(media_path=str(audio_file), lang=lang)

    if not transcript_file and not audio_file:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"payload": "", "status": "error", "detail": "missing_documents", "message": "We recieved no audio or transcripts."}

    # weeeeee
    task = ba_dispatch.apply_async((command, doc.model_dump(),
                                    lang, num_speakers), task_id=id)

    return {"payload": task.id, "status": "ok", "detail": "submitted", "message": "Your annotation job is submitted"}

@app.get("/{id}")
async def poll(id):
    """Get status of processed job."""

    id = id.strip()
    task = AsyncResult(id)
    status = task.status

    if status == "PENDING":
        return {"detail": "pending", "status": "ok", "message": "Your annotation job is waiting in queue to be executed, or doesn't exist.", "payload": ""}
    elif status == "STARTED":
        return {"detail": "started", "status": "ok", "message": "Your annotation job has started and hasn't yet finished.", "payload": ""}
    elif status == "RETRY":
        return {"detail": "retry", "status": "ok", "message": "Your annotation job is being retried, possibly due to recoverable failure.", "payload": ""}
    elif status == "FAILURE":
        return {"detail": "failure", "status": "ok", "message": "Your annotation job has failed.", "payload": str(task.result)}
    elif status == "SUCCESS":
        return {"detail": "success", "status": "ok", "message": "Your annotation job has succeeded.", "payload": id}

@app.get("/download/{id}.cha")
async def get(id, response: Response):
    """Get processed job."""

    id = id.strip()
    task = AsyncResult(id)

    if task.status != "SUCCESS":
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"payload": task.id, "status": "error", "detail": "missing_transcript", "message": "You are trying to access the transcript of a missing, failed, running, or pending job, which doesn't exist."}

    result = ba.Document.model_validate(task.get())
    cha = ba.CHATFile(doc=result)

    with open(WORKDIR / id / "out.cha", "w") as df:
        df.write(str(cha))

    return FileResponse(WORKDIR / id / "out.cha", media_type='application/octet-stream')
