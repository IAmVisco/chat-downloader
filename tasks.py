import os
from time import time
from celery import Celery
from chat_downloader import ChatDownloader
from youtube_dl import YoutubeDL

celery = Celery(__name__)
celery.conf.broker_url = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379")
celery.conf.result_backend = os.environ.get("CELERY_RESULT_BACKEND", "redis://localhost:6379")


@celery.task()
def retrieve_chat(url):
    # https://github.com/xenova/chat-downloader/issues/85#issuecomment-813662554
    with YoutubeDL({'cookiefile': 'cookies.ytdl', 'skip_download': True}) as ytdl:
        ytdl.download([url])
    cookies = open('cookies.ytdl', 'r').read().replace('\t0\t', '\t{:.0f}\t'.format(time() + 60 * 60 * 24 * 90))
    open('cookies.ytdl', 'w').write(cookies)

    chat = ChatDownloader(cookies='cookies.ytdl').get_chat(url, message_types=['paid_message'])
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
