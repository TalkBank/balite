from celery import Celery
import batchalign as ba

grunt = Celery('api',
             broker='amqp://guest@localhost',
             backend='rpc://')

grunt.conf.task_track_started = True
grunt.conf.task_ignore_result = False
grunt.conf.broker_connection_retry_on_startup = True

@grunt.task()
def ba_dispatch(packages, document, lang="eng", num_speakers=2, **kwargs):
    doc = ba.Document.model_validate(document)
    pipeline = ba.BatchalignPipeline.new(packages, lang=lang,
                                         num_speakers=num_speakers, **kwargs)

    # weeeeeeeeeeeee
    doc = pipeline(doc)

    return doc.model_dump()

if __name__ == '__main__':
    grunt.start()
