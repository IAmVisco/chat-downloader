import csv
from celery import Celery
# from celery.signals import after_task_publish
from chat_downloader import ChatDownloader

celery = Celery(__name__, broker='redis://localhost:6379', backend='redis://localhost:6379')


# @after_task_publish.connect
# def update_sent_state(sender=None, headers=None, **kwargs):
#     task = celery.tasks.get(sender)
#     backend = task.backend if task else celery.backend
#     backend.store_result(headers['id'], None, "SENT")


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
