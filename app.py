from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app)

connection = psycopg.connect(
    host='localhost',
    dbname='todolist',
    user='postgres',
    password='password',
)

@app.route('/todo-lists', methods=['GET'])
def get_todo_lists():
    sql = 'SELECT * FROM list;'
    todo_lists = []

    with connection.cursor() as cursor:
        cursor.execute(sql)
        rows = cursor.fetchall()
        for row in rows:
            todo_lists.append({
                'id': row[0],
                'work': row[1]
            })
    return jsonify(todo_lists)

@app.route('/todo-lists', methods=['POST'])
def post_todo_list():

    sql = '''
    SELECT id FROM list;
    '''
    result = connection.execute(sql)
    key = []
    for row in result:
        key.append(row[0])
    new_key = 1
    while True:
        if new_key not in key:
            break
        new_key += 1
    content = request.get_json()

    try:
        sql = '''
        INSERT INTO list (id, work)
        VALUES
        (%(id)s, %(work)s);
        '''
        connection.execute(sql,{'id': new_key, 'work': content["work"]})
    except Exception:
        connection.rollback()
    else:
        connection.commit()

    return jsonify({'message': 'created'})

@app.route('/todo-lists/<int:id>', methods=['POST'])
def delete_todo_list(id):
    try:
        sql = '''
        DELETE FROM list WHERE id = %(id)s
        '''
        connection.execute(sql,{'id': id})
    except Exception:
        connection.rollback()
    else:
        connection.commit()

    return jsonify({'message': 'created'})

if __name__ == '__main__':
    app.run(debug=True)
