import csv
import urllib.parse as urlparse
from urllib.parse import parse_qs
from celery import Celery
from chat_downloader import ChatDownloader

celery = Celery(__name__, broker='redis://localhost:6379', backend='redis://localhost:6379')


@celery.task()
def retrieve_chat(url):
    parsed = urlparse.urlparse(url)
    filename = parse_qs(parsed.query)['v'][0] + '.csv'
    chat = ChatDownloader().get_chat(url, message_types=['paid_message'])
    # TODO: insert empty chat check
    messages = []
    for message in chat:
        messages.append({
            'time': message.get('time_in_seconds'),
            'amount': message.get('money').get('text'),
            'author': message.get('author').get('name'),
            'message': message.get('message')
        })
    with open(filename, 'w', newline='', encoding='utf-8') as output_file:
        dict_writer = csv.DictWriter(output_file, messages[0].keys())
        dict_writer.writeheader()
        dict_writer.writerows(messages)
    return filename
