import csv
from typing import Optional

from flask import Flask, render_template, request, jsonify, send_file
import urllib.parse as urlparse
from urllib.parse import parse_qs

from tasks import retrieve_chat, celery, CUSTOM_SENT_STATE

app = Flask(__name__)


def get_video_id(link: str) -> Optional[str]:
    """
    Examples:
    - http://youtu.be/SA2iWivDJiE
    - http://www.youtube.com/watch?v=_oPAwA_Udwc&feature=feedu
    - http://www.youtube.com/embed/SA2iWivDJiE
    - http://www.youtube.com/v/SA2iWivDJiE?version=3&amp;hl=en_US
    """
    query = urlparse.urlparse(link)
    if query.hostname == 'youtu.be':
        return query.path[1:]
    if query.hostname in ('www.youtube.com', 'youtube.com'):
        if query.path == '/watch':
            p = parse_qs(query.query)
            return p['v'][0]
        if query.path[:7] == '/embed/':
            return query.path.split('/')[2]
        if query.path[:3] == '/v/':
            return query.path.split('/')[2]
    return None


@app.route('/', methods=['GET'])
def hello_world():
    return render_template('home.html')


@app.route('/chat/status/<task_id>', methods=['GET'])
def get_task_status(task_id):
    task = celery.AsyncResult(task_id)
    return jsonify({'state': task.state})


@app.route('/chat/<task_id>', methods=['GET'])
def get_chat(task_id):
    task = celery.AsyncResult(task_id)
    if task.state == 'SUCCESS':
        if isinstance(task.result, list):
            return jsonify(task.result)
        else:
            return jsonify({'msg': task.result}), 400
    else:
        return jsonify({'msg': 'Task did not succeed.'}), 400


@app.route('/chat/<task_id>/csv', methods=['GET'])
def download_csv(task_id):
    task = celery.AsyncResult(task_id)
    if task.state == 'SUCCESS' and len(task.result):
        filename = f'{task_id}.csv'
        with open(filename, 'w', newline='', encoding='utf-8') as output_file:
            dict_writer = csv.DictWriter(output_file, task.result[0].keys())
            dict_writer.writeheader()
            dict_writer.writerows(task.result)
        return send_file(filename)
    else:
        return jsonify({'error': 'Task did not succeed.'}), 400


@app.route('/chat', methods=['POST'])
def start_chat_task():
    url = request.json.get('url')
    sc_only_postfix = '-sc' if request.json.get('scOnly') else ''
    video_id = get_video_id(url)
    if not video_id:
        return jsonify({'msg': 'Not a valid YouTube link'}), 400
    task_id = video_id + sc_only_postfix
    task = celery.AsyncResult(task_id)
    if not task.state == CUSTOM_SENT_STATE:
        print(f'Queued new task with id {task_id}')
        task = retrieve_chat.apply_async((url, request.json.get('scOnly')), task_id=task_id)
        return jsonify({'id': task.id}), 202
    return jsonify({'id': task.id}), 200


if __name__ == '__main__':
    app.run()


# ROADMAP:
# Come back later notif
# Browser notifs?
