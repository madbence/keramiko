# keramiko app [![ci status][badge]][ci]

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

[badge]: https://img.shields.io/circleci/project/github/madbence/keramiko.svg
[ci]: https://circleci.com/gh/madbence/keramiko
