import csv
from flask import Flask, render_template, request, jsonify, send_file
import urllib.parse as urlparse
from urllib.parse import parse_qs

from tasks import retrieve_chat, celery

app = Flask(__name__)


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
        return jsonify(task.result)
    else:
        return jsonify({'error': 'Task did not succeed.'}), 400


@app.route('/chat/<task_id>/csv', methods=['GET'])
def download_csv(task_id):
    task = celery.AsyncResult(task_id)
    if task.state == 'SUCCESS':
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
    url = request.json['url']
    parsed = urlparse.urlparse(url)
    video_id = parse_qs(parsed.query)['v'][0]
    task = retrieve_chat.apply_async((url,), task_id=video_id)
    return jsonify({'id': task.id}), 202


if __name__ == '__main__':
    app.run()
