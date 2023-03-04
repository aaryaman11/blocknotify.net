FROM python:3.10
ENV PATH /usr/local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/root/.local/bin/

RUN curl -sSL https://install.python-poetry.org | python3 - && poetry config virtualenvs.create false

COPY . /code
WORKDIR /code
EXPOSE 8000

RUN poetry install
CMD python manage.py engine &; python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:8000 &; wait
