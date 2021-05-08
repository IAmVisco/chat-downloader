import os
from time import time
from celery import Celery
from celery.signals import after_task_publish
from chat_downloader import ChatDownloader
from chat_downloader.errors import NoChatReplay
from youtube_dl import YoutubeDL

celery = Celery(__name__)
celery.conf.broker_url = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379")
celery.conf.result_backend = os.environ.get("CELERY_RESULT_BACKEND", "redis://localhost:6379")

CUSTOM_SENT_STATE = 'SENT'

@after_task_publish.connect
def update_sent_state(sender=None, headers=None, **kwargs):
    task = celery.tasks.get(sender)
    backend = task.backend if task else celery.backend
    backend.store_result(headers['id'], None, CUSTOM_SENT_STATE)


@celery.task()
def retrieve_chat(url, sc_only):
    # https://github.com/xenova/chat-downloader/issues/85#issuecomment-813662554
    with YoutubeDL({'cookiefile': 'cookies.ytdl', 'skip_download': True}) as ytdl:
        ytdl.download([url])
    cookies = open('cookies.ytdl', 'r').read().replace('\t0\t', '\t{:.0f}\t'.format(time() + 60 * 60 * 24 * 90))
    open('cookies.ytdl', 'w').write(cookies)

    message_types = ['paid_message'] if sc_only else None
    try:
        chat = ChatDownloader(cookies='cookies.ytdl').get_chat(url, message_types=message_types)
        # TODO: insert empty chat check
        messages = []
        for message in chat:
            messages.append({
                'time': message.get('time_in_seconds'),
                'time_text': message.get('time_text'),
                'amount': message.get('money', {}).get('text'),
                'author': message.get('author', {}).get('name'),
                'message': message.get('message')
            })

        return messages
    except NoChatReplay as ex:
        return str(ex)
