# Integration test suite

This repository contains our in-depth integration test suite for the [Serverless Framework](http://github.com/serverless/serverless).

## Setup

Run `npm install` to install all the necessary dependencies.

## How to run the tests

Just run `npm test` to run the whole test suite.

## Using Docker

Run `docker-compose run serverless-node bash` to spin up a Docker container which mounts the integration test suite as a
shared volume.
