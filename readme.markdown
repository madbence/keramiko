# keramiko app [![ci status][badge]][ci] [![coverage status][coverage-badge]][coverage]

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
[coverage]: https://coveralls.io/github/madbence/keramiko?branch=master
[coverage-badge]: https://coveralls.io/repos/github/madbence/keramiko/badge.svg?branch=master
