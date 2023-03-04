#!/bin/sh
echo "Migrating DB..."
python manage.py makemigrations 
python manage.py migrate 
echo "Starting block monitoring engine..."
nohup python manage.py engine &
echo "Starting backend server..."
python manage.py runserver 0.0.0.0:8000

