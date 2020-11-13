import nhost from 'nhost-js-sdk'
import LocalScheme from '@nuxtjs/auth/lib/schemes/local'

export default class NHostScheme extends LocalScheme {
  // Override `fetchUser` method of `local` scheme
  constructor (ctx, options) {
    super(ctx, options)

    this.cookies = this.$auth.ctx.app.$cookies

    nhost.initializeApp(this.options.config)

    this.auth = nhost.auth()

    this.auth.onAuthStateChanged(this._setCookie.bind(this))
  }

  fetchUser () {
    const user = this.auth.isAuthenticated()
      ? {}
      : null

    this.$auth.setUser(user)
    return
  }

  login ({ email, password }) {
    this.auth.login(email, password)
  }

  _setCookie (isLoggedIn) {
    if (!this.options.tokenRequired) {
      return
    }

    if (isLoggedIn) {
      this.fetchUser()
      const token = `${this.options.tokenType} ${this.auth.getJWTToken()}`
      this.cookies.set(this.options.tokenName, token, {
        path: '/'
      })
    } else {
      this.cookies.remove(this.options.tokenName, {
        path: '/'
      })
    }
  }
}
