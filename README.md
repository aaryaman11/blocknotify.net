# blocknotify.net

## Back-End

See [Back-End README](backend/README.md)

## Front-End

See [Front-End README](frontend/README.md)

## Solidity

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
