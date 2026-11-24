from flask import Flask, request, jsonify
from flask_cors import CORS
from bson import ObjectId
from database import tasks_collection

app = Flask(__name__)
CORS(app)

# Get all tasks
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = list(tasks_collection.find())

    for task in tasks:
        task['_id'] = str(task['_id'])

    return jsonify(tasks)


# Add task
@app.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.json

    if not data or not data.get('text', '').strip():
        return jsonify({'error': 'Task is required'}), 400

    task = {
        'text': data['text'].strip(),
        'completed': False
    }

    result = tasks_collection.insert_one(task)

    task['_id'] = str(result.inserted_id)

    return jsonify(task), 201


# Update task
@app.route('/api/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        data = request.json or {}

        update = {}

        if 'text' in data:
            if not isinstance(data['text'], str) or not data['text'].strip():
                return jsonify({'error': 'Invalid task text'}), 400
            update['text'] = data['text'].strip()

        if 'completed' in data:
            update['completed'] = bool(data['completed'])

        if not update:
            return jsonify({'error': 'Nothing to update'}), 400

        result = tasks_collection.update_one(
            {'_id': ObjectId(task_id)},
            {'$set': update}
        )

        if result.matched_count == 0:
            return jsonify({'error': 'Task not found'}), 404

        task = tasks_collection.find_one({'_id': ObjectId(task_id)})
        task['_id'] = str(task['_id'])

        return jsonify(task)

    except Exception:
        return jsonify({'error': 'Invalid task ID'}), 400


# Delete task
@app.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        result = tasks_collection.delete_one(
            {'_id': ObjectId(task_id)}
        )

        if result.deleted_count == 0:
            return jsonify({'error': 'Task not found'}), 404

        return jsonify({'message': 'Task deleted successfully'})

    except Exception:
        return jsonify({'error': 'Invalid task ID'}), 400


if __name__ == '__main__':
    app.run(debug=True, port=5000)