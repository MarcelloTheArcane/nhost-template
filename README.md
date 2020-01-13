# NHost Template for Nuxt

## Preconfiguration

 - GraphQL support from `@nuxtjs/apollo`
 - Authentication support from `@nuxtjs/auth`

### Apollo configuration

There is a configuration for apollo in `plugins/apollo.js` which 
adds the bearer token to websocket requests (for subscriptions).

### Auth configuration

The authentication has a custom configuration provided by
`plugins/refreshScheme.js`. This adds support for the JWT refresh
scheme used by NHost.

There is also an auth configuration in `plugins/auth.js` which handles
whether a user should be able to access a page.

## Template setup

``` bash
# Clone this repo
$ git clone https://github.com/MarcelloTheArcane/nhost-template -b master --single-branch project-name
```

## Environment variables

Modify the .env file to use the urls from NHost.

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
