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

``` bash
# Clone this repo
$ git clone https://github.com/MarcelloTheArcane/nhost-template -b master --single-branch <project-name>
```

## Environment variables

Modify the .env file to use the urls from NHost. You will need to add urls for GraphQL and auth.

## Getting started

``` bash
# Install dependencies
$ yarn

# Start the development server
$ yarn serve
```