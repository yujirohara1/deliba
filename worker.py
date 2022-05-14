import os

import redis
from rq import Worker, Queue, Connection

listen = ['high', 'default', 'low']

# redis_url = os.getenv('REDISTOGO_URL', 'redis://localhost:6379') #開発用
redis_url = os.getenv('REDISTOGO_URL') #本番用

conn = redis.from_url(redis_url)

# app = create_app()
# app.app_context().push()

if __name__ == '__main__':
    with Connection(conn):
        worker = Worker(map(Queue, listen))
        worker.work()
