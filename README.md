# NHost Template for Nuxt

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

[NHost is cool](https://nhost.io/). It's a PostgreSQL database with GraphQL, file storage, and authentication built in. You should check it out.

## Preconfiguration

 - GraphQL support from [`@nuxtjs/apollo`](https://github.com/nuxt-community/apollo-module)
 - Authentication support from [`@nuxtjs/auth`](https://github.com/nuxt-community/auth-module)

### Apollo configuration

There is a configuration for apollo in `plugins/apollo.js` which adds the bearer token to websocket requests (for subscriptions).

### Auth configuration

The authentication has a custom configuration provided by `plugins/refreshScheme.js`. This adds support for the JWT refresh scheme used by NHost.

There is also an auth configuration in `plugins/auth.js` which handles whether a user should be able to access a page.

### Style configuration

This project is preconfigured with [Tailwind](https://tailwindcss.com/). It's pretty awesome, but if you want to use something else, remove the tailwind dependencies and add something new.

## Template setup

From Github, you can click on [`Use this template`](https://github.com/MarcelloTheArcane/nhost-template/generate) to create a new repository based on this one.

Alternatively, you can create a new repository from your terminal:

``` bash
# Clone this repo
$ git clone https://github.com/MarcelloTheArcane/nhost-template -b master --single-branch <project-name>

# Enter the new directory
$ cd <project-name>

# Replace origin with your repository url
$ git remote set-url origin <git repository>

# Send this repository to the remote
$ git push --origin master

# Add template repository
$ git remote add template https://github.com/MarcelloTheArcane/nhost-template
```

## Environment variables

Modify the .env file to use the urls from NHost. You will need to add urls for GraphQL and auth.

## Getting started

``` bash
# Install the dependencies
$ yarn

# Start the development server
$ yarn serve
```

To run in production, use the `start` command

``` bash
$ yarn start
```

### Updating from template

Fetch from the `template` remote. If you cloned via github, you will need to add the remote as above.

``` bash
$ git fetch --all --allow-unrelated-histories
```
