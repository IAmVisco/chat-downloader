import os
from celery import Celery
from chat_downloader import ChatDownloader

celery = Celery(__name__, broker='redis://localhost:6379', backend='redis://localhost:6379')
celery.conf.broker_url = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379")
celery.conf.result_backend = os.environ.get("CELERY_RESULT_BACKEND", "redis://localhost:6379")


@celery.task()
def retrieve_chat(url):
    chat = ChatDownloader().get_chat(url, message_types=['paid_message'])
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
