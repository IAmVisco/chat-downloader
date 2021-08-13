#!/bin/bash

sudo service redis-server status > /dev/null || sudo service redis-server start
celery -A tasks worker --loglevel=info
