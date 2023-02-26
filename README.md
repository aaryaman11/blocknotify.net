blocknotify.net

# Back-End

Install Poetry:

```shell
pip install poetry
poetry config virtualenvs.in-project true
```

_NOTE: If forgot to do the `in-project` option try moving the `~/.cache` directory as that is where these will be stored
but be aware that other things are in there and deleting it might cause you to have to resync/reauth for some services._

Install dependencies:

```shell
poetry install
```

Setup Environment:

```shell
poetry shell
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

Start the service
```shell
python manage.py runserver
```

Run server:
```shell
python manage.py runserver
```

# Front-End

Run server:
```shell
npm start
```
