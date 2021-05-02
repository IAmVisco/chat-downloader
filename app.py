from flask import Flask, render_template, request, jsonify
from tasks import retrieve_chat, celery

app = Flask(__name__)


@app.route('/', methods=['GET'])
def hello_world():
    return render_template('home.html')


@app.route('/chats', methods=['GET', 'POST'])
def chat_handler():
    if request.method == 'POST':
        body = request.json
        # task = retrieve_chat.delay(body['url'])
        task = retrieve_chat(body['url'])
        return jsonify({'id': task}), 202
    else:
        return jsonify([])


@app.route('/task/<task_id>')
def get_status(task_id):
    task_result = celery.AsyncResult(task_id)
    return str(task_result.result)


if __name__ == '__main__':
    app.run()
