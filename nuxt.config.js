require('dotenv').config()

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {
      src: '~plugins/apollo.js',
      mode: 'client'
    }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    // Doc: https://github.com/nuxt-community/apollo-module
    '@nuxtjs/apollo',
    // Doc: https://auth.nuxtjs.org/
    '@nuxtjs/auth',
    // Doc: https://github.com/microcipcip/cookie-universal
    'cookie-universal-nuxt'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Apollo configuration
  */
  apollo: {
    tokenName: 'auth.jwt_token',
    clientConfigs: {
      default: {
        httpEndpoint: process.env.HASURA_HTTP_URL,
        httpLinkOptions: {
          includeExtensions: true
        },
        wsEndpoint: process.env.HASURA_WSS_URL
      }
    }
  },
  auth: {
    strategies: {
      refresh: {
        _scheme: '~/plugins/refreshScheme.js',
        prefix: 'auth',
        endpoints: {
          login: {
            url: process.env.NHOST_LOGIN_URL,
            method: 'post',
            token: 'jwt_token'
          },
          refresh: {
            url: process.env.NHOST_REFRESH_URL,
            method: 'post',
            token: 'refresh_token'
          },
          logout: false,
          user: {
            url: process.env.NHOST_USER_URL,
            method: 'get',
            propertyName: 'user'
          }
        }
      }
    },
    plugins: [
      '~plugins/auth.js'
    ]
  },
  /*
  ** Build configuration
  */
  build: {
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
      }

      config.node = {
        fs: 'empty'
      }
    }
  }
}
