## First-time Setup

Install Poetry:

```shell
pip install poetry
poetry config virtualenvs.in-project true
```

_NOTE: If forgot to do the `in-project` option try moving the `~/.cache` directory as that is where these will be stored
but be aware that other things are in there and deleting it might cause you to have to resync/reauth for some services._

## Dependency Changes

Install dependencies:

```shell
poetry install
```

## Development Flow

Setup Environment:

```shell
poetry shell
```

Note: Running the following is a complete DB wipe and rebuild:

```shell
rm -rf ./db.sqlite3; ./authuser/migrations/000*; ./blockmonitor/migrations/000*; python manage.py makemigrations && python manage.py migrate && python manage.py createsuperuser && python manage.py runserver
```

To Clean Up:

```shell
rm -f ./db.sqlite3
rm -f ./authuser/migrations/000*
rm -f ./blockmonitor/migrations/000*
```

Generate DB Migrations and do the Migrate:

```shell
python manage.py makemigrations
python manage.py migrate
```

Create the admin account:

```shell
python manage.py createsuperuser
```

Run server:

```shell
python manage.py runserver
```

# Front-End

See [Front-End README](frontend/README.md)
