import config from '@/nuxt.config.js'
import nhost from 'nhost-js-sdk'

export default function ({ $cookies }, inject) {
  nhost.initializeApp(config.nhost.config)

  const auth = nhost.auth()
  const storage = nhost.storage()

  // Add Bearer token cookie for Apollo
  auth.onAuthStateChanged((loggedIn) => {
    if (loggedIn) {
      const token = `Bearer ${auth.getJWTToken()}`
      $cookies.set(config.nhost.tokenName, token, {
        path: '/'
      })
    } else {
      $cookies.remove(config.nhost.tokenName, {
        path: '/'
      })
    }
  })

  // Available as $auth and $storage
  inject('auth', auth)
  inject('storage', storage)
}
