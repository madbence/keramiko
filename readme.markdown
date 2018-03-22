# keramiko app

## development

```sh
$ docker-compose up
```

## production

Build the production image with `docker build`:

```sh
$ docker build -t keramiko -f Dockerfile.prod .
```

Run the image with `docker run`:

```sh
$ docker run -d keramiko
```

## license

MIT
